package router

import (
	v1 "StackCMS/router/api/v1"
	"github.com/gin-gonic/gin"
)

func RegisterRoute(g *gin.Engine) {
	api := g.Group("/api")
	v1.RegisterRoute(api)
}
