package user

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	user := g.Group("/user")
	user.POST("", Create())
	user.PATCH("/:user_id", Update())
	user.GET("", ReadAll())
	user.GET("/:user_id", Read())
	user.DELETE("/:user_id", Delete())
}
