package client

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

type createClientRequest struct {
	Name string `json:"client_name"`
}

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		var r createClientRequest

		if ctx.ShouldBindJSON(&r) != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityCreateClient},
			WhenYes: func(id string) {
				store.Access.CreateClient(
					model.Client{
						Id:     uuid.NewString(),
						Name:   r.Name,
						Secret: uuid.NewString() + "_" + uuid.NewString(),
					})
				ctx.JSON(http.StatusOK, store.Access.GetClients())
			},
		}})
	}
}
