package user

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityDeleteUser},
			WhenYes: func(id string) {
				if user := store.Access.GetUserById(ctx.Param("user_id")); user != nil {
					store.Access.DeleteSessionUserByUser(user)
					store.Access.LeaveRoleUser(user.Id)
					store.Access.DeleteUser(user.Id)
					return
				}
				ctx.JSON(http.StatusNotFound, gin.H{
					"message": "not_found_user",
				})
			},
		}})
	}
}
