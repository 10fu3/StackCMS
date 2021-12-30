package v1

import (
	"StackCMS/router/api/v1/contents"
	"github.com/gin-gonic/gin"
)

func RegisterRoute(g *gin.RouterGroup) {
	v1 := g.Group("/v1")

	contents.RegisterRoutes(v1)
}
