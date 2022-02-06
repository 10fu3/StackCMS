package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type updateAbilityRequest struct {
	ClientAbility []model.Ability
}

func UpdateAbility() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateClient},
			WhenYes: func(id string) {
				var r updateAbilityRequest
				if ctx.ShouldBindJSON(&r) != nil {
					ctx.JSON(http.StatusBadRequest, gin.H{
						"message": "bad_params",
					})
					return
				}

				client := store.Access.GetClientById(ctx.Param("client_id"))

				if client == nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_client",
					})
					return
				}

				store.Access.DeleteClientAbility(ctx.Param("client_id"))
				store.Access.AppendClientAbilities(*client, r.ClientAbility)
			},
		}})
	}
}
