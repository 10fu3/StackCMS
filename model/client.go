package model

var ClientAbilities map[string]Ability = map[string]Ability{
	AbilityCreateContent:    AbilityCreateContent,
	AbilityUpdateAllContent: AbilityUpdateAllContent,
	AbilityGetAllContent:    AbilityGetAllContent,
	AbilityDeleteAllContent: AbilityDeleteAllContent,
}

type Client struct {
	Id     string `db:"client_id"`
	Name   string `db:"client_name"`
	Secret string `db:"client_secret"`
}

type ClientAbility struct {
	Id        string `db:"client_ability_id" json:"-"`
	ClientId  string `db:"client_id"         json:"-"`
	AbilityId string `db:"ability_id"        json:"ability_id"`
}
