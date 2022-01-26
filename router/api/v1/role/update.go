package role

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type updateRoleRequest struct {
	RoleName    *string  `json:"role_name"`
	RoleAbility []string `json:"role_ability"`
}

func Update() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateRoleAbility, model.AbilityUpdateRoleUser},
			WhenYes: func(id string) {
				var r updateRoleRequest

				if ctx.ShouldBindJSON(&r) != nil {
					ctx.JSON(http.StatusBadRequest, gin.H{
						"message": "bad_request",
					})
				}

				old := store.Access.GetRole(ctx.Param("role_id"))

				if old == nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_role",
					})
					return
				}

				store.Access.UpdateRole(model.Role{
					Id: ctx.Param("role_id"),
					Name: func() string {
						if r.RoleName == nil {
							return old.Name
						}
						return *r.RoleName
					}(),
					Abilities: func() []string {
						if len(r.RoleAbility) == 0 {
							return old.Abilities
						}
						return r.RoleAbility
					}(),
				})
			},
		}})
	}
}
