package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func UpdateSecret() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateClient},
			WhenYes: func(id string) {
				client := store.Access.GetClientById(ctx.Param("client_id"))
				client.Secret = uuid.NewString() + "_" + uuid.NewString()
				store.Access.UpdateClient(*client)
			},
		}})
	}
}
