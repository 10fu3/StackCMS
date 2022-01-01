package meta

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type changeStatusRequest struct {
	Status string `json:"status"`
}

func ChangeStatus() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authInterface, existsAuth := ctx.Get("auth")

		if !existsAuth {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		auth, authConvert := authInterface.(model.AuthType)

		if !authConvert {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}

		publishedBy := ""

		if auth.IsUser {
			publishedBy = auth.GetUser().Id
		} else {
			publishedBy = "API"
		}

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
			if r.Status == "publish" {
				return store.ContentPublished
			}
			return store.ContentUnpublished
		}()); err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}

	}
}
