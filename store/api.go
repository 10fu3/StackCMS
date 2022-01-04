package store

import (
	"StackCMS/model"
	"StackCMS/util"
	"fmt"
	"github.com/google/uuid"
	"strings"
)

type Apis interface {
	CreateApi(api model.Api)
	GetApi(apiId string) *model.Api
	DeleteApi(apiId string)
}

func (d *Db) CreateApi(api model.Api) {

	t, err := d.Db.Begin()

	if err != nil {
		return
	}

	if strings.Contains(api.Id, " ") {
		return
	}

	if _, err := t.Exec("INSERT INTO apis (api_id,is_single) VALUES(?,?)", api.Id, api.IsSingleContent); err != nil {
		fmt.Println(err.Error())
		return
	}

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

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	for _, f := range api.Fields {
		if util.Contains(baseColumns, f.Id) {
			continue
		}

		if _, err := t.Exec("INSERT INTO fields (field_id,api_id,field_name,field_type,relation_api) VALUES(?,?,?,?,?)", uuid.New().String(), api.Id, f.Id, f.Type, f.RelationApiId); err != nil {
			continue
		}
	}
	if err := t.Commit(); err != nil {
		fmt.Println(err.Error())
		return
	}

}

func (d *Db) GetApis() []model.Api {
	apis := []model.Api{}
	d.Db.Select(&apis, "SELECT * FROM apis")
	for i, _ := range apis {
		apis[i].Fields = d.GetFieldsByApiId(apis[i].Id)
	}
	return apis
}

func (d *Db) GetApi(apiId string) *model.Api {
	var api model.Api
	var err error
	r := d.Db.QueryRowx("SELECT * FROM apis WHERE api_id = ?", apiId)
	err = r.Err()
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	err = r.StructScan(&api)
	if err != nil {
		return nil
	}

	api.Fields = d.GetFieldsByApiId(apiId)

	return &api
}

func (d *Db) DeleteApi(apiId string) {
	d.Db.Exec("DELETE FROM apis WHERE api_id = ?", apiId)
}
