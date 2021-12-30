package main

import (
	"StackCMS/Setup"
	"StackCMS/config"
	"StackCMS/model"
	"StackCMS/router"
	"StackCMS/store"
	"StackCMS/util"
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

	g.POST("/api/define", func(ctx *gin.Context) {
		var r model.Api
		bindErr := ctx.BindJSON(&r)

		if bindErr != nil {
			ctx.JSON(400, gin.H{
				"message": bindErr.Error(),
			})
			return
		}

		if !util.IsLetter(r.Id) {
			ctx.JSON(400, gin.H{
				"message": "need_alphabet",
			})
			return
		}

		store.Access.CreateApi(r)
	})

	g.Run(":3000")
}
