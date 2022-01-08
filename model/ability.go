package model

var abilities = []Ability{
	AbilityCreateContent,
	AbilityUpdateContent,
	AbilityPublishContent,
	AbilityGetAllContent,
	AbilityGetSelfContent,
	AbilityDeleteContent,
	AbilityCreateRole,
	AbilityUpdateRole,
	AbilityGetRole,
	AbilityDeleteRole,
	AbilityCreateApi,
	AbilityUpdateApi,
	AbilityGetApi,
	AbilityDeleteApi,
	AbilityCreateUser,
	AbilityGetAllUser,
	AbilityUpdateAllUser,
	AbilityUpdateSelfUser,
	AbilityDeleteUser,
	AbilityChangeRoleAbility,
	AbilityChangeRoleUser,
}

func GetAllAbility() []Ability {
	return abilities
}

type Ability string

func (a Ability) String() string {
	return string(a)
}

const (
	AbilityCreateContent  = "Content.Create"
	AbilityUpdateContent  = "Content.Update"
	AbilityPublishContent = "Content.Create.Publish"
	AbilityGetAllContent  = "Content.Get.All"
	AbilityGetSelfContent = "Content.Get.Self"
	AbilityDeleteContent  = "Content.Delete"

	AbilityCreateRole = "Role.Create"
	AbilityUpdateRole = "Role.Update"
	AbilityGetRole    = "Role.Get.All"
	AbilityDeleteRole = "Role.Delete"

	AbilityCreateApi = "Api.Create"
	AbilityUpdateApi = "Api.Update"
	AbilityGetApi    = "Api.Get"
	AbilityDeleteApi = "Api.Delete"

	AbilityCreateUser     = "User.Create"
	AbilityGetAllUser     = "User.Get.All"
	AbilityUpdateSelfUser = "User.Update.Self"
	AbilityUpdateAllUser  = "User.Update.All"
	AbilityDeleteUser     = "User.Delete"

	AbilityChangeRoleAbility = "Role.Update.Ability"
	AbilityChangeRoleUser    = "Role.Update.User"
)
