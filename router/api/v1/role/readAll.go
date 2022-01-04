package role

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

func ReadAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var r = []model.Role{}
		roles := store.Access.GetAbility()
		store.Access.Db.Select(&r, "SELECT * FROM roles")
		for i, role := range r {
			a, ok := roles[role.Id]
			if !ok {
				continue
			}
			r[i].Abilities = append(r[i].Abilities, a...)
		}
		ctx.JSON(http.StatusOK, r)
	}
}
