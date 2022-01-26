package client

import (
	"StackCMS/router"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})
	}
}
