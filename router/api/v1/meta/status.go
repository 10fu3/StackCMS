package meta

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type changeStatusRequest struct {
	Status string `json:"status"`
}

func ChangeStatus() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityPublishAllContent},
			WhenYes: func(publishedBy string) {
				var r changeStatusRequest

				if ctx.ShouldBindJSON(&r) != nil {
					ctx.JSON(http.StatusBadRequest, "bad_params")
					return
				}

				api := store.Access.GetApi(ctx.Param("api_id"))
				if api == nil {
					ctx.JSON(http.StatusNotFound, "not_found_api")
					return
				}

				content := store.Access.GetContentMetaById(ctx.Param("content_id"))
				if content == nil {
					ctx.JSON(http.StatusNotFound, "not_found_content")
					return
				}

				if err := store.Access.ChangePublishStatusContent(content.Id, publishedBy, func() store.ContentStatus {
					if r.Status == "published" {
						return store.ContentPublished
					}
					return store.ContentUnpublished
				}()); err != nil {
					ctx.JSON(http.StatusBadRequest, err.Error())
					return
				}
			},
		}})

	}
}
