package store

import (
	"StackCMS/model"
	"context"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type Contents interface {
	GetContent(query model.GetQuery) interface{}
	CreateContent(apiId string, content model.JSON) error
	UpdateContent(contentId string, content model.JSON) error
	DeleteContent(contentId string) error
	DeleteContentByApiId(apiId string) error
}

func (d *Db) getContents(depth int, api string, uuids []string) interface{} {
	if depth > 4 {
		return nil
	}
	var r []bson.M

	result, e := d.ContentDb.Find(d.Ctx,
		bson.D{{
			Key:   "_id",
			Value: bson.D{{Key: "$in", Value: uuids}},
		}})

	if e != nil {
		return nil
	}

	e = result.All(d.Ctx, &r)

	if e != nil {
		return nil
	}

	fields := d.GetFieldsByApiId(api)

	for _, field := range fields {
		if field.RelationApiId == nil {
			continue
		}
		for _, v := range r {
			v[field.Name] = d.getContents(depth+1, *field.RelationApiId, v[field.Name].([]string))
		}
	}
	return r
}

func (d *Db) GetContent(query model.GetQuery) interface{} {

	api := d.GetApi(query.ApiId)

	if api == nil {
		return nil
	}

	if api.IsSingleContent {
		var r bson.M
		var err error
		result := d.ContentDb.FindOne(Access.Ctx, bson.M{
			"api_id": query.ApiId,
		})
		err = result.Err()
		if err != nil {
			return nil
		}
		err = result.Decode(&r)
		if err != nil {
			return nil
		}
		return r
	}

	definedFields := d.GetFieldsByApiId(query.ApiId)

	findOptions := options.Find()
	findOptions.SetSort(bson.D{{"created_at", -1}})

	if query.Count.Limit == 0 || query.Count.Offset == 0 {
		findOptions.SetLimit(int64(query.Count.Limit))
		findOptions.SetSkip(int64(query.Count.Offset))
	}

	if len(query.Fields) > 0 {
		fields := bson.M{}
		for _, field := range query.Fields {
			fields[field] = 1
		}
		findOptions.SetProjection(fields)
	}

	query.Filter["api_id"] = query.ApiId

	find, err := d.ContentDb.Find(Access.Ctx, query.Filter, findOptions)
	if err != nil {
		return nil
	}
	var jsonResult []bson.M

	err = find.All(d.Ctx, &jsonResult)

	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	for _, field := range definedFields {
		if field.RelationApiId == nil {
			continue
		}
		for i, v := range jsonResult {
			mongoDbUuids := v[field.Name].(bson.A)
			var uuids []string
			for _, u := range mongoDbUuids {
				uuids = append(uuids, u.(string))
			}

			r := d.getContents(1, *field.RelationApiId, uuids)
			if r == nil {
				continue
			}
			jsonResult[i][field.Name] = r
		}
	}

	return jsonResult
}

func (d *Db) CreateContent(apiId string, content model.JSON) error {

	api := d.GetApi(apiId)

	if api == nil {
		return errors.New("didn't registered api")
	}

	opts := options.Update().SetUpsert(true)
	filter := bson.D{{"_id", func() string {
		if api.IsSingleContent {
			r := d.ContentDb.FindOne(d.Ctx, bson.M{"api_id": api.Id})
			var same map[string]interface{}
			var err = r.Decode(&same)
			if r != nil && err == nil {
				return (same["_id"]).(string)
			}
		}
		return uuid.NewString()
	}()}}
	content["api_id"] = apiId
	content["created_at"] = time.Now()
	content["updated_at"] = time.Now()

	r, e := d.ContentDb.UpdateOne(Access.Ctx, filter, bson.D{{"$set", content}}, opts)

	if e != nil {
		return e
	} else {
		fmt.Println(r.UpsertedID)
	}

	return nil
}

func (d *Db) UpdateContent(contentId string, content model.JSON) error {
	f := d.ContentDb.FindOne(context.Background(), bson.D{{"_id", contentId}})
	if f == nil || f.Err() != nil {
		return errors.New("error occurred")
	}
	old := model.JSON{}
	if f.Decode(&old) != nil {
		return errors.New("error occurred")
	}
	content["api_id"] = old["api_id"]
	content["created_at"] = old["create_at"]
	delete(content, "_id")

	_, e := d.ContentDb.UpdateOne(Access.Ctx,
		bson.M{"_id": contentId},
		bson.D{
			{"$set", content},
		})
	return e
}

func (d *Db) DeleteContent(contentId string) error {
	_, e := d.ContentDb.DeleteOne(Access.Ctx, bson.M{"_id": contentId})
	return e
}

func (d *Db) DeleteContentByApiId(apiId string) error {
	_, e := d.ContentDb.DeleteMany(Access.Ctx, bson.M{"api_id": apiId})
	return e
}
