package meta

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(g *gin.RouterGroup) {

	contentsRoute := g.Group("/meta/:api_id")
	//R
	contentsRoute.GET("", Read())
	//
	contentsRoute.PATCH("/:content_id/status", ChangeStatus())

	contentsRoute.PATCH("/:content_id/draft_key", DraftUpdate())
}
