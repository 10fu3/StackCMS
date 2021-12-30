package api

import (
	"StackCMS/router/api/v1/authentication"
	"StackCMS/router/api/v1/contents"
	"github.com/gin-gonic/gin"
)

func RegisterApi(g *gin.RouterGroup) {
	authRoute := g.Group("/authentication")
	authentication.RegisterAuthentication(authRoute)

	contentsRoute := g.Group("/contents")
	contents.RegisterRoutes(contentsRoute)

}
