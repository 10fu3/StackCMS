package store

import "StackCMS/model"

type UsersRole interface {
	GetUserRoles(userId string) []model.Role
	JoinRoleUser(userId string, roleId string)
	LeaveRoleUser(userId string, roleId string)
	IsSameJoinedRole(aUserId string, bUserId string) []model.Role
}

func (d *Db) GetUserRoles(userId string) []model.Role {
	r := []model.Role{}
	d.Db.Select(&r, "SELECT * FROM roles WHERE role_id IN (SELECT role_id FROM user_role WHERE user_id = ?)", userId)
	return r
}

func (d *Db) JoinRoleUser(userId string, roleId string) {
	d.Db.Exec("INSERT INTO user_role (user_role_id,user_id,role_id) VALUES (?,?,?)", userId+"_"+roleId, userId, roleId)
}

func (d *Db) LeaveRoleUser(userId string, roleId string) {
	d.Db.Exec("DELETE FROM user_role WHERE user_role_id = ?", userId+"_"+roleId)
}

func (d *Db) SameJoinedRole(aUserId string, bUserId string) []model.Role {
	var result []model.Role
	d.Db.Select(&result, "SELECT * FROM roles WHERE role_id IN ("+
		"SELECT role_id FROM user_role WHERE user_id = ? AND role_id IN ("+
		"SELECT role_id FROM user_role WHERE user_id = ?"+
		")"+
		")", aUserId, bUserId)
	return result
}
