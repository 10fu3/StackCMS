package role

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

type createRoleRequest struct {
	RoleName string `json:"role_name"`
}

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		var r createRoleRequest

		if ctx.ShouldBindJSON(&r) != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"message": "bad_request",
			})
		}

		store.Access.CreateRole(model.Role{
			Id:        uuid.NewString(),
			Name:      r.RoleName,
			Abilities: nil,
		})
	}
}
