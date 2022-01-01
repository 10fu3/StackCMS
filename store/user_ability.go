package store

import "StackCMS/model"

func (d *Db) IsUserAuthorization(userId string, ability model.Ability) bool {
	r, e := d.Db.Query("select * from "+
		"role_ability "+
		"inner join "+
		"user_role "+
		"on "+
		"role_ability.role_id = role_ability.role_id "+
		"where "+
		"user_id = ? "+
		"and "+
		"ability_id = ?", userId, ability.String())
	if e != nil {
		return false
	} else {
		return r.Next()
	}
}
