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

	inSql := "select role_id from role_ability where ability_id IN (?)"

	q, a, e := sqlx.In(inSql, args)

	if e != nil {
		return false
	}

	q = "select user_id from user_role where role_id IN ( " + q + ") AND user_id = ?"

	r, e := d.Db.Query(q, append(a, userId)...)
	if e != nil {
		return false
	} else {
		return r.Next()
	}
}
