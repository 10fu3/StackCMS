package store

import (
	"StackCMS/model"
	"github.com/jmoiron/sqlx"
)

type ClientAbility interface {
	GetClientAbility() map[string][]string
	AppendClientAbilities(role model.Role, ability []string)
	AppendClientAbility(role *model.Role, ability model.Ability)
	LeaveClientAbility(role *model.Role)
	//LeaveAbilitiesByRoleId(role *model.Role)
}

func (d *Db) HasClientAuthority(clientId string, abilities []model.Ability) bool {
	q := "SELECT * FROM client_ability where client_id = ? having ability_id IN (?)"

	args := func() []string {
		a := []string{clientId}
		for _, arg := range abilities {
			a = append(a, arg.String())
		}
		return a
	}

	query, interfaceArgs, err := sqlx.In(q, args())
	if err != nil {
		return false
	}
	rows, err := d.Db.Query(query, interfaceArgs)
	if err != nil {
		return false
	}
	return rows.Next()
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
