package v1

import (
	"StackCMS/model"
	"StackCMS/router/api/v1/client"
	"StackCMS/router/api/v1/contents"
	"StackCMS/router/api/v1/define"
	"StackCMS/router/api/v1/meta"
	"StackCMS/router/api/v1/role"
	"StackCMS/router/api/v1/user"
	"StackCMS/router/api/v1/webhook"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func RegisterRoutes(g *gin.RouterGroup) {

	g.Use(func(ctx *gin.Context) {
		if ctx.GetHeader("authorization") == "" && ctx.GetHeader("X-STACKCMS-API-KEY") == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
			})
			return
		}
		if ctx.GetHeader("authorization") != "" && ctx.GetHeader("X-STACKCMS-API-KEY") != "" {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"message": "not_select_double_authorization",
			})
			return
		}
		if ctx.GetHeader("authorization") != "" {
			u := store.Access.GetUserById(store.Access.GetSessionUser(ctx.GetHeader("authorization")))
			if u == nil {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"message": "unauthorized",
				})
				return
			}
			ctx.Set("auth", model.AuthType{
				IsUser:   true,
				AuthInfo: u,
			})
			return
		}
		c := store.Access.GetClientBySecret(ctx.GetHeader("X-STACKCMS-API-KEY"))
		if c == nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"message": "invalid_api_key",
			})
			return
		}
		ctx.Set("auth", model.AuthType{
			IsUser:   false,
			AuthInfo: c,
		})
	})

	client.RegisterRoutes(g)
	contents.RegisterRoutes(g)
	meta.RegisterRoutes(g)
	define.RegisterRoutes(g)
	user.RegisterRoutes(g)
	role.RegisterRoutes(g)
	webhook.RegisterRoutes(g)
}
