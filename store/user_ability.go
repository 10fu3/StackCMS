package store

import (
	"StackCMS/model"
	"github.com/jmoiron/sqlx"
)

func (d *Db) IsUserAuthorization(userId string, abilities []model.Ability) bool {

	args := func() []string {
		a := []string{}
		for _, ability := range abilities {
			a = append(a, ability.String())
		}
		return a
	}()

	sql := "select * from " +
		"role_ability " +
		"inner join " +
		"user_role " +
		"on " +
		"role_ability.role_id = role_ability.role_id " +
		"where " +
		"user_id = ? " +
		"and " +
		"ability_id IN (?)"

	q, a, e := sqlx.In(sql, userId, args)

	if e != nil {
		return false
	}

	r, e := d.Db.Query(q, a...)
	if e != nil {
		return false
	} else {
		return r.Next()
	}
}
