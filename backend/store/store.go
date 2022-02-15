package store

import (
	"StackCMS/config"
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"go.mongodb.org/mongo-driver/mongo"
)

type Db struct {
	Db        *sqlx.DB
	ContentDb *mongo.Database
	Ctx       context.Context
}

func ConnectDatabase(config config.RelationalDatabaseConfig) (*sqlx.DB, error) {

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", config.User, config.Password, config.Host, config.Port, config.DatabaseName)

	db, err := sqlx.Connect("mysql", dsn+"?parseTime=true")

	if err != nil {
		return nil, err
	}

	return db, nil
}

func SetupDb() (*Db, error) {
	var err error
	Access = &Db{}
	Access.Db, err = ConnectDatabase(config.GetRelationalDatabaseConfig())
	if err != nil {
		return nil, err
	}

	Access.Db.SetMaxIdleConns(20)
	Access.Db.SetMaxOpenConns(20)
	Access.Db.SetConnMaxLifetime(0)
	return Access, nil
}

type IDb interface {
	Apis
	Clients
	Contents
	LoginSessionStore
	Roles
	RolesAbility
	UsersRole
	Users
	Webhooks
}

var Access *Db
