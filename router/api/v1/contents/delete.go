package contents

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

		if ctx.Param("content_id") == "all" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "check_your_link",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityDeleteAllContent},
			WhenYes: func(_ string) {
				if store.Access.DeleteContent(ctx.Param("content_id")) != nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_content",
					})
				}
			},
		}})
	}
}
