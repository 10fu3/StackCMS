package model

type Role struct {
	Id   string `db:"role_id"`
	Name string `db:"role_name"`
}

type RoleAbility struct {
	Id        string `db:"role_ability_id"`
	RoleId    string `db:"role_id"`
	AbilityId string `db:"ability_id"`
}
