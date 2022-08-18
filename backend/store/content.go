package store

import (
	"StackCMS/model"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
	"time"
)

type Contents interface {
	GetContent(query model.GetQuery) []map[string]interface{}
	GetContentMetaById(apiId string, contentId string) *model.Content
	GetContentMetaByApiId(apiId string) []model.Content
	ChangePublishStatusContent(apiId string, contentId string, changeStatus ContentStatus) error
	ChangeDraftKey(apiId string, contentId string) (error, string)
	CreateContent(apiId string, createdBy string, content model.JSON) (string, error)
	UpdateContent(apiId string, contentId string, updateBy string, content model.JSON) error
	DeleteContent(apiId string, contentId string) error
	DeleteContentByApiId(apiId string) error
}

// API -> FieldId -> Field
func getFieldMeta(d *Db) (map[string][]model.Field, map[string]map[string]model.Field) {
	rs := map[string]map[string]model.Field{}
	rFieldName := map[string]map[string]model.Field{}
	for _, api := range d.GetApis() {
		if _, ok := rs[api.UniqueId]; ok {
			continue
		}
		rs[api.UniqueId] = map[string]model.Field{}
		rFieldName[api.UniqueId] = map[string]model.Field{}
		for _, field := range api.Fields {
			rs[api.UniqueId][field.Id] = field
			rFieldName[api.UniqueId][field.Name] = field
		}
	}

	for k, v := range rs {
		for fName, field := range v {
			if field.Type != "relation" {
				continue
			}
			if _, ok := rs[*field.RelationApiId]; !ok {
				delete(rs[k], fName)
				delete(rFieldName[k], fName)
			}
		}
	}

	resultApis := map[string][]model.Field{}
	for api, fieldMap := range rs {
		resultFields := []model.Field{}
		for _, field := range fieldMap {
			resultFields = append(resultFields, field)
		}

		for _, fieldName := range model.DefinedMeta {
			resultFields = append(resultFields, model.Field{
				Id:            fieldName,
				Name:          fieldName,
				ApiId:         api,
				Type:          "meta",
				Priority:      -1,
				RelationApiId: nil,
			})
		}

		resultApis[api] = resultFields
	}

	return resultApis, rFieldName
}

func (d *Db) buildQueryField(
	query *model.GetQuery,
	apiId string,
	fieldCache map[string][]model.Field,
	nowDepth int,
	maxDepth int,
	nestedFieldName string) []bson.M {

	thisApiFields := fieldCache[apiId]
	displayFieldNames := bson.M{}

	var parent []bson.M

	for _, field := range thisApiFields {
		nestedFieldName := func() string {
			if len(nestedFieldName) == 0 {
				return field.Name
			}
			return fmt.Sprintf("%s.%s", nestedFieldName, field.Name)
		}()
		isMatch := func() bool {
			if len(query.Fields) == 0 {
				return true
			}
			for _, s := range query.Fields {
				if len(nestedFieldName) < len(s) && !strings.HasPrefix(s, nestedFieldName) {
					return false
				}
				if len(nestedFieldName) >= len(s) && !strings.HasPrefix(nestedFieldName, s) {
					return false
				}
			}
			return true
		}()

		if !isMatch {
			continue
		}

		displayFieldNames[field.Name] = fmt.Sprintf("$%s", field.Id)

		if field.Type == "meta" {
			displayFieldNames[field.Name] = 1
		}

		if field.Type != "relation" {
			continue
		}

		option := bson.M{}

		if !(maxDepth > nowDepth && field.Type == "relation" && field.RelationApiId != nil && *field.RelationApiId != "") {
			continue
		}

		displayFieldNames[field.Name] = 1

		findResult := d.buildQueryField(
			query,
			*field.RelationApiId,
			fieldCache,
			nowDepth+1,
			maxDepth,
			nestedFieldName)

		if len(findResult) == 0 {
			continue
		}

		option["$lookup"] = bson.M{
			"from": *field.RelationApiId,
			"let": bson.M{
				field.Id: fmt.Sprintf("$%s", field.Id),
			},
			"pipeline": append([]bson.M{
				{
					"$match": bson.M{
						"$expr": bson.M{
							"$in": []interface{}{
								"$_id",
								fmt.Sprintf("$$%s", field.Id),
							},
						},
					},
				},
			}, findResult...),
			"as": field.Name,
		}
		parent = append(parent, option)
	}

	parent = append(parent, bson.M{
		"$project": displayFieldNames,
	})

	return parent
}

func (d *Db) buildQueryRoot(
	query *model.GetQuery,
	apiId string) []bson.M {

	var parent []bson.M

	fieldCache, fieldNameCache := getFieldMeta(d)

	if len(query.Filter) == 0 {
		query.Filter = map[string]interface{}{}
	}
	if !query.GetDraft {
		if query.DraftKey != nil {
			parent = append(parent, bson.M{"$match": bson.M{
				"draft_key": *query.DraftKey,
			}})
		} else {
			parent = append(parent, bson.M{
				"$match": bson.M{
					"$and": []bson.M{{
						"published_at": bson.M{
							"$exists": true,
						},
					}, {
						"published_at": bson.M{
							"$ne": nil,
						},
					}},
				},
			})
		}
	}
	parent = append(parent, bson.M{
		"$sort": func() bson.M {
			if len(query.Order) == 0 {
				if query.GetDraft {
					return bson.M{
						"created_at": -1,
					}
				}
				return bson.M{
					"published_at": -1,
				}
			}
			return func() bson.M {
				option := bson.M{}
				fieldMap := model.DefinedMetaMap
				for _, o := range query.Order {
					if _, ok := fieldMap[o.Field]; ok {
						option[o.Field] = o.DescendingToRaw()
						continue
					}
					option[fieldNameCache[apiId][o.Field].Id] = o.DescendingToRaw()
				}
				return option
			}()
		}(),
	})

	parent = append(parent, d.buildQueryField(query, apiId, fieldCache, 0, func() int {
		if query.Depth < 5 {
			return query.Depth
		}
		return 0
	}(), "")...)

	if len(query.Filter) > 0 {
		parent = append(parent, bson.M{
			"$match": query.Filter,
		})
	}

	if query.Count.Limit > 0 {
		parent = append(parent, bson.M{
			"$limit": query.Count.Limit,
		})
	}

	if query.Count.Offset > 0 {
		parent = append(parent, bson.M{
			"$skip": query.Count.Offset,
		})
	}

	return parent
}

func (d *Db) GetContent(query model.GetQuery) []map[string]interface{} {

	api := d.GetApiByUniqueId(query.ApiId)

	if api == nil {
		return nil
	}

	mongoQuery := d.buildQueryRoot(&query, api.UniqueId)

	if b, e := json.Marshal(mongoQuery); e == nil {
		fmt.Println(string(b))
	}

	content, err := d.ContentDb.Collection(query.ApiId).Aggregate(d.Ctx, mongoQuery)
	if err != nil {
		return nil
	}

	contentResult := []map[string]interface{}{}

	err = content.All(d.Ctx, &contentResult)
	if err != nil {
		return nil
	}

	return contentResult
}

func (d *Db) GetContentMetaById(apiId string, contentId string) *model.Content {
	result := model.Content{}
	queryResult := d.ContentDb.Collection(apiId).FindOne(d.Ctx, bson.M{"_id": contentId})

	if queryResult.Err() != nil {
		return nil
	}

	if err := queryResult.Decode(&result); err != nil {
		return nil
	}

	return &result
}

func (d *Db) GetContentMetaByApiId(apiId string) []model.Content {
	result := []model.Content{}
	find, err := d.ContentDb.Collection(apiId).Find(d.Ctx, map[string]interface{}{})
	if err != nil {
		return nil
	}
	if err = find.All(d.Ctx, &result); err != nil {
		return []model.Content{}
	}
	return result
}

func (d *Db) CreateContent(apiId string, createdBy string, content model.JSON) (string, error) {

	meta := model.NewContent()
	meta.ApiId = apiId
	meta.CreatedBy = createdBy
	meta.UpdatedBy = createdBy

	for _, k := range model.DefinedMeta {
		delete(content, k)
	}

	for _, field := range d.GetFieldsByApiUniqueId(apiId) {
		content[field.Id] = content[field.Name]
		delete(content, field.Name)
	}

	for k, v := range meta.ToJson() {
		content[k] = v
	}

	_, e := d.ContentDb.Collection(apiId).InsertOne(d.Ctx, content)

	if e != nil {
		return "", e
	}

	return meta.Id, nil
}

type ContentStatus string

const (
	ContentPublished   ContentStatus = "published"
	ContentUnpublished ContentStatus = "unpublished"
)

func (d *Db) ChangePublishStatusContent(apiId string, contentId string, changeStatus ContentStatus) error {
	now := time.Now()
	f := d.ContentDb.Collection(apiId).FindOne(context.Background(), bson.D{{"_id", contentId}})
	var c model.Content

	e := f.Decode(&c)

	if e != nil {
		return errors.New("decode error occurred")
	}

	c.UpdatedAt = now
	c.PublishedAt = func() *time.Time {
		switch changeStatus {
		case "published":
			return &now
		default:
			return nil
		}
	}()

	_, e = d.ContentDb.Collection(apiId).UpdateOne(Access.Ctx,
		bson.M{"_id": contentId},
		bson.D{
			{"$set", c.ToJson()},
		})
	if e != nil {
		return e
	}

	return nil
}

func (d *Db) ChangeDraftKey(apiId string, contentId string) (error, string) {
	f := d.ContentDb.Collection(apiId).FindOne(context.Background(), bson.D{{"_id", contentId}})
	var c model.Content
	if err := f.Decode(&c); err != nil {
		return err, ""
	}
	newKey := uuid.NewString()
	c.DraftKey = newKey
	_, err := d.ContentDb.Collection(apiId).UpdateOne(Access.Ctx,
		bson.M{"_id": contentId},
		bson.D{
			{"$set", c.ToJson()},
		})
	if err != nil {
		return err, ""
	}
	return nil, newKey
}

func (d *Db) UpdateContent(apiId string, contentId string, updateBy string, content model.JSON) error {
	f := d.ContentDb.Collection(apiId).FindOne(context.Background(), bson.M{"_id": contentId})

	var c model.Content

	e := f.Decode(&c)

	if f == nil || f.Err() != nil {
		return errors.New("decode error occurred")
	}

	//sanitize
	for _, k := range model.DefinedMeta {
		delete(content, k)
	}

	now := time.Now()
	c.UpdatedAt = now
	if c.PublishedAt != nil {
		c.RevisedAt = &now
	}
	c.UpdatedBy = updateBy

	json := c.ToJson()

	func() {
		fs := map[string]string{}
		for _, field := range d.GetFieldsByApiUniqueId(apiId) {
			fs[field.Name] = field.Id
		}
		for k, v := range content {
			json[fs[k]] = v
		}
	}()

	_, e = d.ContentDb.Collection(apiId).UpdateOne(Access.Ctx,
		bson.M{"_id": contentId},
		bson.D{
			{"$set", json},
		})

	if e != nil {
		return e
	}

	return nil
}

func (d *Db) DeleteContent(apiId string, contentId string) error {
	_, e := d.ContentDb.Collection(apiId).DeleteOne(Access.Ctx, bson.M{"_id": contentId})
	if e != nil {
		return e
	}

	relation := d.GetFieldsByRelationApi(apiId)

	for _, field := range relation {
		_, e := d.ContentDb.Collection(field.ApiId).UpdateOne(d.Ctx,
			bson.M{},
			bson.M{
				"$pull": bson.M{
					field.Id: contentId,
				},
			})
		if e != nil {
			fmt.Println(e.Error())
		}
	}

	//d.Db.Exec("DELETE FROM contents WHERE content_id = ?", contentId)
	return e
}

func (d *Db) DeleteContentByApiId(apiId string) error {
	e := d.ContentDb.Collection(apiId).Drop(d.Ctx)
	if e != nil {
		return e
	}
	d.ContentDb.Collection(apiId).UpdateMany(d.Ctx, map[string]interface{}{}, map[string]interface{}{
		"$unset": bson.M{
			apiId: 1,
		},
	})
	//d.Db.Exec("DELETE FROM contents WHERE api_id = ?", apiId)
	return e
}
