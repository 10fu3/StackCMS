package client

import (
	"StackCMS/router"
	"github.com/gin-gonic/gin"
)

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})
	}
}
