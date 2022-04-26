package meta

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func DraftUpdate() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {
				api := store.Access.GetApi(ctx.Param("api_id"))
				if api == nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_api",
					})
					return
				}
				err, newKey := store.Access.ChangeDraftKey(api.UniqueId, ctx.Param("content_id"))
				if err != nil {
					ctx.JSON(http.StatusBadRequest, gin.H{
						"message": err.Error(),
					})
					return
				}
				ctx.JSON(http.StatusOK, gin.H{
					"draft_key": newKey,
				})
			},
		}})
	}
}
