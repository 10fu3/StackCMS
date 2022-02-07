package routerUtil

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AbilityFunc struct {
	Abilities []model.Ability
	WhenYes   func(id string)
}

//IsAuthorization return value is user identify
func IsAuthorization(ctx *gin.Context, abilityFunc []AbilityFunc) {
	authInterface, existsAuth := ctx.Get("auth")

	if !existsAuth {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}

	auth, authConvert := authInterface.(model.AuthType)

	if !authConvert {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}

	for i, a := range abilityFunc {

		if auth.IsUser {
			if !store.Access.HasUserAuthority(auth.GetUser().Id, a.Abilities) {
				if len(abilityFunc)-1 > i {
					continue
				}
				ctx.JSON(http.StatusForbidden, gin.H{
					"message": "you_dont_have_permission",
				})
				return
			}
			a.WhenYes(auth.GetUser().Id)
			return
		} else {
			//client
			if !store.Access.HasClientAuthority(auth.GetClient().Id, func() []string {
				r := []string{}
				for _, ab := range a.Abilities {
					r = append(r, ab.String())
				}
				return r
			}()) {
				if len(abilityFunc)-1 > i {
					continue
				}
				ctx.JSON(http.StatusForbidden, gin.H{
					"message": "you_dont_have_permission",
				})
				return
			}
			a.WhenYes(auth.GetClient().Id)
			return
		}
	}

}
