package webhook

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

type createWebhookReq struct {
	Url    string `json:"url"`
	Name   string `json:"name"`
	Secret string `json:"secret"`
}

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		//router.IsAuthorization(ctx,[]router.AbilityFunc{{
		//	Abilities: []model.Ability{model.AbilityGetAllUser},
		//	WhenYes: nil,
		//}})

		apiId := ctx.Param("api_id")

		var req createWebhookReq

		if ctx.ShouldBindJSON(&req) != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}

		hook := model.WebHook{
			Id:       uuid.NewString(),
			ApiId:    apiId,
			Url:      req.Url,
			Name:     req.Name,
			IsActive: false,
			Secret:   req.Secret,
		}
		store.Access.CreateWebhook(hook)
	}
}
