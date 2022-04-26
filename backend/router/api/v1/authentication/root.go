package authentication

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	authRoute := g.Group("/auth")
	authRoute.GET("/me", LiveSession())
	authRoute.POST("/login", Login())
	authRoute.POST("/logout", Logout())
}
