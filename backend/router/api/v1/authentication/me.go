package authentication

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func LiveSession() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		key := ctx.Request.Header.Get("authorization")

		if key == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		uId := store.Access.GetSessionUser(key)

		if uId == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		u := store.Access.GetUserById(uId)

		if u == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_user",
			})
			store.Access.DeleteSessionUserBySession(key)
			return
		}

		u.Role = store.Access.GetUserRoles(u.Id)
		ctx.JSON(http.StatusOK, u)
	}
}
