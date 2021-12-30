package define

import "github.com/gin-gonic/gin"

func RegisterDefineApi(g *gin.RouterGroup) {
	define := g.Group("/define")
	define.GET("/all")
}
