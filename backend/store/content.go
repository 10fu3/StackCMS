package store

import (
	"StackCMS/model"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

type Contents interface {
	GetContent(query model.GetQuery) interface{}
	ChangePublishStatusContent(contentId string, publishBy string) error
	CreateContent(apiId string, createdBy string, content model.JSON) (string, error)
	UpdateContent(contentId string, content model.JSON) error
	DeleteContent(contentId string) error
	DeleteContentByApiId(apiId string) error
}

// API -> FieldId -> Field
func getFieldMeta(d *Db) (map[string]map[string]model.Field, map[string]map[string]model.Field) {
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

	return rs, rFieldName
}

func (d *Db) buildQuery(
	query *model.GetQuery,
	apiId string,
	fieldCache map[string]map[string]model.Field,
	fieldNameCache map[string]map[string]model.Field,
	nowDepth int,
	maxDepth int) []bson.M {

	var parent []bson.M

	if maxDepth < nowDepth {
		return parent
	}

	displayFieldNames := map[string]interface{}{}

	if len(fieldCache) == 0 || len(fieldNameCache) == 0 {
		fieldCache, fieldNameCache = getFieldMeta(d)
	}

	if query != nil {
		if len(query.Filter) == 0 {
			query.Filter = map[string]interface{}{}
		}
		if !query.GetDraft {
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
	}

	thisApiFields := fieldCache[apiId]

	for fieldId, field := range thisApiFields {

		if query != nil && len(query.Fields) > 0 {
			if _, ok := query.Fields[field.Name]; !ok {
				continue
			}
		}

		displayFieldNames[field.Name] = "$" + fieldId

		if field.Type != "relation" {
			continue
		}

		option := bson.M{}

		func() {
			if maxDepth > nowDepth && field.Type == "relation" && field.RelationApiId != nil && *field.RelationApiId != "" {

				displayFieldNames[field.Name] = 1

				findResult := d.buildQuery(nil, *field.RelationApiId, fieldCache, fieldNameCache, nowDepth+1, maxDepth)

				if len(findResult) > 0 {
					option["$lookup"] = bson.M{
						"from": *field.RelationApiId,
						"let": bson.M{
							fieldId: "$" + fieldId,
						},
						"pipeline": append([]bson.M{
							{
								"$match": bson.M{
									"$expr": bson.M{
										"$in": []interface{}{
											"$_id",
											"$$" + fieldId,
										},
									},
								},
							},
						}, findResult...),
						"as": field.Name,
					}
				}
			}
		}()
		if len(option) > 0 {
			parent = append(parent, option)
		}
	}

	if (query != nil && len(query.Fields) == 0) || query == nil {
		for _, m := range model.DefinedMeta {
			displayFieldNames[m] = 1
		}
	}

	for _, m := range model.DefinedMeta {
		if query != nil {
			if _, ok := query.Fields[m]; !ok {
				continue
			}
		}
		displayFieldNames[m] = 1
	}

	parent = append(parent, bson.M{
		"$project": displayFieldNames,
	})

	if query != nil && len(query.Filter) > 0 {
		parent = append(parent, bson.M{
			"$match": query.Filter,
		})
	}

	return parent
}

func (d *Db) GetContent(query model.GetQuery) []map[string]interface{} {

	api := d.GetApiByUniqueId(query.ApiId)

	if api == nil {
		return nil
	}

	mondoQuery := d.buildQuery(&query, api.UniqueId, map[string]map[string]model.Field{}, map[string]map[string]model.Field{}, 0, func() int {
		if query.Depth <= 5 && 0 <= query.Depth {
			return query.Depth
		}
		return 0
	}())

	if b, e := json.Marshal(mondoQuery); e == nil {
		fmt.Println(string(b))
	}

	content, err := d.ContentDb.Collection(query.ApiId).Aggregate(d.Ctx, mondoQuery)
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

	for _, k := range []string{
		"_id",
		"created_at",
		"created_by",
		"deleted_at",
		"published_at",
		"revised_at",
		"updated_at",
		"updated_by",
		"publish_will",
		"stop_will",
	} {
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
