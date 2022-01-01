package model

type Ability string

func (a Ability) String() string {
	return string(a)
}

const (
	AbilityCreateContent      = "CreateContent"
	AbilityUpdateContent      = "UpdateContent"
	AbilityPublishContent     = "PublishContent"
	AbilityGetAllContent      = "GetAllContent"
	AbilityGetSameRoleContent = "GetAllContent"
	AbilityGetSelfContent     = "GetAllContent"
	AbilityDeleteContent      = "DeleteContent"

	AbilityCreateRole = "CreateRole"
	AbilityUpdateRole = "UpdateRole"
	AbilityGetRole    = "GetRole"
	AbilityDeleteRole = "DeleteRole"

	AbilityCreateApi = "CreateApi"
	AbilityUpdateApi = "UpdateApi"
	AbilityGetApi    = "GetApi"
	AbilityDeleteApi = "DeleteApi"

	AbilityCreateUser  = "CreateUser"
	AbilityGetAllUser  = "GetAllUser"
	AbilityGetSameRole = "GetSameRoleUser"
	AbilityGetSelfUser = "GetSameRoleUser"
	AbilityUpdateAllUser
	AbilityDeleteUser = "DeleteUser"

	AbilityChangeUserAbility = "ChangeUserAbility"
)
