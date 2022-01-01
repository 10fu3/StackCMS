package store

import (
	"StackCMS/model"
	"StackCMS/util"
	"fmt"
	"github.com/google/uuid"
)

type ContentFields interface {
	CreateFields(apiId string, fields []model.Field)
	GetFieldsByApiId(apiId string) []model.Field
	DeleteFieldsByApiId(apiId string)
	DeleteField(field model.Field)
}

func (d *Db) CreateFields(apiId string, fields []model.Field) {

	baseColumns := []string{
		"_id",
		"content_id",
		"created_at",
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

		if _, err := t.Exec("INSERT INTO fields (field_id,api_id,field_name,field_type,relation_api) VALUES(?,?,?,?,?)", uuid.New().String(), apiId, f.Id, f.Type, f.RelationApiId); err != nil {
			continue
		}
	}
	t.Commit()
}

func (d *Db) GetFieldsByApiId(apiId string) []model.Field {
	var r []model.Field
	var err = d.Db.Select(&r, "SELECT * FROM fields WHERE api_id = ?", apiId)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	return r
}

func (d *Db) DeleteFieldsByApiId(apiId string) {
	d.Db.Exec("DELETE FROM fields WHERE api_id = ?", apiId)
}

func (d *Db) DeleteField(field model.Field) {
	d.Db.Exec("DELETE FROM fields WHERE field_id = ? AND api_id = ?", field.Id, field.ApiId)
}
