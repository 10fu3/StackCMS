package api

import (
	v1 "StackCMS/router/api/v1"
	"StackCMS/router/api/v1/authentication"
	"github.com/gin-gonic/gin"
)

func RegisterRoute(g *gin.RouterGroup) {
	v1Routes := g.Group("v1")
	v1NoAuthRoutes := g.Group("v1")
	authentication.RegisterRoutes(v1NoAuthRoutes)
	v1.RegisterRoutes(v1Routes)
}
