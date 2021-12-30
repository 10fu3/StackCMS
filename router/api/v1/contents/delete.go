package contents

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		api := store.Access.GetApi(ctx.Param("api_id"))

		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_api",
			})
			return
		}

		if store.Access.DeleteContent(ctx.Param("content_id")) != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_content",
			})
		}
	}
}
