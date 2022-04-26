package store

import (
	"StackCMS/model"
	"fmt"
	"github.com/google/uuid"
	"time"
)

func getLoginSessionExpiredTime() time.Time {
	return time.Now().AddDate(0, 0, 7)
}

//| column_name | type        |
//| ----------- | ----------- |
//| session_id  | varchar(40) |
//| user_id     | varchar(40) |
//| expired_at  | DATETIME    |

type sqlLoginSessionLine struct {
	SessionId string    `db:"session_id"`
	UserId    string    `db:"user_id"`
	ExpiredAt time.Time `db:"expired_at"`
}

type LoginSessionStore interface {
	GetSessionUser(authorization string) string
	AddSessionUser(user *model.User) (string, error)
	DeleteSessionUserBySession(authorization string)
	DeleteSessionUserByUser(user *model.User)
}

func (s *Db) GetSessionUser(authorization string) string {
	var u sqlLoginSessionLine
	sqlErr := s.Db.QueryRowx("SELECT * FROM login_session WHERE session_id = ?", authorization).StructScan(&u)

	if sqlErr != nil {
		fmt.Println(sqlErr.Error())
		return ""
	}

	if u.ExpiredAt.Before(time.Now()) {
		s.DeleteSessionUserBySession(authorization)
		return ""
	}

	return u.UserId
}

func (s *Db) AddSessionUser(user *model.User) (string, error) {
	u, uuidErr := uuid.NewRandom()
	if uuidErr != nil {
		return "", uuidErr
	}
	sessionId := u.String()

	s.Db.Exec("INSERT INTO login_session values (?,?,?)", sessionId, user.Id, getLoginSessionExpiredTime())

	return sessionId, nil
}

func (s *Db) DeleteSessionUserBySession(authorization string) {
	s.Db.Exec("DELETE FROM login_session where session_id = ?", authorization)
}

func (s *Db) DeleteSessionUserByUser(user *model.User) {
	s.Db.Exec("DELETE FROM login_session where user_id = ?", user.Id)
}
