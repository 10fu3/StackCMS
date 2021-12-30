package model

type Ability string

func (a Ability) String() string {
	return string(a)
}

const (
	AbilityCreateContent  = "CreateContent"
	AbilityUpdateContent  = "UpdateContent"
	AbilityPublishContent = "PublishContent"
	AbilityGetContent     = "GetContent"
	AbilityDeleteContent  = "DeleteContent"

	AbilityCreateRole = "CreateRole"
	AbilityUpdateRole = "UpdateRole"
	AbilityGetRole    = "GetRole"
	AbilityDeleteRole = "DeleteRole"

	AbilityCreateApi = "CreateApi"
	AbilityUpdateApi = "UpdateApi"
	AbilityGetApi    = "GetApi"
	AbilityDeleteApi = "DeleteApi"

	AbilityCreateUser = "CreateUser"
	AbilityGetUser    = "GetUser"
	AbilityDeleteUser = "DeleteUser"

	AbilityChangeUserAbility = "ChangeUserAbility"
)
