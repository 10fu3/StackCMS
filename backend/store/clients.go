package store

import "StackCMS/model"

type Clients interface {
	CreateClient(client model.Client)
	UpdateClient(client model.Client)
	UpdateClientSecret(clientId string, newSecret string)
	GetClientById(id string) *model.Client
	GetClients() []*model.Client
	GetClientBySecret(secret string) *model.Client
	DeleteClientByApiId(apiId string)
	DeleteClientByClientId(clientId string)
}

func (d *Db) CreateClient(client model.Client) {
	d.Db.Exec("INSERT INTO clients (client_id,client_name,client_secret) VALUES (?,?,?)", client.Id, client.Name, client.Secret)
}

func (d *Db) UpdateClient(client model.Client) {
	d.Db.Exec("UPDATE clients SET (client_name = ?,client_secret = ?) WHERE client_id = ?", client.Name, client.Secret, client.Id)
}

func (d *Db) UpdateClientSecret(clientId string, newSecret string) {
	d.Db.Exec("UPDATE clients SET (client_secret = ?) WHERE client_id = ?", newSecret, clientId)
}

func (d *Db) GetClients() []*model.Client {
	var r []*model.Client
	d.Db.Select(&r, "SELECT * FROM clients")
	return r
}

func (d *Db) GetClientById(id string) *model.Client {
	var r *model.Client
	if d.Db.Get(&r, "SELECT * FROM clients WHERE client_id = ?", id) != nil {
		return nil
	}
	return r
}

func (d *Db) GetClientBySecret(apiSecret string) *model.Client {
	var r *model.Client
	if d.Db.Get(&r, "SELECT * FROM clients WHERE client_secret = ?", apiSecret) != nil {
		return nil
	}
	return r
}

func (d *Db) DeleteClientByClientId(clientId string) {
	d.Db.Exec("DELETE FROM clients WHERE client_id = ?", clientId)
}