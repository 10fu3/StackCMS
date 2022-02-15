package store

import (
	"StackCMS/model"
	"errors"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Users interface {
	CreateUser(mail string, nick *string, password string)
	GetUsersAll() []model.User
	GetUserById(id string) *model.User
	GetUserByMail(mail string) *model.User
	GetUsersByRole(roleId string) []model.User
	UpdateUser(new model.User)
	DeleteUser(id string) error
}

func (d *Db) CreateUser(mail string, nick *string, password string) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return
		}
	}
	rawPass, _ := bcrypt.GenerateFromPassword([]byte(password), 10)

	d.Db.Exec("INSERT INTO users (user_id,nick_name,mail,password_hash,is_lock) VALUES(?,?,?,?,?)",
		uuid.NewString(),
		func() string {
			if nick == nil {
				return "仮ユーザー"
			}
			return *nick
		}(),
		mail,
		string(rawPass),
		false)
}

func (d *Db) GetUsersAll() []model.User {
	r := []model.User{}
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return r
		}
	}
	d.Db.Select(&r, "SELECT * FROM users")
	return r
}

func (d *Db) GetUserById(id string) *model.User {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return nil
		}
	}
	var r model.User
	if err := d.Db.Get(&r, "SELECT * FROM users WHERE user_id = ?", id); err != nil {
		return nil
	}
	return &r
}

func (d *Db) GetUserByMail(mail string) *model.User {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return nil
		}
	}
	var r model.User
	if err := d.Db.Get(&r, "SELECT * FROM users WHERE mail = ?", mail); err != nil {
		return nil
	}
	return &r
}

func (d *Db) GetUsersByRole(roleId string) []model.User {
	r := []model.User{}
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return r
		}
	}
	if err := d.Db.Select(&r, "SELECT * FROM users JOIN user_role ON user.id = user_role.user_id WHERE role_id = ?", roleId); err != nil {
		return nil
	}
	return r
}

func (d *Db) UpdateUser(new model.User) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return
		}
	}
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

func (d *Db) DeleteUser(id string) error {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if  _, err = SetupDb()
		err != nil{
			return errors.New("internal error")
		}
	}
	exec, err := d.Db.Exec("DELETE FROM users WHERE user_id = ? AND is_lock = false", id)
	if err != nil {
		return err
	}
	c, err := exec.RowsAffected()
	if err != nil || c == 0 {
		return errors.New("Not found rows")
	}
	return nil
}
