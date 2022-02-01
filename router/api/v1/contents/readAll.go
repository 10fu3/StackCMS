package contents

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

func buildQuery(fields []string, userFilter map[string]interface{}, isDraft bool, offset int, limit int, serverFilter map[string]interface{}) model.GetQuery {

	filter := userFilter

	for k, v := range serverFilter {
		filter[k] = v
	}

	return model.GetQuery{
		Count: model.ResultCount{
			Offset: offset,
			Limit:  limit,
		},
		ApiId:    filter["api_id"].(string),
		Filter:   filter,
		Fields:   fields,
		GetMeta:  false,
		GetDraft: isDraft,
		//Depth: func() int {
		//	s := strconv.Atoi(ctx.Query("depth") == 1)
		//}(),
	}
}

func convertToQuery(serverFilter map[string]interface{}, ctx *gin.Context) model.GetQuery {
	filter := map[string]interface{}{}

	filterParam := ctx.Query("filter")

	_ = json.Unmarshal([]byte(filterParam), &filter)

	filter["api_id"] = ctx.Param("api_id")

	isGetDraft := func() bool {
		return ctx.Query("draft") == "true"
	}()

	fields := func() []string {
		s := strings.Split(ctx.Query("fields"), ",")
		if len(s) == 1 && s[0] == "" {
			return nil
		}
		return s
	}()

	offset := func() int {
		v, e := strconv.Atoi(ctx.Query("offset"))
		if e != nil {
			return 0
		}
		return v
	}()

	limit := func() int {
		v, e := strconv.Atoi(ctx.Query("limit"))
		if e != nil {
			return 10
		}
		return v
	}()

	return buildQuery(fields, filter, isGetDraft, offset, limit, serverFilter)
}

func ReadAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {
				ctx.JSON(http.StatusOK, func() interface{} {
					r := store.Access.GetContent(convertToQuery(map[string]interface{}{}, ctx))
					var empty = map[string]interface{}{}
					if r == nil {
						return empty
					}
					return r
				}())
			},
		}, {
			Abilities: []model.Ability{model.AbilityGetSelfContent},
			WhenYes: func(id string) {
				ctx.JSON(http.StatusOK, func() interface{} {
					r := store.Access.GetContent(convertToQuery(map[string]interface{}{"created_by": id}, ctx))
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
