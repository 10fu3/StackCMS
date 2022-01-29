package client

import (
	"StackCMS/routerUtil"
	"github.com/gin-gonic/gin"
)

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})
	}
}
