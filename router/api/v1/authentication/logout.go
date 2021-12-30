package authentication

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Logout() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		key := ctx.Request.Header.Get("authorization")

		if key == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		store.Access.DeleteSessionUserBySession(key)
	}
}
