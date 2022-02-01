package contents

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"strings"
)

func Read() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {

				filter := map[string]interface{}{}

				filter["api_id"] = ctx.Param("api_id")
				filter["_id"] = ctx.Param("content_id")

				isGetDraft := func() bool {
					return ctx.Query("draft") == "true"
				}()

				store.Access.GetContent(model.GetQuery{
					Count:  model.ResultCount{},
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
					Depth:    0,
				})
			},
		}})
	}
}
