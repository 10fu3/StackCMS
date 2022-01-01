package store

import "StackCMS/model"

type Ability interface {
	HasAbility(user *model.User, ability model.Ability) bool
}
