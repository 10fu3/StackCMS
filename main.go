package main

import (
	"StackCMS/Setup"
	"StackCMS/config"
	"StackCMS/router"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Values = config.GetFirstSetupConfig()

	if config.Values == nil {
		fmt.Println("config value is invalid.")
		return
	}

	err := Setup.Db()

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	g := gin.Default()

	// CORS 対応
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowHeaders = []string{"authorization"}
	g.Use(cors.New(corsConfig))

	router.RegisterRoute(g)

	g.Run(fmt.Sprintf(":%s", config.Values.AppPort))
}
