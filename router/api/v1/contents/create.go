package contents

import (
	"StackCMS/model"
	"StackCMS/store"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Create() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var err error
		api := store.Access.GetApi(ctx.Param("api_id"))
		var j model.JSON = map[string]interface{}{}
		if api == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "not_found",
			})
			return
		}
		if err = ctx.BindJSON(&j); err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "cant_parse",
			})
		}

		fields := store.Access.GetFieldsByApiId(api.Id)

		if len(fields) == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "can't_check_params",
			})
			return
		}

		for _, field := range fields {
			if _, ok := j[field.Name]; !ok {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message":   fmt.Sprintf("your_request_is_mistake"),
					"params_id": field.Name,
				})
				return
			}
		}

		if len(fields) != len(j) {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": fmt.Sprintf("your_request_is_mistake"),
				"reason":  fmt.Sprintf("registered params count is %d but input %d", len(fields), len(j)),
			})
			return
		}

		r := store.Access.CreateContent(api.Id, j)

		if r != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": r.Error(),
			})
			return
		}

	}
}
