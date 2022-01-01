package user

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	g.Group("/user")
	g.POST("", Create())
	g.PATCH("/:user_id", Update())
	g.GET("", ReadAll())
	g.GET("/:user_id", Read())
	g.DELETE("/:user_id", Delete())
}
