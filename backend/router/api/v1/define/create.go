package define

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"StackCMS/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
		r.UniqueId = uuid.NewString()

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityCreateApi},
			WhenYes: func(id string) {
				store.Access.CreateApi(r)
			},
		}})
	}
}
