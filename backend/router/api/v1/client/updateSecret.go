package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

func UpdateSecret() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateClient},
			WhenYes: func(id string) {
				client := store.Access.GetClientById(ctx.Param("client_id"))
				if client == nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_client",
					})
					return
				}
				store.Access.UpdateClientSecret(ctx.Param("client_id"), uuid.NewString()+"_"+uuid.NewString())
			},
		}})
	}
}
