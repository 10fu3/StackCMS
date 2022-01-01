package store

import "StackCMS/model"

type Clients interface {
	CreateClient(client model.Client)
	UpdateClient(client *model.Client)
	GetClients() []model.Client
	GetClientBySecret(apiSecret string) *model.Client
	DeleteClient(apiId string)
}

func (d *Db) CreateClient(client model.Client) {
	panic("implement me")
}

func (d *Db) UpdateClient(client *model.Client) {
	panic("implement me")
}

func (d *Db) GetClients() []model.Client {
	panic("implement me")
}

func (d *Db) GetClientBySecret(apiSecret string) *model.Client {
	panic("implement me")
}

func (d *Db) DeleteClient(apiId string) {
	panic("implement me")
}
