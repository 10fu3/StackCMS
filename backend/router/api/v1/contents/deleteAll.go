package contents

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func DeleteAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		api := store.Access.GetApi(ctx.Param("api_id"))

		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_api",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityDeleteAllContent},
			WhenYes: func(id string) {
				if store.Access.DeleteContentByApiId(api.UniqueId) != nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_content",
					})
				}
			},
		}})
	}
}
