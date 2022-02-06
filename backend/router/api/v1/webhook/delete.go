package webhook

import (
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		id := ctx.Param("webhook_id")
		store.Access.DeleteWebhookById(id)
	}
}
