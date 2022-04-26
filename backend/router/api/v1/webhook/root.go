package webhook

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	webhookRoutes := g.Group("/webhook/:api_id")
	webhookRoutes.POST("", Create())
	webhookRoutes.PUT("/:webhook_id", Update())
	webhookRoutes.GET("", Read())
	webhookRoutes.DELETE("/:webhook_id", Delete())
}
