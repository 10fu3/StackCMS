package define

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func ReadAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetApi},
			WhenYes: func(id string) {
				ctx.JSON(http.StatusOK, store.Access.GetApis())
			},
		}})
		return
	}
}
