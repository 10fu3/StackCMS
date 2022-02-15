package store

import (
	"StackCMS/model"
)

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
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return
		}
	}
	d.Db.Exec("INSERT INTO clients (client_id,client_name,client_secret) VALUES (?,?,?)", client.Id, client.Name, client.Secret)
}

func (d *Db) UpdateClient(client model.Client) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return
		}
	}
	d.Db.Exec("UPDATE clients SET client_name = ?,client_secret = ? WHERE client_id = ?", client.Name, client.Secret, client.Id)
}

func (d *Db) UpdateClientSecret(clientId string, newSecret string) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return
		}
	}
	d.Db.Exec("UPDATE clients SET client_secret = ? WHERE client_id = ?", newSecret, clientId)
}

func (d *Db) GetClients() []model.Client {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return []model.Client{}
		}
	}
	var r []model.Client
	if err := d.Db.Select(&r, "SELECT * FROM clients"); err != nil {
		return []model.Client{}
	}
	if len(r) == 0 {
		return make([]model.Client, 0)
	}
	return r
}

func (d *Db) GetClientById(id string) *model.Client {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return nil
		}
	}
	var r model.Client
	if err := d.Db.Get(&r, "SELECT * FROM clients WHERE client_id = ?", id); err != nil {
		return nil
	}
	r.Ability = d.GetClientAbilityByClientId(id)
	return &r
}

func (d *Db) GetClientBySecret(apiSecret string) *model.Client {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return nil
		}
	}
	var r model.Client
	if d.Db.Get(&r, "SELECT * FROM clients WHERE client_secret = ?", apiSecret) != nil {
		return nil
	}
	return &r
}

func (d *Db) DeleteClientByClientId(clientId string) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return
		}
	}
	d.Db.Exec("DELETE FROM clients WHERE client_id = ?", clientId)
}
