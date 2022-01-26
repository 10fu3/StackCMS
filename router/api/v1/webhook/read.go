package webhook

import (
	"StackCMS/router"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		ctx.JSON(http.StatusOK, store.Access.GetWebhooks())
	}
}
