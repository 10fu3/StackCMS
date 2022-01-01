package client

import "github.com/gin-gonic/gin"

func RegisterRoutes(g *gin.RouterGroup) {
	clientsRoot := g.Group("client")
	clientsRoot.POST("", Create())
	clientsRoot.PATCH("/:client_id", Update())
	clientsRoot.GET("", Read())
	clientsRoot.DELETE("/:client_id", Delete())
}
