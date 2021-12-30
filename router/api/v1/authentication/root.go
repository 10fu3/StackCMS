package authentication

import "github.com/gin-gonic/gin"

func RegisterAuthentication(g *gin.RouterGroup) {
	authRoute := g.Group("/auth")
	authRoute.POST("/login", Login())
	authRoute.DELETE("/logout", Logout())
}
