package define

import (
	"StackCMS/model"
	"StackCMS/router-util"
	"StackCMS/store"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

type updateRequest struct {
	IsOpen          *bool         `json:"is_open"`
	IsSingleContent *bool         `json:"is_single"`
	ApiName         *string       `json:"api_name"`
	Fields          []model.Field `json:"fields"`
}

// 差集合
//https://selfnote.work/20210211/programming/intersection-union-with-golang/
//数字ではなくfieldを文字列にシリアライズしてmapに格納
func calcDifference(l1, l2 []model.Field) []model.Field {
	s := make(map[string]struct{}, len(l1))

	for _, data := range l2 {
		i := data.Name + data.Type + (func() string {
			if data.RelationApiId == nil {
				return ""
			} else {
				return *data.RelationApiId
			}
		}())
		s[i] = struct{}{}
	}

	r := make([]model.Field, 0, len(l2))

	for _, data := range l1 {
		i := data.Name + data.Type + (func() string {
			if data.RelationApiId == nil {
				return ""
			} else {
				return *data.RelationApiId
			}
		}())
		if _, ok := s[i]; ok {
			continue
		}

		r = append(r, data)
	}
	return r
}

func Update() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req updateRequest

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

		router_util.IsAuthorization(ctx, []router_util.AbilityFunc{{
			Abilities: []model.Ability{model.AbilityUpdateApi},
			WhenYes: func(id string) {
				oldFields := store.Access.GetFieldsByApiUniqueId(api.UniqueId)

				createField := []model.Field{}
				for i := 0; i < len(req.Fields); i++ {
					req.Fields[i].Id = uuid.NewString()
					createField = append(createField, req.Fields[i])
				}

				diffField := calcDifference(oldFields, createField)

				store.Access.DeleteFieldsByApiUniqueId(api.UniqueId)

				store.Access.CreateFields(api.UniqueId, createField)

				for _, field := range diffField {
					fmt.Println(field.Name)
					if _, err := store.Access.ContentDb.UpdateMany(store.Access.Ctx, bson.M{"api_id": api.UniqueId}, bson.M{"$unset": bson.M{field.Name: ""}}); err != nil {
						fmt.Println("fault " + err.Error())
					}
				}
			},
		}})
	}
}
