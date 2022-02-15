package store

import (
	"StackCMS/Setup"
	"StackCMS/model"
)

type UsersRole interface {
	GetUserRoles(userId string) []model.Role
	JoinRoleUser(userId string, roleIds []string)
	LeaveRoleUser(userId string)
	LeaveRole(roleId string)
	IsSameJoinedRole(aUserId string, bUserId string) []model.Role
}

func (d *Db) GetUserRoles(userId string) []model.Role {
	r := []model.Role{}
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return r
		}
	}
	d.Db.Select(&r, "SELECT * FROM roles WHERE role_id IN (SELECT role_id FROM user_role WHERE user_id = ?)", userId)
	return r
}

func (d *Db) JoinRoleUser(userId string, roleIds []string) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return
		}
	}
	t, e := d.Db.Beginx()
	if e != nil {
		return
	}
	for _, roleId := range roleIds {
		_, e = t.Exec("INSERT INTO user_role (user_role_id,user_id,role_id) VALUES (?,?,?)", userId+"_"+roleId, userId, roleId)
		if e != nil {
			return
		}
	}
	t.Commit()
}

func (d *Db) LeaveRoleUser(userId string) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return
		}
	}
	d.Db.Exec("DELETE FROM user_role WHERE user_id = ?", userId)
}

func (d *Db) LeaveRole(roleId string) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return
		}
	}
	d.Db.Exec("DELETE FROM user_role WHERE role_id = ?", roleId)
}

func (d *Db) SameJoinedRole(aUserId string, bUserId string) []model.Role {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return []model.Role{}
		}
	}
	var result []model.Role
	d.Db.Select(&result, "SELECT * FROM roles WHERE role_id IN ("+
		"SELECT role_id FROM user_role WHERE user_id = ? AND role_id IN ("+
		"SELECT role_id FROM user_role WHERE user_id = ?"+
		")"+
		")", aUserId, bUserId)
	return result
}
