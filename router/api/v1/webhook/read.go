package webhook

import (
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		ctx.JSON(http.StatusOK, store.Access.GetWebhooks())
	}
}
