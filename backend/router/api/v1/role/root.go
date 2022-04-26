package role

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	roleRoutes := g.Group("/role")
	roleRoutes.POST("", Create())
	roleRoutes.PATCH("/:role_id", Update())
	roleRoutes.DELETE("/:role_id", Delete())
	roleRoutes.GET("/all", ReadAll())
}
