package contents

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		api := store.Access.GetApi(ctx.Param("api_id"))
		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_api",
			})
			return
		}

		getContent := func(api *model.Api, filter map[string]interface{}) {
			query := convertToQuery(api.UniqueId, filter, ctx)

			r := store.Access.GetContent(query)

			if len(r) == 0 {
				ctx.JSON(http.StatusNotFound, gin.H{
					"message": "not_found_content",
				})
				return
			}

			ctx.JSON(http.StatusOK, r[0])
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {
				filter := map[string]interface{}{
					"_id": ctx.Param("content_id"),
				}
				getContent(api, filter)
			},
		}, {
			Abilities: []model.Ability{model.AbilityGetSelfContent},
			WhenYes: func(id string) {
				filter := map[string]interface{}{
					"_id":        ctx.Param("content_id"),
					"created_by": id,
				}
				getContent(api, filter)
			},
		}})
	}
}
