package store

import (
	"StackCMS/model"
	"StackCMS/util"
	"context"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
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

func (d *Db) getContents(depth int, api string, uuids []string) []bson.M {
	if depth > 2 {
		return nil
	}

	if len(uuids) == 0 {
		return nil
	}

	parse := func() []bson.M {
		var jsonResult []bson.M
		rToMap := map[string]bson.M{}
		var dbr []model.Content
		var results []bson.M

		find, err := d.ContentDb.Find(d.Ctx,
			bson.D{{
				Key:   "_id",
				Value: bson.D{{Key: "$in", Value: uuids}},
			}})

		if err != nil {
			fmt.Println(err.Error())
			return nil
		}

		if err = find.All(d.Ctx, &jsonResult); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		for _, m := range jsonResult {
			id, ok := m["_id"].(string)
			if !ok {
				continue
			}
			rToMap[id] = m
		}

		ids := func() []interface{} {
			var r []interface{}
			for _, j := range jsonResult {
				r = append(r, j["_id"].(string))
			}
			return r
		}()

		statement, args, err := sqlx.In("SELECT * FROM contents WHERE content_id IN (?)", ids)

		if err != nil {
			fmt.Println(err.Error())
			return nil
		}

		err = d.Db.Select(&dbr, statement, args...)

		dbResults := func() map[string]map[string]interface{} {
			r := map[string]map[string]interface{}{}
			for i := 0; i < len(dbr); i++ {
				r[dbr[i].Id] = dbr[i].ToJson()
			}
			return r
		}()
		if len(dbResults) != len(jsonResult) {
			fmt.Println("not match count")
			return nil
		}

		for i, _ := range dbResults {
			r := dbResults[i]
			for k, v := range rToMap {
				if k == i {
					for k, v := range v {
						r[k] = v
					}
				}
			}
			results = append(results, r)
		}
		return results
	}()

	//relation

	fields := d.GetFieldsByApiUniqueId(api)

	for _, field := range fields {
		if field.RelationApiId == nil {
			continue
		}
		for i, v := range parse {

			r := d.getContents(depth+1, *field.RelationApiId, func() []string {
				c, ok := v[field.Name].(bson.A)
				if !ok {
					return nil
				}
				var l []string
				for _, v := range c {
					l = append(l, v.(string))
				}
				return l
			}())

			if r == nil {
				continue
			}
			parse[i][field.Name] = r
		}
	}
	return parse
}

func (d *Db) GetContent(query model.GetQuery) interface{} {

	api := d.GetApi(query.ApiId)

	if api == nil {
		return nil
	}

	definedFields := func() map[string]model.Field {
		fs := map[string]model.Field{}
		f := d.GetFieldsByApiUniqueId(api.UniqueId)

		for _, s := range model.DefinedMeta {
			f = append(f, model.Field{
				Id:            uuid.NewString(),
				Name:          s,
				ApiId:         api.UniqueId,
				Type:          "default",
				RelationApiId: nil,
			})
		}

		for i, field := range f {
			if (len(query.Fields) > 0 && util.Contains(query.Fields, field.Name)) || len(query.Fields) == 0 {
				fs[field.Name] = f[i]
			}
		}

		fs["_id"] = model.Field{
			Id:            uuid.NewString(),
			Name:          "_id",
			ApiId:         api.UniqueId,
			Type:          "default",
			RelationApiId: nil,
		}

		return fs
	}()

	findOptions := options.Find()
	findOptions.SetLimit(int64(query.Count.Limit))
	findOptions.SetSkip(int64(query.Count.Offset))

	if len(query.Fields) > 0 {
		fields := bson.M{}
		for _, field := range query.Fields {
			fields[field] = 1
		}
		findOptions.SetProjection(fields)
	}

	query.Filter["api_id"] = api.UniqueId

	find, err := d.ContentDb.Find(Access.Ctx, query.Filter, findOptions)
	if err != nil {
		return nil
	}

	parse := func() []map[string]interface{} {
		var jsonResult []bson.M
		var dbr []model.SqlContent

		err = find.All(d.Ctx, &jsonResult)
		if err != nil {
			fmt.Println(err.Error())
			return nil
		}

		ids := func() []interface{} {
			var r []interface{}
			for _, j := range jsonResult {
				r = append(r, j["_id"].(string))
			}
			return r
		}()

		sql := func() string {
			s := "SELECT * FROM contents WHERE content_id IN (?)"
			if !query.GetDraft {
				s += "and published_at is not null "
			}
			return s
		}()

		statement, args, err := sqlx.In(sql+"order by published_at", ids)

		if err != nil {
			fmt.Println(err.Error())
			return nil
		}

		err = d.Db.Select(&dbr, statement, args...)

		dbResults := func() []map[string]interface{} {
			r := []map[string]interface{}{}
			for _, c := range dbr {
				rc := map[string]interface{}{}
				for k, v := range c.ToContent().ToJson() {
					_, ok := definedFields[k]
					if !ok {
						continue
					}
					rc[k] = v
				}
				r = append(r, rc)
			}
			return r
		}()

		for _, m := range jsonResult {
			id, ok := m["_id"].(string)
			if !ok {
				continue
			}

			targetIndex := -1

			for i := 0; i < len(dbResults); i++ {
				if dbResults[i]["_id"].(string) == id {
					targetIndex = i
				}
			}

			if targetIndex == -1 {
				continue
			}

			for f, v := range m {
				field, ok := definedFields[f]
				if !ok {
					continue
				}
				dbResults[targetIndex][field.Name] = v
				if field.RelationApiId == nil {
					continue
				}
				mongoDbUuids, ok := v.(bson.A)
				if !ok {
					continue
				}
				var uuids []string
				for _, u := range mongoDbUuids {
					if u == nil {
						continue
					}
					uuids = append(uuids, u.(string))
				}

				r := d.getContents(1, *field.RelationApiId, uuids)
				if r == nil {
					continue
				}
				dbResults[targetIndex][field.Name] = r
			}
		}
		return dbResults
	}()

	result := map[string]interface{}{}

	result["total_count"] = len(parse)
	result["offset"] = query.Count.Offset
	result["limit"] = query.Count.Limit

	result["content"] = func() []map[string]interface{} {
		if len(parse) == 0 {
			return make([]map[string]interface{}, 0)
		}
		return parse
	}()
	return result
}

func (d *Db) GetContentMetaById(contentId string) *model.Content {
	var r model.SqlContent
	if d.Db.Get(&r, "SELECT * FROM contents WHERE content_id = ?", contentId) != nil {
		return nil
	}
	return r.ToContent()
}

func (d *Db) GetContentMetaByApiId(apiId string) []*model.Content {
	var r []model.SqlContent
	var result []*model.Content
	if d.Db.Select(&r, "SELECT * FROM contents WHERE api_id = ?", apiId) != nil {
		return nil
	}
	for _, content := range r {
		result = append(result, content.ToContent())
	}
	return result
}

func (d *Db) CreateContent(apiId string, createdBy string, content model.JSON) (string, error) {

	api := d.GetApi(apiId)

	if api == nil {
		return "", errors.New("didn't registered api")
	}

	if api.IsSingleContent {
		r := d.ContentDb.FindOne(d.Ctx, bson.M{"api_id": api.UniqueId})
		var same map[string]interface{}
		var err = r.Decode(&same)
		if r != nil && err == nil {
			return "", errors.New("exists content")
		}
	}

	meta := model.NewContent()
	meta.ApiId = api.UniqueId
	meta.CreatedBy = createdBy

	contentId := meta.Id

	if _, e := d.Db.Exec("INSERT INTO contents("+
		"content_id,api_id,created_at,updated_at,published_at,revised_at,created_by,updated_by,publish_will,stop_will) "+
		"VALUES(?,?,?,?,?,?,?,?,?,?)",
		contentId,
		meta.ApiId,
		meta.CreatedAt,
		meta.UpdatedAt,
		meta.PublishedAt,
		meta.RevisedAt,
		meta.CreatedBy,
		meta.UpdatedBy,
		meta.PublishWill,
		meta.StopWill,
	); e != nil {
		return "", e
	}

	content["_id"] = contentId
	content["api_id"] = api.UniqueId

	_, e := d.ContentDb.InsertOne(d.Ctx, content)

	if e != nil {
		return "", e
	}

	return contentId, nil
}

type ContentStatus string

const (
	ContentPublished   ContentStatus = "published"
	ContentUnpublished ContentStatus = "unpublished"
)

func (d *Db) ChangePublishStatusContent(contentId string, publishBy string, changeStatus ContentStatus) error {
	now := time.Now()
	_, e := d.Db.Exec("UPDATE contents SET updated_by = ?, updated_at = ?, published_at = ? WHERE content_id = ?",
		publishBy,
		now,
		func() *time.Time {
			switch changeStatus {
			case "published":
				return &now
			default:
				return nil
			}
		}(),
		contentId)
	return e
}

func (d *Db) UpdateContent(contentId string, updateBy string, content model.JSON) error {
	f := d.ContentDb.FindOne(context.Background(), bson.D{{"_id", contentId}})
	if f == nil || f.Err() != nil {
		return errors.New("error occurred")
	}

	delete(content, "_id")

	_, e := d.ContentDb.UpdateOne(Access.Ctx,
		bson.M{"_id": contentId},
		bson.D{
			{"$set", content},
		})

	if e != nil {
		return e
	}

	var c model.Content
	e = d.Db.Get(&c, "SELECT * FROM contents WHERE content_id = ?", contentId)
	if e != nil {
		return e
	}
	now := time.Now()
	c.UpdatedAt = now
	if c.PublishedAt != nil {
		c.RevisedAt = &now
	}
	d.Db.Exec("UPDATE contents SET update_by = ?, update_at = ?, published_at = ? WHERE content_id = ?", updateBy, c.UpdatedAt, c.PublishedAt, contentId)

	return e
}

func (d *Db) DeleteContent(contentId string) error {
	_, e := d.ContentDb.DeleteOne(Access.Ctx, bson.M{"_id": contentId})
	if e != nil {
		return e
	}
	d.Db.Exec("DELETE FROM contents WHERE content_id = ?", contentId)
	return e
}

func (d *Db) DeleteContentByApiId(apiId string) error {
	_, e := d.ContentDb.DeleteMany(Access.Ctx, bson.M{"api_id": apiId})
	if e != nil {
		return e
	}
	d.Db.Exec("DELETE FROM contents WHERE api_id = ?", apiId)
	return e
}
