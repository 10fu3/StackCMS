package define

import (
	"StackCMS/model"
	"StackCMS/routerUtil"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type updateFieldRequest struct {
	Fields []model.Field `json:"fields"`
}

// 差集合
//https://selfnote.work/20210211/programming/intersection-union-with-golang/
//数字ではなくfieldを文字列にシリアライズしてmapに格納
func calcDiff(base, up []model.Field) []model.Field {
	s := make(map[string]model.Field, len(base))
	r := []model.Field{}
	for _, data := range base {
		s[data.Id] = data
	}
	for _, data := range up {
		if _, ok := s[data.Id]; ok {
			delete(s, data.Id)
		}
	}
	for _, v := range s {
		r = append(r, v)
	}
	return r
}

func calcChange(old, new []model.Field, removeIds []string) []model.Field {
	r := []model.Field{}
	oldM := map[string]*model.Field{}
	newM := map[string]*model.Field{}
	removeIdMap := map[string]bool{}
	for _, id := range removeIds {
		removeIdMap[id] = true
	}
	for _, field := range old {
		oldM[field.Id] = &field
	}
	for _, field := range new {
		newM[field.Id] = &field
	}
	for fieldId, field := range oldM {
		if _, ok := removeIdMap[fieldId]; ok {
			continue
		}
		if !field.Equals(newM[fieldId]) {
			r = append(r, *field)
		}
	}
	return r
}

func UpdateField() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req updateFieldRequest

		api := store.Access.GetApi(ctx.Param("api_id"))

		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found_api",
			})
			return
		}

		if ctx.ShouldBindJSON(&req) != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "bad_params",
			})
			return
		}

		routerUtil.IsAuthorization(ctx, []routerUtil.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateApi},
			WhenYes: func(id string) {
				oldFields := store.Access.GetFieldsByApiUniqueId(api.UniqueId)
				removeFields := calcDiff(oldFields, req.Fields)
				store.Access.DeleteFields(api.UniqueId, func() []string {
					r := []string{}
					for _, f := range removeFields {
						r = append(r, f.Id)
					}
					return r
				}())
				store.Access.UpdateField(api.UniqueId, req.Fields)
				store.Access.CreateFields(api.UniqueId, calcDiff(req.Fields, oldFields))
			},
		}})
	}
}
