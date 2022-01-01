package store

import "StackCMS/model"

type RolesAbility interface {
	AppendAbility(role *model.Role, ability model.Ability)
	LeaveAbility(role *model.Role, ability model.Ability)
}

func (d *Db) AppendAbility(role *model.Role, ability model.Ability) {
	d.Db.Exec("INSERT INTO role_ability (role_ability_id,role_id,ability_id) VALUES (?,?,?)", role.Id+"_"+ability.String(), role.Id, ability.String())
}

func (d *Db) LeaveAbility(role *model.Role, ability model.Ability) {
	d.Db.Exec("DELETE FROM role_ability WHERE role_abiltiy = ?", role.Id+"_"+ability.String())
}
