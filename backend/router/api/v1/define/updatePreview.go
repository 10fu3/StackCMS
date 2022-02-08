package define

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type updatePreviewRequest struct {
	PreviewURL *string `json:"preview_url"`
}

func UpdatePreview() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req updatePreviewRequest

		api := store.Access.GetApi(ctx.Param("api_id"))

		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_api",
			})
			return
		}

		if ctx.ShouldBindJSON(&req) != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateApi},
			WhenYes: func(id string) {
				newApi := model.Api{
					UniqueId:        api.UniqueId,
					IsSingleContent: api.IsSingleContent,
					Id:              api.Id,
					Fields:          nil,
					PreviewURL:      req.PreviewURL,
				}
				store.Access.UpdateApi(api.UniqueId, newApi)
			},
		}})
	}
}
