package authentication

import (
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type authorizationRequest struct {
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

func Login() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		//ブラウザからJSON形式でメアドとパスワードが来るのでバインドする
		authParams := authorizationRequest{}
		//変なリクエストであればここでガードする
		if ctx.BindJSON(&authParams) != nil || authParams.Mail == "" || authParams.Password == "" {
			ctx.JSON(http.StatusBadRequest, map[string]string{
				"message": "bad_parameter",
			})
			return
		}

		//DB上のアカウントのうち, メアドが一致するアカウントを拾ってくる
		user := store.Access.GetUserByMail(authParams.Mail)

		//存在しないかパスワードが一致しなければ404を返す
		if user == nil || bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(authParams.Password)) != nil {
			ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "not_found_user",
			})
			return
		}

		//セッションキーを発行する
		session, sessionErr := store.Access.AddSessionUser(user)

		//DBエラーのときはサーバーエラーとして返す
		if sessionErr != nil {
			ctx.JSON(http.StatusInternalServerError, map[string]string{
				"message": "database_error",
			})
			return
		}

		//authorizationをキーとしてセッションキーを返却し, 以降のリクエストに用いる
		ctx.JSON(http.StatusOK, map[string]interface{}{
			"authorization": session,
			"profile":       user,
		})
		return
	}
}
