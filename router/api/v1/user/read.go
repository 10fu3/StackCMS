package user

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := ctx.Param("user_id")
		u := store.Access.GetUserById(userId)

		if u == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_user",
			})
			return
		}
		u.Role = store.Access.GetUserRoles(u.Id)
		ctx.JSON(http.StatusOK, u)
		return
	}
}
