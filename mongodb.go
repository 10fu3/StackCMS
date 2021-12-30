// procon_mongo.go
package main

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type key string

const (
	MongoHost     = "127.0.0.1"
	MongoUser     = "root"
	MongoPassword = "password"
	MongoDb       = "admin"
)

const (
	HostKey     = key("hostKey")
	UsernameKey = key("usernameKey")
	PasswordKey = key("passwordKey")
	DatabaseKey = key("databaseKey")
)

var ctx context.Context
var client *mongo.Client

func init() {
	ctx = context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	ctx = context.WithValue(ctx, HostKey, MongoHost)
	ctx = context.WithValue(ctx, UsernameKey, MongoUser)
	ctx = context.WithValue(ctx, PasswordKey, MongoPassword)
	ctx = context.WithValue(ctx, DatabaseKey, MongoDb)

	uri := fmt.Sprintf(`mongodb://%s:%s@%s/%s`,
		ctx.Value(UsernameKey).(string),
		ctx.Value(PasswordKey).(string),
		ctx.Value(HostKey).(string),
		ctx.Value(DatabaseKey).(string),
	)
	clientOpetions := options.Client().ApplyURI(uri)

	var err error
	client, err = mongo.Connect(ctx, clientOpetions)
	err = client.Ping(ctx, nil)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Mongo Connected")
	}
}

func main() {
	fmt.Println("Connection Test")
}
