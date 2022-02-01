package client

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
			Abilities: []model.Ability{model.AbilityGetClient},
			WhenYes: func(id string) {
				ctx.JSON(http.StatusOK, store.Access.GetClients())
			},
		}})
	}
}
