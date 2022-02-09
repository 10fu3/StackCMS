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

func buildQuery(
	fields map[string]bool, apiId string,
	userFilter map[string]interface{},
	isDraft bool,
	offset int64,
	limit int64,
	depth int,
	order []model.OrderRequest,
	serverFilter map[string]interface{}) model.GetQuery {

	filter := userFilter

	for k, v := range serverFilter {
		filter[k] = v
	}

	return model.GetQuery{
		Count: model.ResultCount{
			Offset: offset,
			Limit:  limit,
		},
		ApiId:    apiId,
		Filter:   filter,
		Fields:   fields,
		GetMeta:  false,
		GetDraft: isDraft,
		Order:    order,
		Depth:    depth,
	}
}

func convertToQuery(apiId string, serverFilter map[string]interface{}, ctx *gin.Context) model.GetQuery {
	filter := map[string]interface{}{}

	filterParam := ctx.Query("filter")

	if err := json.Unmarshal([]byte(filterParam), &filter); err != nil {
		//fmt.Println(err.Error())
	}

	//filter["api_id"] = ctx.Param("api_id")

	isGetDraft := func() bool {
		return ctx.Query("draft") == "true"
	}()

	fields := func() map[string]bool {
		s := strings.Split(ctx.Query("fields"), ",")
		if len(s) == 1 && s[0] == "" {
			return map[string]bool{}
		}
		r := map[string]bool{}
		for _, f := range s {
			r[f] = true
		}
		return r
	}()

	offset := func() int64 {
		v, e := strconv.Atoi(ctx.Query("offset"))
		if e != nil {
			return 0
		}
		return int64(v)
	}()

	limit := func() int64 {
		v, e := strconv.Atoi(ctx.Query("limit"))
		if e != nil {
			return 0
		}
		return int64(v)
	}()

	depth := func() int {
		s, e := strconv.Atoi(ctx.Query("depth"))
		if e != nil {
			return 0
		}
		return s
	}()

	order := func() []model.OrderRequest {
		r := []model.OrderRequest{}
		rawQuery := ctx.Query("orders")
		if len(rawQuery) == 0 {
			return r
		}
		for _, fieldMode := range strings.Split(rawQuery, ",") {
			if len(fieldMode) == 0 {
				continue
			}
			in := model.OrderRequest{
				Field:      strings.Replace(fieldMode, "-", "", 1),
				Descending: false,
			}
			if !strings.HasPrefix("-", fieldMode) {
				in.Descending = true
			}
			r = append(r, in)
		}
		return r
	}()

	return buildQuery(fields, apiId, filter, isGetDraft, offset, limit, depth, order, serverFilter)
}

type response struct {
	Contents []map[string]interface{} `json:"contents"`
	Count    int                      `json:"total_count"`
	Offset   int64                    `json:"offset"`
	Limit    int64                    `json:"limit"`
}

func ReadAll() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		getContent := func(getQuery func(unique string) model.GetQuery) {
			api := store.Access.GetApi(ctx.Param("api_id"))
			if api == nil {
				ctx.JSON(http.StatusNotFound, gin.H{
					"message": "not_found_api",
				})
				return
			}

			ctx.JSON(http.StatusOK, func() interface{} {
				query := getQuery(api.UniqueId)
				r := store.Access.GetContent(query)
				return response{
					Contents: r,
					Count:    len(r),
					Offset:   query.Count.Offset,
					Limit:    query.Count.Limit,
				}
			}())
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityGetAllContent},
			WhenYes: func(id string) {
				getContent(func(unique string) model.GetQuery {
					return convertToQuery(unique, map[string]interface{}{}, ctx)
				})
			},
		}, {
			Abilities: []model.Ability{model.AbilityGetSelfContent},
			WhenYes: func(id string) {
				getContent(func(unique string) model.GetQuery {
					return convertToQuery(unique, map[string]interface{}{
						"created_by": id,
					}, ctx)
				})
			},
		}})
	}
}
