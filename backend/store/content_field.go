package store

import (
	"StackCMS/model"
	"StackCMS/util"
	"fmt"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
)

type ContentFields interface {
	CreateFields(apiId string, fields []model.Field)
	GetFieldsByApiUniqueId(apiId string) []model.Field
	DeleteFieldsByApiUniqueId(apiId string)
	DeleteField(field model.Field)
	DeleteFields(apiId string, fieldIds []string)
	DeleteFieldByRelationApi(relationApiUnique string)
	UpdateField(fields []model.Field)
	GetFieldsByRelationApi(relationApiUniqueId string) []model.Field
}

func (d *Db) CreateFields(apiId string, fields []model.Field) {
	t, e := d.Db.Begin()
	if e != nil {
		return
	}

	for i, f := range fields {
		if util.Contains(model.DefinedMeta, f.Id) {
			continue
		}

		fields[i].Id = strings.ReplaceAll("a"+uuid.New().String(), "-", "_")

		if _, err := t.Exec("INSERT INTO fields (field_id,api_id,field_name,field_type,relation_api,priority) VALUES(?,?,?,?,?,?)",
			fields[i].Id,
			apiId, f.Name, f.Type, f.RelationApiId, f.Priority); err != nil {
			continue
		}
	}
	if t.Commit() == nil {
		for i, _ := range fields {
			d.ContentDb.Collection(apiId).UpdateMany(d.Ctx,
				bson.M{},
				bson.M{
					"$set": bson.M{
						fields[i].Id: nil,
					},
				})
		}
	}
}

func (d *Db) GetFieldsByApiUniqueId(unique string) []model.Field {
	var r []model.Field
	var err = d.Db.Select(&r, "SELECT * FROM fields WHERE api_id = ?", unique)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	return r
}

func (d *Db) GetFieldsByRelationApi(relationApiUniqueId string) []model.Field {
	var r []model.Field
	var err = d.Db.Select(&r, "SELECT * FROM fields WHERE relation_api = ?", relationApiUniqueId)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	return r
}

func (d *Db) UpdateField(fields []model.Field) {
	if len(fields) == 0 {
		return
	}
	tx, e := d.Db.Beginx()
	if e != nil {
		return
	}
	for _, field := range fields {
		if util.Contains(model.DefinedMeta, field.Name) {
			continue
		}
		if _, e = tx.Exec("UPDATE fields SET api_id = ?,field_name = ?,field_type = ?,relation_api = ?,priority = ? WHERE field_id = ?",
			field.ApiId,
			field.Name,
			field.Type,
			field.RelationApiId,
			field.Priority,
			field.Id,
		); e != nil {
			tx.Rollback()
		}
	}
	if e = tx.Commit(); e != nil {
		return
	}
}

func (d *Db) DeleteFieldsByApiUniqueId(apiId string) {
	d.Db.Exec("DELETE FROM fields WHERE api_id = ?", apiId)
}

func (d *Db) DeleteField(field model.Field) {
	d.Db.Exec("DELETE FROM fields WHERE field_id = ? AND api_id = ?", field.Id, field.ApiId)
}

func (d *Db) DeleteFields(apiId string, fieldIds []string) {

	fieldsIds := []string{}
	for _, f := range fieldIds {
		if util.Contains(model.DefinedMeta, fieldIds) {
			continue
		}
		fieldsIds = append(fieldsIds, f)
	}

	in := "field_id IN (?)"
	q, a, e := sqlx.In(in, fieldsIds)
	if e != nil {
		return
	}
	if _, e = d.Db.Exec("DELETE FROM fields WHERE api_id = ? AND "+q, append([]interface{}{apiId}, a...)...); e != nil {
		return
	}
	d.ContentDb.Collection(apiId).UpdateMany(d.Ctx, bson.M{}, bson.M{
		"$unset": func() bson.M {
			r := bson.M{}
			for _, id := range fieldsIds {
				r[id] = 1
			}
			return r
		}(),
	})
}

func (d *Db) DeleteFieldByRelationApi(relationApiUnique string) {
	d.Db.Exec("DELETE FROM fields WHERE relation_api = ?", relationApiUnique)
}
