package meta

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {
				api := store.Access.GetApi(ctx.Param("api_id"))

				filter := map[string]interface{}{}
				if json.Unmarshal([]byte(ctx.Query("filter")), &filter) != nil {
					filter = map[string]interface{}{}
				}

				filter["api_id"] = ctx.Param("id")
				isGetDraft := func() bool {
					return ctx.Query("draft") == "true"
				}()
				q := model.GetQuery{
					Count: model.ResultCount{
						Offset: func() int64 {
							v, e := strconv.Atoi(ctx.Query("offset"))
							if e != nil {
								return 0
							}
							return int64(v)
						}(),
						Limit: func() int64 {
							v, e := strconv.Atoi(ctx.Query("limit"))
							if e != nil {
								return 0
							}
							return int64(v)
						}(),
					},
					ApiId:  api.UniqueId,
					Filter: filter,
					Fields: func() map[string]bool {
						s := strings.Split(ctx.Query("fields"), ",")
						if len(s) == 1 && s[0] == "" {
							return map[string]bool{}
						}
						r := map[string]bool{}
						for _, f := range s {
							r[f] = true
						}
						return r
					}(),
					GetMeta:  true,
					GetDraft: isGetDraft,
				}
				ctx.JSON(http.StatusOK, func() interface{} {
					r := store.Access.GetContent(q)
					var empty = map[string]interface{}{}
					if r == nil {
						return empty
					}
					return r
				}())
			},
		}})
	}
}
