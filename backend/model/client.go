package model

var ClientAbilities map[string]Ability = map[string]Ability{
	AbilityCreateContent:    AbilityCreateContent,
	AbilityUpdateAllContent: AbilityUpdateAllContent,
	AbilityGetAllContent:    AbilityGetAllContent,
	AbilityDeleteAllContent: AbilityDeleteAllContent,
}

type Client struct {
	Id      string    `json:"client_id" db:"client_id"`
	Name    string    `json:"client_name" db:"client_name"`
	Secret  string    `json:"client_secret" db:"client_secret"`
	Ability []Ability `json:"client_ability" db:"-"`
}

type ClientAbility struct {
	Id        string `db:"client_ability_id" json:"-"`
	ClientId  string `db:"client_id"         json:"-"`
	AbilityId string `db:"ability_id"        json:"ability_id"`
}
