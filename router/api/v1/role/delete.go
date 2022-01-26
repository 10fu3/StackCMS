package role

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityDeleteRole},
			WhenYes: func(id string) {
				store.Access.DeleteRole(model.Role{
					Id:        ctx.Param("role_id"),
					Name:      "",
					Abilities: nil,
				})
			},
		}})
	}
}
