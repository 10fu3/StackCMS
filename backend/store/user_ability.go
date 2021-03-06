package store

import (
	"StackCMS/model"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
)

func (d *Db) HasUserAuthority(userId string, abilities []model.Ability) bool {
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
		if strings.Contains(e.Error(), "sync") {
			fmt.Println("user authority occurred command sync error sql")
		}
		return false
	}

	var flag = false

	for r.Next() {
		flag = true
	}
	return flag
}
