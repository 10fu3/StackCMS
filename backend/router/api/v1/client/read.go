package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetClient},
			WhenYes: func(id string) {
				r := store.Access.GetClientById(ctx.Param("client_id"))
				ctx.JSON(http.StatusOK, r)
			},
		}})
	}
}
