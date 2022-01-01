package model

type Client struct {
	Id     string `db:"client_id"`
	ApiId  string `db:"api_id"`
	Name   string `db:"client_name"`
	Secret string `db:"client_secret"`
}
