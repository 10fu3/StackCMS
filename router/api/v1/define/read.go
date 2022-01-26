package define

import (
	"StackCMS/model"
	"StackCMS/router"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetApi},
			WhenYes: func(id string) {
				ctx.JSON(http.StatusOK, store.Access.GetFieldsByApiUniqueId(ctx.Param("api_id")))
			},
		}})
	}
}
