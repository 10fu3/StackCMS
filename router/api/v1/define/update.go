package define

import (
	"StackCMS/model"
	"StackCMS/store"
	"github.com/gin-gonic/gin"
	"net/http"
)

type FieldStatus string

const (
	appendField = "appendField"
	deleteField = "deleteField"
)

var statuses = map[FieldStatus]bool{appendField: true, deleteField: true}

type targetField struct {
	Field  model.Field `json:"field"`
	Status FieldStatus `json:"status"`
}

func (t targetField) isValid() bool {
	_, ok := statuses[t.Status]
	return ok
}

type fieldUpdateRequest struct {
	Fields []targetField `json:"fields"`
}

func Update() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req fieldUpdateRequest

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
		store.Access.DeleteFieldsByApiId(api.Id)

		createField := []model.Field{}
		for i := 0; i < len(req.Fields); i++ {
			if req.Fields[i].Status == appendField {
				createField = append(createField)
			}
		}

		store.Access.CreateFields(api.Id, createField)
	}
}
