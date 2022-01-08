import React, {useEffect, useState} from "react";
import store from "../../store";
import {getProfile, setCurrentUser} from "../../store/auth";
import {setApis} from "../../store/apis";
import {setUsers} from "../../store/users";
import {getRoles, setRoles} from "../../store/roles";
import {useSelector} from "react-redux";
import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Input, Spacer, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import {Link, useParams} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
const RoleDetailPage = ()=>{

    const roles = useSelector(getRoles)

    const [roleName,setRoleName] = useState("")

    const [roleAbility,setRoleAbility] = useState<{[id:string]:{[id:string]:string[]}}>({})

    const abilityCategory = ["Create","Update","Get","Delete"]

    const abilityCategoryMap:{[id:string]:string} = {
        "Api":"API",
        "All":"すべて",
        "Ability":"権限",
        "Content":"コンテンツ",
        "Self":"自分",
        "User":"ユーザー",
        "Role":"ロール",
        "Create":"作成",
        "Publish":"投稿",
        "Update":"編集",
        "Get":"取得",
        "Delete":"削除"
    }

    useEffect(()=>{
        setRoleName(roles && roles.length > 0 ? roles[0].name : "")
        if(roles &&roles.length > 0){
            const abilities:{[id:string]:{[id:string]:string[]}} = {
                "Api":{
                    "Create":[],
                    "Update":[],
                    "Get":[],
                    "Delete":[]
                },
                "Content":{
                    "Create":[],
                    "Update":[],
                    "Get":[],
                    "Delete":[]
                },
                "Role":{
                    "Create":[],
                    "Update":[],
                    "Get":[],
                    "Delete":[]
                },
                "User":{
                    "Create":[],
                    "Update":[],
                    "Get":[],
                    "Delete":[]
                },
            }
            for (const ability of (roles[0].abilities ? roles[0].abilities : [])) {
                const [category,ab,op] = ability.split(".")
                if(!abilities[category]){
                    abilities[category] = {}
                }
                if(!abilities[category][ab]){
                    abilities[category][ab] = [op ? op : ab]
                }else{
                    abilities[category][ab].push(op ? op : ab)
                }
            }
            console.log(abilities)
            setRoleAbility(abilities)
        }
    },[])

    return roles.length > 0 ? <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/role`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">ロール管理</chakra.p>
                </Center>
                <Spacer/>
                {
                    roles[0].is_lock ?
                        <></> :
                        <Flex>
                            <Box pl={2} pr={2}>
                                <Button colorScheme="green">
                                    変更
                                </Button>
                            </Box>
                            <Box pl={2} pr={2}>
                                <Button colorScheme="red">
                                    削除
                                </Button>
                            </Box>
                        </Flex>
                }
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pt={"10px"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Box bgColor="white" p={5} borderWidth="1px" borderRadius="3px" >
                    <Box>
                        ロール名:
                        <Box pt={5}>
                            <Input value={roleName} onChange={(e)=>{setRoleName(e.target.value)}}/>
                        </Box>
                    </Box>
                    <Box pt={5}>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th/>
                                    {
                                        abilityCategory.map(i=>{
                                            return <Th>{abilityCategoryMap[i]}</Th>
                                        })
                                    }
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    Object.keys(roleAbility).map(k=>{
                                        return <Tr>
                                            <Th>{abilityCategoryMap[k]}</Th>
                                            {
                                                abilityCategory.map(i=>{
                                                    const abilities = roleAbility[k][i]
                                                    return <Th>
                                                        {
                                                            abilities.length === 1 ?
                                                                "○" :
                                                                abilities
                                                                    .slice(1,abilities.length)
                                                                    .map(j=>abilityCategoryMap[j]).join(",")
                                                        }
                                                    </Th>
                                                })
                                            }
                                        </Tr>
                                    })
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box> : <></>
}

export default RoleDetailPage
