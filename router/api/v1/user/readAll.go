package user

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func ReadAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllUser},
			WhenYes: func(id string) {
				r := store.Access.GetUsersAll()
				if len(r) == 0 {
					empty := make([]model.User, 0)
					ctx.JSON(http.StatusOK, empty)
					return
				}
				for i, _ := range r {
					r[i].Role = store.Access.GetUserRoles(r[i].Id)
				}
				ctx.JSON(http.StatusOK, r)
			},
		}})
	}
}
