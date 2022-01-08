package contents

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(g *gin.RouterGroup) {

	contentsRoute := g.Group("/contents/:api_id")
	//C
	contentsRoute.POST("", Create())
	//U
	contentsRoute.PATCH("/:content_id", Update())
	//R
	contentsRoute.GET("", Read())
	//D all
	contentsRoute.DELETE("/all", DeleteAll())
	//D
	contentsRoute.DELETE("/:content_id", Delete())
}
