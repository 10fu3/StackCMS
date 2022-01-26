package webhook

import (
	"StackCMS/router"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		id := ctx.Param("webhook_id")
		store.Access.DeleteWebhookById(id)
	}
}
