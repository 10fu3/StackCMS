package store

import (
	"StackCMS/model"
)

type Webhooks interface {
	CreateWebhook(hook model.WebHook)
	UpdateWebhook(hook model.WebHook)
	GetWebhooks() []model.WebHook
	DeleteWebhookById(id string)
	DeleteWebhookByApi(api string)
}

func (d *Db) CreateWebhook(hook model.WebHook) {
	d.Db.Exec("INSERT INTO webhooks (webhook_id,webhook_api_id,webhook_url,webhook_name,webhook_is_active,webhook_secret) "+
		"VALUES (?,?,?,?,?,?) ",
		hook.Id, hook.ApiId, hook.Url, hook.Name, hook.IsActive, hook.Secret)
}

func (d *Db) UpdateWebhook(hook model.WebHook) {
	d.Db.Exec("UPDATE webhooks (webhook_api_id = ?,webhook_url = ?,webhook_name = ?,webhook_is_active = ?, webhook_secret = ?) WHERE webhook_id = ? ",
		hook.ApiId, hook.Url, hook.Name, hook.IsActive, hook.Secret, hook.Id)
}

func (d *Db) GetWebhooks() []model.WebHook {
	var r []model.WebHook
	d.Db.Select(&r, "SELECT * FROM webhooks")
	return r
}

func (d *Db) GetWebhook(id string) *model.WebHook {
	var r model.WebHook
	if d.Db.Get(&r, "SELECT * FROM webhooks WHERE webhook_id = ?", id) != nil {
		return nil
	}
	return &r
}

func (d *Db) DeleteWebhookById(id string) {
	d.Db.Exec("DELETE webhooks WHERE webhook_id = ?", id)
}

func (d *Db) DeleteWebhookByApi(api string) {
	d.Db.Exec("DELETE webhooks WHERE webhook_api_id = ?", api)
}
