package store

import (
	"StackCMS/model"
	"github.com/jmoiron/sqlx"
)

func (d *Db) HasUserAuthority(userId string, abilities []model.Ability) bool {

	if _, err := SetupDb(); err != nil {
		return false
	}

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

	q = "select user_id from user_role where role_id IN ( " + q + ") AND user_id = ? LIMIT 1"

	r := d.Db.QueryRowx(q, append(a, userId)...)
	if r.Err() != nil || r.MapScan(map[string]interface{}{}) != nil {
		return false
	}
	return true
}
