package role

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
)

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		store.Access.DeleteRole(model.Role{
			Id:        ctx.Param("role_id"),
			Name:      "",
			Abilities: nil,
		})
	}
}
