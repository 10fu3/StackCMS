package contents

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		filter := map[string]interface{}{}
		ctx.ShouldBindJSON(&filter)
		filter["api_id"] = ctx.Param("id")

		q := model.GetQuery{
			Count: model.ResultCount{
				Offset: func() int {
					v, e := strconv.Atoi(ctx.Query("offset"))
					if e != nil {
						return 0
					}
					return v
				}(),
				Limit: func() int {
					v, e := strconv.Atoi(ctx.Query("limit"))
					if e != nil {
						return 0
					}
					return v
				}(),
			},
			ApiId:  ctx.Param("api_id"),
			Filter: filter,
			Fields: func() []string {
				s := strings.Split(ctx.Query("fields"), ",")
				if len(s) == 1 && s[0] == "" {
					return nil
				}
				return s
			}(),
		}
		ctx.JSON(http.StatusOK, func() interface{} {
			r := store.Access.GetContent(q)
			var empty = map[string]interface{}{}
			if r == nil {
				return empty
			}
			return r
		}())
	}
}
