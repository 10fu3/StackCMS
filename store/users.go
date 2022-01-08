package store

import "StackCMS/model"

type Users interface {
	GetUsersAll() []model.User
	GetUserById(id string) *model.User
	GetUserByMail(mail string) *model.User
	GetUsersByRole(roleId string) []model.User
	UpdateUser(new model.User)
	DeleteUser(id string)
}

func (d *Db) GetUsersAll() []model.User {
	r := []model.User{}
	d.Db.Select(&r, "SELECT * FROM users")
	return r
}

func (d *Db) GetUserById(id string) *model.User {
	var r model.User
	if err := d.Db.Get(&r, "SELECT * FROM users WHERE user_id = ?", id); err != nil {
		return nil
	}
	return &r
}

func (d *Db) GetUserByMail(mail string) *model.User {
	var r model.User
	if err := d.Db.Get(&r, "SELECT * FROM users WHERE mail = ?", mail); err != nil {
		return nil
	}
	return &r
}

func (d *Db) GetUsersByRole(roleId string) []model.User {
	r := []model.User{}
	if err := d.Db.Select(&r, "SELECT * FROM users JOIN user_role ON user.id = user_role.user_id WHERE role_id = ?", roleId); err != nil {
		return nil
	}
	return r
}

func (d *Db) UpdateUser(new model.User) {
	user := d.GetUserById(new.Id)
	if user == nil {
		return
	}

	user = model.UpdateUser(*user, new)

	d.Db.Exec("UPDATE users "+
		"SET"+
		" password_hash = ?,"+
		" nick_name = ?,"+
		" mail = ? "+
		"WHERE user_id = ? AND is_lock = false", user.PasswordHash, user.NickName, user.Mail, user.Id)
}

func (d *Db) DeleteUser(id string) {
	d.Db.Exec("DELETE FROM users WHERE user_id = ? AND is_lock = false", id)
}
