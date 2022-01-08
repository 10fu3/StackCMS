package define

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	define := g.Group("/define")
	define.POST("", Create())
	define.PATCH("/:api_id", Update())
	define.GET("/:api_id", Read())
	define.GET("/all", ReadAll())
	define.DELETE("/:api_id", Delete())
}
