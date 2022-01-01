package role

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	roleRoutes := g.Group("/role")
	roleRoutes.POST("", Create())
	roleRoutes.DELETE("/:role_id", Delete())
	roleRoutes.GET("", ReadAll())
}
