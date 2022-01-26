package webhook

import (
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		id := ctx.Param("webhook_id")
		store.Access.DeleteWebhookById(id)
	}
}
