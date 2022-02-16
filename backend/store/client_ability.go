package store

import (
	"StackCMS/model"
	"fmt"
	"github.com/jmoiron/sqlx"
)

type ClientAbility interface {
	GetClientAbility() map[string][]string
	GetClientAbilityByClientId(clientId string) []model.Ability
	AppendClientAbilities(role model.Role, ability []string)
	AppendClientAbility(role *model.Role, ability model.Ability)
	LeaveClientAbility(role *model.Role)
	//LeaveAbilitiesByRoleId(role *model.Role)
}

func (d *Db) HasClientAuthority(clientId string, abilities []string) bool {
	q := "ability_id IN (?)"

	query, interfaceArgs, err := sqlx.In(q, abilities)
	if err != nil {
		return false
	}
	rows, e := d.Db.Query("SELECT * FROM client_ability where client_id = ? having "+query, append([]interface{}{clientId}, interfaceArgs...)...)

	if e != nil {
		fmt.Println("client authority error " + e.Error())
		return false
	}
	if rows.Err() != nil {
		return false
	}
	temp := struct {
		ClientId        string `db:"client_id"`
		ClientAbilityId string `db:"client_ability_id"`
		AbilityId       string `db:"ability_id"`
	}{}

	var flag = false
	for rows.Next() {
		rows.Scan(&temp)
		flag = true
	}
	return flag
}

func (d *Db) GetClientAbility() map[string][]string {
	r := map[string][]string{}

	dbr := []model.ClientAbility{}
	d.Db.Select(&dbr, "SELECT * FROM client_ability")

	for _, ability := range dbr {
		r[ability.ClientId] = append(r[ability.ClientId], ability.AbilityId)
	}
	return r
}

func (d *Db) GetClientAbilityByClientId(clientId string) []model.Ability {
	dbr := []model.Ability{}
	if err := d.Db.Select(&dbr, "SELECT ability_id FROM client_ability WHERE client_id = ?", clientId); err != nil {
		return make([]model.Ability, 0)
	}
	return dbr
}

func (d *Db) AppendClientAbilities(client model.Client, ability []model.Ability) {
	t, err := d.Db.Beginx()
	if err != nil {
		return
	}
	for _, a := range ability {
		if _, ok := model.ClientAbilities[string(a)]; !ok {
			continue
		}
		_, err = t.Exec("INSERT INTO client_ability (client_ability_id,client_id,ability_id) VALUES (?,?,?)", client.Id+"_"+string(a), client.Id, string(a))
		if err != nil {
			t.Rollback()
			return
		}
	}
	t.Commit()

}

func (d *Db) AppendClientAbility(client model.Client, ability model.Ability) {
	if _, ok := model.ClientAbilities[string(ability)]; !ok {
		return
	}
	d.Db.Exec("INSERT INTO client_ability (client_ability_id,client_id,ability_id) VALUES (?,?,?)", client.Id+"_"+ability.String(), client.Id, ability.String())
}

func (d *Db) DeleteClientAbility(clientId string) {
	d.Db.Exec("DELETE FROM client_ability WHERE client_id = ?", clientId)
}
