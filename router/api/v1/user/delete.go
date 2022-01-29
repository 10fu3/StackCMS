package user

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
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
