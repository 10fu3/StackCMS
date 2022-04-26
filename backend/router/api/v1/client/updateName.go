package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type updateClientNameRequest struct {
	Name string `json:"client_name"`
}

func UpdateName() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		var r updateClientNameRequest
		if ctx.ShouldBindJSON(&r) != nil || r.Name == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateClient},
			WhenYes: func(id string) {
				client := store.Access.GetClientById(ctx.Param("client_id"))
				client.Name = r.Name
				store.Access.UpdateClient(*client)
			},
		}})
	}
}
