package store

import (
	"StackCMS/model"
)

type UsersRole interface {
	JoinUser(user model.User, role model.Role)
	LeaveUser(user model.User, role model.Role)
}

func (d *Db) JoinUser(user model.User, role model.Role) {
	d.Db.Exec("INSERT INTO user_role (user_role_id,user_id,role_id) VALUES (?,?,?)", user.Id+"_"+role.Id, user.Id, role.Id)
}

func (d *Db) LeaveUser(user model.User, role model.Role) {
	d.Db.Exec("DELETE FROM user_role WHERE user_role_id = ?", user.Id+"_"+role.Id)
}
