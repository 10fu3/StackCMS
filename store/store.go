package store

import (
	"context"
	"github.com/jmoiron/sqlx"
	"go.mongodb.org/mongo-driver/mongo"
)

type Db struct {
	Db        *sqlx.DB
	ContentDb *mongo.Collection
	Ctx       context.Context
}

var Access Db
