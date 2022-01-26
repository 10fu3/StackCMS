package role

import (
	"StackCMS/model"
	"StackCMS/router"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router.IsAuthorization(ctx, []router.AbilityFunc{{
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
