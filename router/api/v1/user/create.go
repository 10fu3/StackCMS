package user

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type createUserRequest struct {
	Mail string
	Nick *string
}

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var r createUserRequest
		if ctx.ShouldBindJSON(&r) == nil || r.Mail == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}
		store.Access.CreateUser(r.Mail, r.Nick)
	}
}
