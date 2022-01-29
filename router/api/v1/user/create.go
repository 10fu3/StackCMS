package user

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/mail"
)

type createUserRequest struct {
	Mail     string  `json:"mail"`
	Nick     *string `json:"nick_name"`
	Password string  `json:"password"`
}

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var r createUserRequest
		if ctx.ShouldBindJSON(&r) != nil || r.Mail == "" || len(r.Password) < 8 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}
		if _, invalidMail := mail.ParseAddress(r.Mail); r.Mail != "root" && invalidMail != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "cant_parse_mail_addr",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityCreateUser},
			WhenYes: func(id string) {
				store.Access.CreateUser(r.Mail, r.Nick, r.Password)
			},
		}})
	}
}
