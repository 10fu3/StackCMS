package model

type User struct {
	Id           string `json:"user_id" db:"user_id"`
	NickName     string `json:"nick_name" db:"nick_name"`
	Mail         string `json:"mail" db:"mail"`
	PasswordHash string `json:"-" db:"password_hash"`
	Role         []Role `json:"roles" db:"-"`
	IsLock       bool   `json:"is_lock" db:"is_lock"`
}

func UpdateUser(old User, new User) *User {
	pass := old.PasswordHash
	if new.PasswordHash == "" {
		pass = new.PasswordHash
	}

	nick := old.NickName

	mail := old.Mail

	return &User{
		Id:           old.Id,
		NickName:     nick,
		Mail:         mail,
		PasswordHash: pass,
	}

}

type UserRole struct {
	Id     string `db:"user_role_id"`
	UserId string `db:"user_id"`
	RoleId string `db:"role_id"`
}
