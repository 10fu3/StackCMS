package contents

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Update() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var err error

		authInterface, existsAuth := ctx.Get("auth")

		if !existsAuth {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		auth, authConvert := authInterface.(model.AuthType)

		if !authConvert {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		updatedBy := ""

		if auth.IsUser {
			updatedBy = auth.GetUser().Id
		} else {
			updatedBy = "API"
		}

		api := store.Access.GetApi(ctx.Param("api_id"))
		var j model.JSON = map[string]interface{}{}
		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found",
			})
			return
		}
		if err = ctx.BindJSON(&j); err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "cant_parse",
			})
		}
		if err = store.Access.UpdateContent(ctx.Param("content_id"), updatedBy, j); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": err.Error(),
			})
		}

	}
}
