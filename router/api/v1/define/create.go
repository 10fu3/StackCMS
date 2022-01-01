package define

import (
	"StackCMS/model"
	"StackCMS/store"
	"StackCMS/util"
	"github.com/gin-gonic/gin"
)

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
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
	}
}
