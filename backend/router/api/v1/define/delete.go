package define

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
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

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityDeleteApi},
			WhenYes: func(id string) {
				store.Access.DeleteContentByApiId(api.UniqueId)
				store.Access.DeleteFieldsByApiUniqueId(api.UniqueId)
				store.Access.DeleteWebhookByApi(api.UniqueId)
				store.Access.DeleteApi(api.UniqueId)
			},
		}})
	}
}
