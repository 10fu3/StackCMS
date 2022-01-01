package define

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	define := g.Group("/define")
	define.POST("", Create())
	define.GET("/:api_id/all", Read())

}
