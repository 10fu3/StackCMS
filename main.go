package main

import (
	"StackCMS/Setup"
	"StackCMS/config"
	"StackCMS/router"
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Values = config.GetFirstSetupConfig()

	err := Setup.Db()

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	g := gin.Default()

	router.RegisterRoute(g)

	g.Run(":3000")
}
