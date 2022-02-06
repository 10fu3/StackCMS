package model

import "encoding/json"

type Role struct {
	Id        string   `db:"role_id" json:"id"`
	Name      string   `db:"role_name" json:"name"`
	Abilities []string `json:"abilities" db:"-"`
	IsLock    bool     `db:"is_lock" json:"is_lock"`
}

func (r Role) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Id        string                         `json:"id"`
		Name      string                         `json:"name"`
		Abilities map[string]map[string][]string `json:"abilities"`
		IsLock    bool                           `json:"is_lock"`
	}{
		Id:        r.Id,
		Name:      r.Name,
		Abilities: ConvertPermsToClientPerms(r.Abilities),
		IsLock:    r.IsLock,
	})
}

type RoleAbility struct {
	Id        string `db:"role_ability_id" json:"-"`
	RoleId    string `db:"role_id"         json:""`
	AbilityId string `db:"ability_id"      json:"ability_id"`
}
