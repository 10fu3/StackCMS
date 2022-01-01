package Setup

import (
	"StackCMS/config"
	"StackCMS/store"
	"context"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonoptions"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"reflect"
	"time"
)

func ConnectDatabase(config config.RelationalDatabaseConfig) (*sqlx.DB, error) {

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", config.User, config.Password, config.Host, config.Port, config.DatabaseName)

	db, err := sqlx.Connect("mysql", dsn+"?parseTime=true")

	if err != nil {
		return nil, err
	}

	return db, nil
}

func DefineTables(db *sqlx.DB) {
	sqls := []string{
		"CREATE TABLE IF NOT EXISTS users (user_id VARCHAR(40) not null primary key, nick_name VARCHAR(128), mail VARCHAR(256), password_hash VARCHAR(512))",
		"CREATE TABLE IF NOT EXISTS login_session (session_id VARCHAR(40) not null primary key, user_id VARCHAR(40), expired_at DATETIME)",
		"CREATE TABLE IF NOT EXISTS roles (role_id VARCHAR(40) not null primary key,role_name VARCHAR(512))",
		"CREATE TABLE IF NOT EXISTS user_role (user_role_id VARCHAR(40) not null primary key,user_id VARCHAR(40),role_id VARCHAR(40))",
		"CREATE TABLE IF NOT EXISTS role_ability(role_ability_id VARCHAR(40) not null primary key,role_id VARCHAR(40),ability_id VARCHAR(512))",
		"CREATE TABLE IF NOT EXISTS apis (api_id VARCHAR(40) not null primary key,is_single BOOLEAN not null)",
		"CREATE TABLE IF NOT EXISTS fields (field_id VARCHAR(40) not null primary key, api_id VARCHAR(40), field_name VARCHAR(40),field_type VARCHAR(40), relation_api VARCHAR(40))",
		"CREATE TABLE IF NOT EXISTS contents (" +
			"content_id VARCHAR(40) not null primary key," +
			"api_id VARCHAR(40)," +
			"created_at DATETIME," +
			"updated_at DATETIME," +
			"published_at DATETIME," +
			"revised_at DATETIME," +
			"created_by VARCHAR(40)," +
			"updated_by VARCHAR(40)," +
			"publish_will DATETIME," +
			"stop_will DATETIME)",
	}

	for _, sql := range sqls {
		_, err := db.Exec(sql)
		if err != nil {
			fmt.Println(err.Error())
		}
	}
}

func DefineRootUser(db *sqlx.DB, setupConfig config.FirstSetupConfig) {

	passHash, _ := bcrypt.GenerateFromPassword([]byte(setupConfig.AdminPassword), 10)

	db.Exec("INSERT INTO users (user_id,nick_name,mail,password_hash) VALUES(?,?,?,?)", "root", "管理者", "root", string(passHash))
}

func Db() error {
	var err error
	store.Access.Db, err = ConnectDatabase(config.GetRelationalDatabaseConfig())
	if err != nil {
		return err
	}
	config.Values = config.GetFirstSetupConfig()
	DefineTables(store.Access.Db)
	DefineRootUser(store.Access.Db, *config.Values)

	var mongoClient *mongo.Client
	var mongoSettings = config.GetDocumentDatabaseConfig()
	store.Access.Ctx = context.TODO()

	dsn := fmt.Sprintf("mongodb://%s:%s@%s/%s", mongoSettings.User, mongoSettings.Password, mongoSettings.Host, "admin")

	fmt.Println(dsn)

	opt := options.Client().ApplyURI(dsn)
	rb := bson.NewRegistryBuilder()
	rb.RegisterTypeDecoder(reflect.TypeOf(time.Time{}), bsoncodec.NewTimeCodec(bsonoptions.TimeCodec().SetUseLocalTimeZone(true)))
	opt.SetRegistry(rb.Build())

	mongoClient, err = mongo.Connect(store.Access.Ctx, opt)
	if err != nil {
		return err
	}

	//if err = mongoClient.Connect(mongoCtx);err != nil{
	//	return err
	//}

	store.Access.ContentDb = mongoClient.Database("stack_cms").Collection("contents")

	return nil
}
