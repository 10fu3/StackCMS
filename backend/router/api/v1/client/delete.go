package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityDeleteClient},
			WhenYes: func(id string) {
				store.Access.DeleteClientAbility(ctx.Param("client_id"))
				store.Access.DeleteClientByClientId(ctx.Param("client_id"))
			},
		}})
	}
}
