package model

type Role struct {
	Id        string   `db:"role_id" json:"id"`
	Name      string   `db:"role_name" json:"name"`
	Abilities []string `json:"abilities" db:"-"`
}

type RoleAbility struct {
	Id        string `db:"role_ability_id" json:"-"`
	RoleId    string `db:"role_id" json:"-"`
	AbilityId string `db:"ability_id" json:"ability_id"`
}
