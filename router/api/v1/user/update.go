package user

import (
	"StackCMS/model"
	"StackCMS/router"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type userUpdateRequest struct {
	Mail     string   `json:"mail"`
	Password string   `json:"password"`
	NickName string   `json:"nick_name"`
	Role     []string `json:"roles"`
}

func Update() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		var r userUpdateRequest
		ctx.ShouldBindJSON(&r)
		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateAllUser},
			WhenYes: func(id string) {
				user := store.Access.GetUserById(ctx.Param("user_id"))

				if user == nil {
					ctx.JSON(http.StatusNotFound, gin.H{
						"message": "not_found_user",
					})
					return
				}

				if user.IsLock {
					ctx.JSON(http.StatusForbidden, gin.H{
						"message": "user_is_locked",
					})
					return
				}

				if len(r.Password) < 7 {
					ctx.JSON(http.StatusBadRequest, gin.H{
						"message": "need_password_length",
					})
					return
				}

				passRaw, _ := bcrypt.GenerateFromPassword([]byte(r.Password), 10)

				user.Mail = r.Mail
				user.NickName = r.NickName
				user.PasswordHash = string(passRaw)

				store.Access.LeaveRoleUser(user.Id)
				store.Access.JoinRoleUser(user.Id, r.Role)

				store.Access.UpdateUser(*user)
			},
		}})
	}
}
