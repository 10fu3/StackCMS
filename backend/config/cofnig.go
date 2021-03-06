package config

import (
	"os"
)

type RelationalDatabaseConfig struct {
	User         string
	Password     string
	Host         string
	Port         string
	DatabaseName string
}

//DB 環境変数
func GetRelationalDatabaseConfig() RelationalDatabaseConfig {
	return RelationalDatabaseConfig{
		User:         os.Getenv("DB_USER"),
		Password:     os.Getenv("DB_PASSWORD"),
		Host:         os.Getenv("DB_HOST"),
		Port:         os.Getenv("DB_PORT"),
		DatabaseName: os.Getenv("DB_NAME"),
	}
}

type DocumentDatabaseConfig struct {
	User         string
	Password     string
	Host         string
	Port         string
	DatabaseName string
}

//DB 環境変数
func GetDocumentDatabaseConfig() DocumentDatabaseConfig {
	return DocumentDatabaseConfig{
		User:         os.Getenv("DB_DOC_USER"),
		Password:     os.Getenv("DB_DOC_PASSWORD"),
		Host:         os.Getenv("DB_DOC_HOST"),
		Port:         os.Getenv("DB_DOC_PORT"),
		DatabaseName: os.Getenv("DB_DOC_NAME"),
	}
}

var Values = GetFirstSetupConfig()

type FirstSetupConfig struct {
	AdminName     string
	AdminPassword string
	AppPort       string
	CreateTable   bool
	UseCloudRun   bool
}

func GetFirstSetupConfig() *FirstSetupConfig {
	adminPass := os.Getenv("APP_ROOT_PASSWORD")
	port := os.Getenv("PORT")

	if adminPass == "" {
		return nil
	}

	createTable := func() bool {
		return os.Getenv("CREATE_TABLE") == "true"
	}()

	useCloudRun := func() bool {
		return os.Getenv("CLOUD_RUN") == "true"
	}()

	return &FirstSetupConfig{
		AdminName:     "root",
		AdminPassword: adminPass,
		AppPort:       port,
		CreateTable:   createTable,
		UseCloudRun:   useCloudRun,
	}
}
