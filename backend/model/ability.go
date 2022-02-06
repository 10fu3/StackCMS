package model

import "strings"

var abilitiesMap = map[string]bool{
	AbilityCreateContent:      true,
	AbilityUpdateAllContent:   true,
	AbilityUpdateRoleContent:  true,
	AbilityUpdateSelfContent:  true,
	AbilityPublishAllContent:  true,
	AbilityPublishRoleContent: true,
	AbilityPublishSelfContent: true,
	AbilityGetAllContent:      true,
	AbilityGetRoleContent:     true,
	AbilityGetSelfContent:     true,
	AbilityDeleteAllContent:   true,
	AbilityDeleteRoleContent:  true,
	AbilityDeleteSelfContent:  true,
	AbilityCreateRole:         true,
	AbilityUpdateRoleName:     true,
	AbilityGetRole:            true,
	AbilityDeleteRole:         true,
	AbilityCreateApi:          true,
	AbilityUpdateApi:          true,
	AbilityGetApi:             true,
	AbilityDeleteApi:          true,
	AbilityCreateUser:         true,
	AbilityGetAllUser:         true,
	AbilityUpdateAllUser:      true,
	AbilityUpdateSelfUser:     true,
	AbilityDeleteUser:         true,
	AbilityUpdateRoleAbility:  true,
	AbilityUpdateRoleUser:     true,
	AbilityCreateClient:       true,
	AbilityUpdateClient:       true,
	AbilityGetClient:          true,
	AbilityDeleteClient:       true,
}

var abilities = []Ability{
	AbilityCreateContent,
	AbilityUpdateAllContent,
	AbilityUpdateRoleContent,
	AbilityUpdateSelfContent,
	AbilityPublishAllContent,
	AbilityPublishRoleContent,
	AbilityPublishSelfContent,
	AbilityGetAllContent,
	AbilityGetRoleContent,
	AbilityGetSelfContent,
	AbilityDeleteAllContent,
	AbilityDeleteRoleContent,
	AbilityDeleteSelfContent,
	AbilityCreateRole,
	AbilityUpdateRoleName,
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
	AbilityUpdateRoleAbility,
	AbilityUpdateRoleUser,
	AbilityCreateClient,
	AbilityUpdateClient,
	AbilityGetClient,
	AbilityDeleteClient,
}

func InitParams() map[string]map[string][]string {
	results := map[string]map[string][]string{}

	for _, category := range []string{"Api", "Content", "Role", "User", "Client"} {
		results[category] = map[string][]string{}
		for _, curd := range []string{"Create", "Update", "Get", "Delete"} {
			results[category][curd] = []string{}
		}
	}
	results["Content"]["Publish"] = []string{}
	return results
}

func ConvertPermsToClientPerms(args []string) map[string]map[string][]string {

	results := InitParams()

	for _, arg := range args {
		sep := strings.Split(arg, ".")
		if len(sep) != 3 {
			continue
		}
		if _, ok := abilitiesMap[arg]; !ok {
			continue
		}
		results[sep[0]][sep[1]] = append(results[sep[0]][sep[1]], arg)
	}
	return results
}

var categorizedAbility = map[string]map[string]map[string]bool{
	"Api": {
		"Create": {
			AbilityCreateApi: true,
		},
		"Update": {
			AbilityUpdateApi: true,
		},
		"Get": {
			AbilityGetApi: true,
		},
		"Delete": {
			AbilityDeleteApi: true,
		},
	}, "Content": {
		"Create": {
			AbilityCreateContent: true,
		},
		"Update": {
			AbilityUpdateAllContent:  true,
			AbilityUpdateRoleContent: true,
			AbilityUpdateSelfContent: true,
		},
		"Publish": {
			AbilityPublishAllContent:  true,
			AbilityPublishRoleContent: true,
			AbilityPublishSelfContent: true,
		},
		"Get": {
			AbilityGetAllContent:  true,
			AbilityGetSelfContent: true,
			AbilityGetRoleContent: true,
		},
		"Delete": {
			AbilityDeleteAllContent:  true,
			AbilityDeleteRoleContent: true,
			AbilityDeleteSelfContent: true,
		},
	}, "Role": {
		"Create": {
			AbilityCreateRole: true,
		},
		"Update": {
			AbilityUpdateRoleAbility: true,
			AbilityUpdateRoleUser:    true,
			AbilityUpdateRoleName:    true,
		},
		"Get": {
			AbilityGetRole: true,
		},
		"Delete": {
			AbilityDeleteRole: true,
		},
	}, "User": {
		"Create": {
			AbilityCreateUser: true,
		},
		"Update": {
			AbilityUpdateAllUser:  true,
			AbilityUpdateSelfUser: true,
		},
		"Get": {
			AbilityGetAllUser: true,
		},
		"Delete": {
			AbilityDeleteUser: true,
		},
	}, "Client": {
		"Create": {
			AbilityCreateClient: true,
		},
		"Update": {
			AbilityUpdateClient: true,
		},
		"Get": {
			AbilityGetClient: true,
		},
		"Delete": {
			AbilityDeleteClient: true,
		},
	},
}

func GetAllAbility() []Ability {
	return abilities
}

type Ability string

func (a Ability) String() string {
	return string(a)
}

const (
	AbilityCreateContent = "Content.Create.All"

	AbilityUpdateAllContent  = "Content.Update.All"
	AbilityUpdateRoleContent = "Content.Update.Role"
	AbilityUpdateSelfContent = "Content.Update.Self"

	AbilityPublishAllContent  = "Content.Publish.All"
	AbilityPublishRoleContent = "Content.Publish.Role"
	AbilityPublishSelfContent = "Content.Publish.Self"

	AbilityGetAllContent  = "Content.Get.All"
	AbilityGetSelfContent = "Content.Get.Self"
	AbilityGetRoleContent = "Content.Get.Role"

	AbilityDeleteAllContent  = "Content.Delete.All"
	AbilityDeleteRoleContent = "Content.Delete.Role"
	AbilityDeleteSelfContent = "Content.Delete.Self"

	AbilityCreateRole = "Role.Create.All"

	AbilityUpdateRoleAbility = "Role.Update.Ability"
	AbilityUpdateRoleUser    = "Role.Update.User"
	AbilityUpdateRoleName    = "Role.Update.Name"

	AbilityGetRole = "Role.Get.All"

	AbilityDeleteRole = "Role.Delete.All"

	AbilityCreateApi = "Api.Create.All"

	AbilityUpdateApi = "Api.Update.All"

	AbilityGetApi = "Api.Get.All"

	AbilityDeleteApi = "Api.Delete.All"

	AbilityCreateUser = "User.Create.All"

	AbilityGetAllUser = "User.Get.All"

	AbilityUpdateSelfUser = "User.Update.Self"
	AbilityUpdateAllUser  = "User.Update.All"

	AbilityDeleteUser = "User.Delete.All"

	AbilityCreateClient = "Client.Create.All"
	AbilityUpdateClient = "Client.Update.All"
	AbilityGetClient    = "Client.Get.All"
	AbilityDeleteClient = "Client.Delete.All"
)
