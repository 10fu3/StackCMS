import React, {useEffect, useRef, useState} from "react";
import {getRoles} from "../../../store/roles";
import {useSelector} from "react-redux";
import {Box, Center} from "@chakra-ui/layout";
import {
    Button,
    chakra,
    Flex,
    Spacer,
    Table,
    Tbody,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {Role} from "../../../model/model";
import {CMSApi} from "../../../api/cms";
import Alert from "../../customHook/alert";



const RoleDetailPage = ()=>{

    const params = useParams<"role_id">()

    const roles = useSelector(getRoles)

    const [role,setRole] = useState<Role>()

    const [roleName,setRoleName] = useState("")

    const [roleAbility,setRoleAbility] = useState<{[id:string]:{[id:string]:string[]}}>({})

    const nav = useNavigate()

    const [isFailed,setFailed] = useState<boolean|undefined>()
    const onCompleteClose = () => {
        setFailed(undefined)
        nav(-1)
    }

    const abilityCategory = ["Create","Update","Get","Delete","Publish"]

    const crudMap:{[id:string]:string} = {
        "Create":"作成",
        "Update":"更新",
        "Get":"取得",
        "Delete":"削除",
        "Publish":"公開状態の変更"
    }

    const detailMap :{[id:string]:string} = {
        "All":"すべて",
        "Ability":"権限",
        "User":"ユーザー",
        "Role":"ロール",
        "Self":"自分",
        "Create":"作成",
        "Publish":"投稿",
        "Update":"編集",
        "Get":"取得",
        "Delete":"削除",
        "Name":"名前",
    }

    const abilityCategoryMap:{[id:string]:string} = {
        "Api":"API",
        "Content":"コンテンツ",
        "Self":"自分",
        "User":"ユーザー",
        "Role":"ロール",
    }

    useEffect(()=>{

        const r = roles.filter(i=>i.id === params.role_id)[0]

        setRole(r)

        setRoleName(r && r.name ? r.name : "")

        console.log(r.abilities)

        setRoleAbility(r.abilities)

    },[params.role_id])

    const handleDelete = ()=>{
        (async ()=>{
            const result = await CMSApi.deleteRole(role?.id ? role.id : "")
            setFailed(!result)
        })()
    }

    return role ? <Box w={"100%"} h={"100vh"}>
        <Alert
            title={isFailed ? "エラー" : "完了"}
            body={isFailed ? "操作が完了できませんでした" : "操作が完了しました"}
            isOpen={isFailed !== undefined}
            onOkClick={onCompleteClose}
            onClose={onCompleteClose}/>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/role`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">ロール管理 / {roleName}</chakra.p>
                </Center>
                <Spacer/>
                {
                    role.is_lock ?
                        <></> :
                        <Flex>
                            <Box pl={2} pr={2}>
                                <Link to={"edit"}>
                                    <Button colorScheme="green">
                                        変更
                                    </Button>
                                </Link>
                            </Box>
                            <Box pl={2} pr={2}>
                                <Button colorScheme="red" onClick={handleDelete}>
                                    削除
                                </Button>
                            </Box>
                        </Flex>
                }
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Box bgColor="white" p={5} borderWidth="1px" borderRadius="3px" >
                    <Box>
                        <Flex pt={5}>
                            ロール名:<chakra.p pl={2} fontWeight="bold">{roleName}</chakra.p>
                            {/*<Input value={roleName} onChange={(e)=>{setRoleName(e.target.value)}}/>*/}
                        </Flex>
                    </Box>
                    <Box pt={5}>
                        <Table borderWidth="1px">
                            <Thead>
                                <Tr>
                                    <Th/>
                                    {
                                        abilityCategory.map(i=>{
                                            return <Th fontSize="15px" borderLeftWidth="1px">{crudMap[i]}</Th>
                                        })
                                    }
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    Object.keys(roleAbility).map(k=>{
                                        return <Tr>
                                            <Th fontSize="15px" borderRightWidth="1px">{abilityCategoryMap[k]}</Th>
                                            {
                                                abilityCategory.map(i=>{
                                                    const abilities = roleAbility[k][i]
                                                    return <Th borderLeftWidth="1px">
                                                        {
                                                            abilities ? abilities.filter(j=>j.includes("All")).length === 1 ?
                                                                    "全権限" :
                                                                    abilities.length === 0 ?
                                                                        "権限なし":
                                                                    abilities.length === 1 && abilities[0].split(".")[2] === "Role" ?
                                                                         "同じロールのみ" :
                                                                    abilities.length === 1 ?
                                                                         "○" :
                                                                    abilities
                                                                        .slice(0,abilities.length)
                                                            .map(j=>detailMap[j.split(".")[2]]).join(",") : <></>
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
