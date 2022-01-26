package meta

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
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
					ApiId:  api.UniqueId,
					Filter: filter,
					Fields: func() []string {
						s := strings.Split(ctx.Query("fields"), ",")
						if len(s) == 1 && s[0] == "" {
							return nil
						}
						return s
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
