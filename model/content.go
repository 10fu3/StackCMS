package model

type JSON map[string]interface{}

type FilterType string

type ResultCount struct {
	Offset int
	Limit  int
}

type GetQuery struct {
	Count  ResultCount
	ApiId  string
	Filter map[string]interface{}
	Fields []string
}

type Api struct {
	IsSingleContent bool    `json:"isSingleContent" db:"is_single"`
	Id              string  `json:"api_id" db:"api_id"`
	Fields          []Field `json:"fields" db:"-"`
}

type Field struct {
	Id            string  `json:"id" db:"field_id"`
	Name          string  `json:"field_name" db:"field_name"`
	ApiId         string  `json:"api_id" db:"api_id"`
	Type          string  `json:"type" db:"field_type"`
	RelationApiId *string `json:"relation_api" db:"relation_api"`
}
