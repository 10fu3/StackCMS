package router

import (
	"StackCMS/router/api"
	"github.com/gin-gonic/gin"
)

func RegisterRoute(g *gin.Engine) {
	apiRoutes := g.Group("/api")
	api.RegisterRoute(apiRoutes)
}
