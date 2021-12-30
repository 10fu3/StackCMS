package contents

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(g *gin.RouterGroup) {

	contentsRoute := g.Group("/contents/:api_id")

	//C
	contentsRoute.POST("", Create())
	//U
	contentsRoute.PUT("/:content_id", Update())
	//R
	contentsRoute.GET("", Read())
	//D
	contentsRoute.DELETE("/:content_id", Delete())
}
