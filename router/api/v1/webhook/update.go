package webhook

import (
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type updateWebhookReq struct {
	IsActive bool   `json:"is_active"`
	Url      string `json:"url"`
	Name     string `json:"name"`
}

func Update() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})

		var req updateWebhookReq
		hookId := ctx.Param("webhook_id")
		if ctx.ShouldBindJSON(&req) != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}
		old := store.Access.GetWebhook(hookId)

		if old == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_webhook",
			})
			return
		}

		old.IsActive = req.IsActive
		old.Url = req.Url
		old.Name = req.Name

		store.Access.UpdateWebhook(*old)
	}
}
