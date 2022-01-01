package webhook

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("webhook_id")
		store.Access.DeleteWebhookById(id)
	}
}
