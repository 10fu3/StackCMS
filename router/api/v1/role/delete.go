package role

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type deleteRoleRequest struct {
	RoleId string `json:"role_id"`
}

func Delete() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var r deleteRoleRequest
		if ctx.ShouldBindJSON(&r) != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"message": "bad_request",
			})
		}
		store.Access.DeleteRole(model.Role{
			Id:        r.RoleId,
			Name:      "",
			Abilities: nil,
		})
	}
}
