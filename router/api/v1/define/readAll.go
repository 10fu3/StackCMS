package define

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func ReadAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetApi},
			WhenYes: func(id string) {
				ctx.JSON(http.StatusOK, store.Access.GetApis())
			},
		}})
		return
	}
}
