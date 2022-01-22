package Setup

import (
	"StackCMS/config"
	"StackCMS/model"
	"StackCMS/model/SqlError"
	"StackCMS/store"
	"context"
	"fmt"
	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
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

func DefineTables(db *sqlx.DB) error {
	sqls := []string{
		"CREATE TABLE IF NOT EXISTS users (user_id VARCHAR(40) not null , nick_name VARCHAR(128), mail VARCHAR(256) not null , password_hash VARCHAR(512),is_lock BOOLEAN not null , primary key (user_id,mail))",
		"CREATE TABLE IF NOT EXISTS login_session (session_id VARCHAR(40) not null primary key, user_id VARCHAR(40), expired_at DATETIME)",
		"CREATE TABLE IF NOT EXISTS roles (role_id VARCHAR(40) not null primary key,role_name VARCHAR(512) UNIQUE,is_lock BOOLEAN not null)",
		"CREATE TABLE IF NOT EXISTS user_role (user_role_id VARCHAR(80) not null primary key,user_id VARCHAR(40),role_id VARCHAR(40))",
		"CREATE TABLE IF NOT EXISTS role_ability(role_ability_id VARCHAR(80) not null primary key,role_id VARCHAR(40),ability_id VARCHAR(512))",
		"CREATE TABLE IF NOT EXISTS apis (id VARCHAR(40) not null primary key, api_id VARCHAR(40) UNIQUE,is_single BOOLEAN not null)",
		"CREATE TABLE IF NOT EXISTS fields (field_id VARCHAR(40) not null primary key, api_id VARCHAR(40), field_name VARCHAR(40),field_type VARCHAR(40), relation_api VARCHAR(40))",
		"CREATE TABLE IF NOT EXISTS clients (client_id VARCHAR(80) primary key , api_id VARCHAR(80), client_name VARCHAR(80), client_secret VARCHAR(512) not null )",
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

	var err error

	for _, sql := range sqls {
		_, err = db.Exec(sql)
		if err != nil {
			return err
		}
	}
	return nil
}

func DefineRootUser(db *sqlx.DB, setupConfig config.FirstSetupConfig) error {

	passHash, _ := bcrypt.GenerateFromPassword([]byte(setupConfig.AdminPassword), 10)

	_, err := db.Exec("INSERT INTO users (user_id,nick_name,mail,password_hash,is_lock) VALUES(?,?,?,?,?)", "root", "管理者", "root", string(passHash), true)
	return err
}

func DefineAdminRole(db *sqlx.DB) error {
	t, e := db.Beginx()
	roleId := uuid.NewString()
	exeSql := []struct {
		Sql    string
		Args   interface{}
		IsBulk bool
	}{{
		//ロール定義
		Sql: "INSERT INTO roles (role_id,role_name,is_lock) VALUES(?,?,?)",
		Args: []interface{}{
			roleId,
			"管理者ロール",
			true,
		},
	}, {
		//ロールユーザー関係定義
		Sql: "INSERT INTO user_role (user_role_id,user_id,role_id) VALUE (?,?,?)",
		Args: []interface{}{
			"root_" + roleId,
			"root",
			roleId,
		},
	}, {
		Sql: "INSERT INTO role_ability (role_ability_id,role_id,ability_id) VALUES (:role_ability_id,:role_id,:ability_id)",
		Args: func() interface{} {
			var r []interface{}
			for _, ability := range model.GetAllAbility() {
				//reflect.ValueOf(model.RoleAbility{}).Field()
				r = append(r, &model.RoleAbility{
					Id:        roleId + "_" + ability.String(),
					RoleId:    roleId,
					AbilityId: ability.String(),
				})
			}
			return r
		}(),
		IsBulk: true,
	}}
	if e != nil {
		return nil
	}
	for _, s := range exeSql {
		if s.IsBulk {
			if _, err := t.NamedExec(s.Sql, s.Args); err != nil {
				fmt.Println(err.Error())
			}
			continue
		}
		if _, err := t.Exec(s.Sql, s.Args.([]interface{})...); err != nil {
			t.Rollback()
			return err
		}
	}
	t.Commit()
	return nil
}

func Db() error {
	var err error
	store.Access = &store.Db{}
	store.Access.Db, err = ConnectDatabase(config.GetRelationalDatabaseConfig())
	if err != nil {
		return err
	}
	config.Values = config.GetFirstSetupConfig()

	if err = DefineTables(store.Access.Db); err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok {
			if !(SqlError.Error(mysqlErr.Number) == SqlError.DuplicateEntry) {
				return err
			}
		}
	}
	if err = DefineRootUser(store.Access.Db, *config.Values); err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok {
			if !(SqlError.Error(mysqlErr.Number) == SqlError.DuplicateEntry) {
				return err
			}
		}
	}
	if err = DefineAdminRole(store.Access.Db); err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok {
			if !(SqlError.Error(mysqlErr.Number) == SqlError.DuplicateEntry) {
				return err
			}
		}
	}

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
