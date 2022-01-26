package client

import (
	"StackCMS/router-util"
	"github.com/gin-gonic/gin"
)

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: nil,
			WhenYes:   nil,
		}})
	}
}
