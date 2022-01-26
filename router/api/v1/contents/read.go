package contents

import (
	"StackCMS/model"
	"StackCMS/router"
	"StackCMS/store"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		router.IsAuthorization(ctx, []router.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {
				filter := map[string]interface{}{}

				filterParam := ctx.Query("filter")

				if err := json.Unmarshal([]byte(filterParam), &filter); err != nil {
					fmt.Println(err.Error())
				}

				filter["api_id"] = ctx.Param("api_id")

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
								return 10
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
					GetMeta:  false,
					GetDraft: isGetDraft,
					//Depth: func() int {
					//	s := strconv.Atoi(ctx.Query("depth") == 1)
					//}(),
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
