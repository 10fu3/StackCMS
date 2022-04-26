package client

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	clientsRoot := g.Group("client")
	clientsRoot.POST("", Create())
	clientsRoot.PATCH("/:client_id/name", UpdateName())
	clientsRoot.PATCH("/:client_id/permissions", UpdateAbility())
	clientsRoot.PATCH("/:client_id/secret", UpdateSecret())
	clientsRoot.GET("", ReadAll())
	clientsRoot.GET("/:client_id", Read())
	clientsRoot.DELETE("/:client_id", Delete())
}
