package model

import (
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type JSON map[string]interface{}

type FilterType string

type ResultCount struct {
	Offset int
	Limit  int
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

type Content struct {
	Id          string     `db:"content_id"   json:"id"`
	ApiId       string     `db:"api_id"       json:"api_id"`
	CreatedAt   time.Time  `db:"created_at"   json:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at"   json:"updated_at"`
	PublishedAt *time.Time `db:"published_at" json:"published_at"`
	RevisedAt   *time.Time `db:"revised_at"   json:"revised_at"`
	CreatedBy   string     `db:"created_by"   json:"created_by"`
	UpdatedBy   string     `db:"updated_by"   json:"updated_by"`
	PublishWill *time.Time `db:"publish_will" json:"publish_will"`
	StopWill    *time.Time `db:"stop_will"    json:"stop_will"`
}

type SqlContent struct {
	Id          string       `db:"content_id"`
	ApiId       string       `db:"api_id"`
	CreatedAt   time.Time    `db:"created_at"`
	UpdatedAt   time.Time    `db:"updated_at"`
	PublishedAt sql.NullTime `db:"published_at"`
	RevisedAt   sql.NullTime `db:"revised_at"`
	CreatedBy   string       `db:"created_by"`
	UpdatedBy   string       `db:"updated_by"`
	PublishWill sql.NullTime `db:"publish_will"`
	StopWill    sql.NullTime `db:"stop_will"`
}

func (s *SqlContent) ToContent() *Content {
	return &Content{
		Id:        s.Id,
		ApiId:     s.ApiId,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
		PublishedAt: func() *time.Time {
			if s.PublishedAt.Valid {
				return &s.PublishedAt.Time
			}
			return nil
		}(),
		RevisedAt: func() *time.Time {
			if s.RevisedAt.Valid {
				return &s.RevisedAt.Time
			}
			return nil
		}(),
		CreatedBy: s.CreatedBy,
		UpdatedBy: s.UpdatedBy,
		PublishWill: func() *time.Time {
			if s.PublishWill.Valid {
				return &s.PublishWill.Time
			}
			return nil
		}(),
		StopWill: func() *time.Time {
			if s.StopWill.Valid {
				return &s.StopWill.Time
			}
			return nil
		}(),
	}
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

var DefinedMeta = []string{"updated_at", "publish_at", "revised_at", "created_by", "updated_by", "publish_will", "stop_will"}

func (c *Content) ToJson() map[string]interface{} {
	r := map[string]interface{}{}
	r["_id"] = c.Id
	r["updated_at"] = c.UpdatedAt
	r["publish_at"] = c.PublishedAt
	r["revised_at"] = c.RevisedAt
	r["created_by"] = c.CreatedBy
	r["updated_by"] = c.UpdatedBy
	r["publish_will"] = c.PublishWill
	r["stop_will"] = c.StopWill
	return r
}
