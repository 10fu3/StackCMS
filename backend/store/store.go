package store

import (
	"context"
	"github.com/jmoiron/sqlx"
	"go.mongodb.org/mongo-driver/mongo"
)

type Db struct {
	Db        *sqlx.DB
	ContentDb *mongo.Database
	Ctx       context.Context
}

type DB struct {
	Db *sqlx.DB
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
