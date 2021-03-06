package main

import (
	"StackCMS/Setup"
	"StackCMS/config"
	"StackCMS/router"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	config.Values = config.GetFirstSetupConfig()

	if config.Values == nil {
		fmt.Println("config value is invalid.")
		return
	}

	err := Setup.Db()
	if err == nil {
		err = Setup.ConnectMongoDB()
	}
	g := gin.Default()

	if err == nil {
		corsConfig := cors.DefaultConfig()
		corsConfig.AllowOrigins = []string{"*"}
		corsConfig.AllowHeaders = []string{"authorization"}
		g.Use(cors.New(corsConfig))
		router.RegisterRoute(g)
	} else {
		g.GET("/", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{
				"message": "config_error",
			})
		})
		g.Run(fmt.Sprintf(":%s", config.Values.AppPort))
		return
	}

	g.GET("/", func(ctx *gin.Context) {
		ctx.Status(200)
	})

	g.Run(fmt.Sprintf(":%s", config.Values.AppPort))
}
