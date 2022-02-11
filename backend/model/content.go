package model

import (
	"StackCMS/util"
	"github.com/google/uuid"
	"time"
)

type JSON map[string]interface{}

type FilterType string

type Api struct {
	UniqueId        string  `json:"unique_id" db:"id"`
	IsSingleContent bool    `json:"is_single" db:"is_single"`
	Id              string  `json:"api_id" db:"api_id"`
	Fields          []Field `json:"fields" db:"-"`
	PreviewURL      *string `json:"preview_url" db:"preview_url"`
	//PreviewSecret   *string `json:"preview_secret" db:"preview_secret"`
}

type Field struct {
	Id            string  `json:"id"          db:"field_id"`
	Name          string  `json:"field_name"  db:"field_name"`
	ApiId         string  `json:"api_id"      db:"api_id"`
	Type          string  `json:"type"        db:"field_type"`
	Priority      int     `json:"priority"    db:"priority"`
	RelationApiId *string `json:"relation_api" db:"relation_api"`
}

func (f1 *Field) Equals(f2 Field) bool {
	if f1.Id != f2.Id {
		return false
	}
	if f1.Name != f2.Name {
		return false
	}
	if f1.Type != f2.Type {
		return false
	}
	if f1.Priority != f2.Priority {
		return false
	}
	if f1.RelationApiId != nil && f2.RelationApiId != nil {
		return *f1.RelationApiId == *f2.RelationApiId
	} else if f1.RelationApiId == nil && f2.RelationApiId == nil {
		return true
	}
	return false
}

type Content struct {
	Id          string     `json:"_id"          bson:"_id,omitempty"`
	ApiId       string     `json:"api_id"       bson:"api_id,omitempty"`
	CreatedAt   time.Time  `json:"created_at"   bson:"created_at,omitempty"`
	UpdatedAt   time.Time  `json:"updated_at"   bson:"updated_at,omitempty"`
	PublishedAt *time.Time `json:"published_at" bson:"published_at"`
	RevisedAt   *time.Time `json:"revised_at"   bson:"revised_at"`
	CreatedBy   string     `json:"created_by"   bson:"created_by,omitempty"`
	UpdatedBy   string     `json:"updated_by"   bson:"updated_by,omitempty"`
	PublishWill *time.Time `json:"publish_will" bson:"publish_will"`
	StopWill    *time.Time `json:"stop_will"    bson:"stop_will"`
}

func NewContent() Content {
	return Content{
		Id:          uuid.NewString(),
		ApiId:       "",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		PublishedAt: nil,
		RevisedAt:   nil,
		CreatedBy:   "",
		UpdatedBy:   "",
		PublishWill: nil,
		StopWill:    nil,
	}
}

var DefinedMeta = []string{
	"_id",
	"created_at",
	"created_by",
	"deleted_at",
	"published_at",
	"revised_at",
	"updated_at",
	"updated_by",
	"publish_will",
	"stop_will",
}

var DefinedMetaMap = util.StringSliceToBooleanMap(DefinedMeta)

func (c *Content) ToJson() map[string]interface{} {
	r := map[string]interface{}{}
	r["_id"] = c.Id
	r["updated_at"] = c.UpdatedAt
	r["created_at"] = c.CreatedAt
	r["published_at"] = c.PublishedAt
	r["revised_at"] = c.RevisedAt
	r["created_by"] = c.CreatedBy
	r["updated_by"] = c.UpdatedBy
	r["publish_will"] = c.PublishWill
	r["stop_will"] = c.StopWill
	return r
}
