package webhook

import (
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		ctx.JSON(http.StatusOK, store.Access.GetWebhooks())
	}
}
