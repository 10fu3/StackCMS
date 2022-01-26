package user

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type createUserRequest struct {
	Mail string  `json:"mail"`
	Nick *string `json:"nick_name"`
}

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var r createUserRequest
		if ctx.ShouldBindJSON(&r) != nil || r.Mail == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}
		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityCreateUser},
			WhenYes: func(id string) {
				store.Access.CreateUser(r.Mail, r.Nick)
			},
		}})
	}
}
