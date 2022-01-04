package store

import "StackCMS/model"

type RolesAbility interface {
	GetAbility() map[string][]string
	AppendAbility(role *model.Role, ability model.Ability)
	LeaveAbility(role *model.Role, ability model.Ability)
}

func (d *Db) GetAbility() map[string][]string {
	r := map[string][]string{}

	dbr := []model.RoleAbility{}
	d.Db.Select(&dbr, "SELECT * FROM role_ability")

	for _, ability := range dbr {
		r[ability.RoleId] = append(r[ability.RoleId], ability.AbilityId)
	}
	return r
}

func (d *Db) AppendAbility(role *model.Role, ability model.Ability) {
	d.Db.Exec("INSERT INTO role_ability (role_ability_id,role_id,ability_id) VALUES (?,?,?)", role.Id+"_"+ability.String(), role.Id, ability.String())
}

func (d *Db) LeaveAbility(role *model.Role, ability model.Ability) {
	d.Db.Exec("DELETE FROM role_ability WHERE role_abiltiy = ?", role.Id+"_"+ability.String())
}
