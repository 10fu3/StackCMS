package define

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, store.Access.GetFieldsByApiId(ctx.Param("api_id")))
	}
}
