package store

import (
	"StackCMS/model"
	"StackCMS/util"
	"fmt"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
)

type ContentFields interface {
	CreateFields(apiId string, fields []model.Field, isUpdate bool)
	GetFieldsByApiUniqueId(apiId string) []model.Field
	DeleteFieldsByApiUniqueId(apiId string)
	DeleteField(field model.Field)
}

func (d *Db) CreateFields(apiId string, fields []model.Field, isUpdate bool) {

	baseColumns := []string{
		"_id",
		"created_at",
		"created_by",
		"deleted_at",
		"published_at",
		"api_id",
		"revised_at",
		"updated_at",
		"updated_by",
		"publish_will",
		"stop_will",
	}

	t, e := d.Db.Begin()
	if e != nil {
		return
	}

	for _, f := range fields {
		if util.Contains(baseColumns, f.Id) {
			continue
		}

		if _, err := t.Exec("INSERT INTO fields (field_id,api_id,field_name,field_type,relation_api) VALUES(?,?,?,?,?)",
			func() string {
				if isUpdate {
					return strings.ReplaceAll(f.Id, "-", "_")
				}
				return strings.ReplaceAll("a"+uuid.New().String(), "-", "_")
			}(),
			apiId, f.Name, f.Type, f.RelationApiId); err != nil {
			continue
		}
	}
	if t.Commit() == nil {
		for _, f := range fields {
			d.ContentDb.Collection(apiId).UpdateMany(d.Ctx,
				bson.M{
					f.Id: bson.M{
						"$exists": false,
					},
				},
				bson.M{
					"$set": bson.M{
						strings.ReplaceAll(f.Id, "-", "_"): nil,
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

func (d *Db) DeleteFieldsByApiUniqueId(apiId string) {
	d.Db.Exec("DELETE FROM fields WHERE api_id = ?", apiId)
}

func (d *Db) DeleteField(field model.Field) {
	d.Db.Exec("DELETE FROM fields WHERE field_id = ? AND api_id = ?", field.Id, field.ApiId)
}

func (d *Db) DeleteFieldByRelationApi(relationApiUnique string) {
	d.Db.Exec("DELETE FROM fields WHERE relation_api = ?", relationApiUnique)
}
