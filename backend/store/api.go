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
	UpdateApi(api model.Api)
	GetApi(apiId string) *model.Api
	DeleteApi(apiId string)
}

func (d *Db) CreateApi(api model.Api) {

	t, err := d.Db.Beginx()

	if err != nil {
		return
	}

	if strings.Contains(api.Id, " ") {
		return
	}

	if _, err := t.Exec("INSERT INTO apis (id,api_id,is_single) VALUES(?,?,?)", api.UniqueId, api.Id, api.IsSingleContent); err != nil {
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

		fmt.Println(f.RelationApiId)

		if _, err := t.Exec("INSERT INTO fields (field_id,api_id,field_name,field_type,relation_api) VALUES(?,?,?,?,?)", strings.ReplaceAll("a"+uuid.New().String(), "-", "_"), api.UniqueId, f.Name, f.Type, f.RelationApiId); err != nil {
			continue
		}
	}
	if err := t.Commit(); err != nil {
		fmt.Println(err.Error())
		return
	}

}

func (d *Db) UpdateApi(id string, api model.Api) {
	d.Db.Exec("UPDATE apis SET api_id = ?, is_single = ?, preview_url = ? WHERE id = ?", api.Id, api.IsSingleContent, api.PreviewURL, id)
}

func (d *Db) GetApis() []model.Api {
	apis := []model.Api{}
	if err := d.Db.Select(&apis, "SELECT * FROM apis"); err != nil {
		fmt.Println(err)
	}
	for i, _ := range apis {
		apis[i].Fields = d.GetFieldsByApiUniqueId(apis[i].UniqueId)
	}
	return apis
}

func (d *Db) GetApiByUniqueId(id string) *model.Api {
	var api model.Api
	var err error
	r := d.Db.QueryRowx("SELECT * FROM apis WHERE id = ?", id)
	err = r.Err()
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	err = r.StructScan(&api)
	if err != nil {
		return nil
	}

	api.Fields = d.GetFieldsByApiUniqueId(api.UniqueId)

	return &api
}

func (d *Db) GetApi(id string) *model.Api {
	var api model.Api
	var err error
	r := d.Db.QueryRowx("SELECT * FROM apis WHERE api_id = ?", id)
	err = r.Err()
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	err = r.StructScan(&api)
	if err != nil {
		return nil
	}

	api.Fields = d.GetFieldsByApiUniqueId(api.UniqueId)

	return &api
}

func (d *Db) DeleteApi(id string) {
	d.Db.Exec("DELETE FROM apis WHERE id = ?", id)
}
