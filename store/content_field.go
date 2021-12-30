package store

import (
	"StackCMS/model"
	"fmt"
)

type ContentFields interface {
	GetFieldsByApiId(apiId string) []model.Field
	DeleteFieldsByApiId(apiId string)
	DeleteField(field model.Field)
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
