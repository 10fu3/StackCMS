package main

import (
	"errors"
	"fmt"
	"reflect"
)

type Content map[string]interface{}

type FieldInfo struct {
	Type   string `json:"type"`
	IsNeed bool   `json:"isNeed"`
}

type Api struct {
	IsSingleContent bool
	Store           interface{}
	Fields          map[string]FieldInfo
}

type Apis map[string]*Api

func FieldChecker(input Content, define map[string]FieldInfo) error {
	for k, v := range define {
		if _, hasD := input[k]; !hasD && v.IsNeed {
			return errors.New(fmt.Sprintf("need key '%s'", k))
		}

		typeS := reflect.TypeOf(input[k]).Kind().String()

		if v.Type != typeS {
			return errors.New(fmt.Sprintf("field '%s' is defined type '%s', but input value type is '%s'", k, define[k], typeS))
		}
	}
	return nil
}

//func main() {
//
//	config.Values = config.GetFirstSetupConfig()
//
//	Setup.Db()
//
//	g := gin.Default()
//
//	apis := Apis{}
//
//	g.GET("/api/contents/:id", func(ctx *gin.Context) {
//
//		if ctx.Param("id") == "" {
//			ctx.JSON(400, gin.H{
//				"message": "bad_params",
//			})
//			return
//		}
//
//		v, has := apis[ctx.Param("id")]
//
//		if !has {
//			ctx.JSON(404, gin.H{
//				"message": "not_found",
//			})
//			return
//		}
//
//		ctx.JSON(200, v.Store)
//	})
//
//	g.POST("/api/contents/:id", func(ctx *gin.Context) {
//
//		if ctx.Param("id") == "" {
//			ctx.JSON(400, gin.H{
//				"message": "empty_id",
//			})
//			return
//		}
//
//		v, has := apis[ctx.Param("id")]
//
//		if !has {
//			ctx.JSON(404, gin.H{
//				"message": "not_found",
//			})
//			return
//		}
//
//		var r Content
//		bindErr := ctx.BindJSON(&r)
//		if bindErr != nil {
//			ctx.JSON(400, gin.H{
//				"message": bindErr.Error(),
//			})
//			return
//		}
//
//		//checker
//
//		inputErr := FieldChecker(r, v.Fields)
//
//		if inputErr != nil {
//			ctx.JSON(400, gin.H{
//				"message": inputErr.Error(),
//			})
//			return
//		}
//
//		r["content_id"] = uuid.New().String()
//		r["createdAt"] = ""
//		r["publishedAt"] = nil
//
//		if v.IsSingleContent {
//			apis[ctx.Param("id")].Store = r
//		} else {
//			(apis[ctx.Param("id")].Store).(map[string]Content)[(r["content_id"]).(string)] = r
//		}
//
//	})
//
//	g.POST("/api/define", func(ctx *gin.Context) {
//		type CreateReq struct {
//			IsSingleContent bool                 `json:"isSingleContent"`
//			Name            string               `json:"name"`
//			Fields          map[string]FieldInfo `json:"fields"`
//		}
//
//		var r CreateReq
//		bindErr := ctx.BindJSON(&r)
//
//		if bindErr != nil {
//			ctx.JSON(400, gin.H{
//				"message": bindErr.Error(),
//			})
//			return
//		}
//
//		if r.IsSingleContent {
//			apis[r.Name] = &Api{
//				IsSingleContent: r.IsSingleContent,
//				Store:           Content{},
//				Fields:          r.Fields,
//			}
//		} else {
//			apis[r.Name] = &Api{
//				IsSingleContent: r.IsSingleContent,
//				Store:           map[string]Content{},
//				Fields:          r.Fields,
//			}
//		}
//
//	})
//	g.Run(":3000")
//}
