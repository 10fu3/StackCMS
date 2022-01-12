import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Checkbox, Flex, Input, Menu, Select, Spacer} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getRoles} from "../../../store/roles";
import {Role} from "../../../model/model";

interface MenuOption{
    select:string[]
    isOnly:boolean
}

const RoleEditPage:React.FC = (props)=>{

    const params = useParams<"role_id">()

    const roles = useSelector(getRoles)

    const [role,setRole] = useState<Role>()

    const nav = useNavigate()

    const category = ["Content","Api","Role","User"]
    const categoryDescription:{[id:string]:string} = {
        "Content": "コンテンツ",
        "Api":"API",
        "Role":"ロール",
        "User":"ユーザー",
    }

    const detailMap :{[id:string]:string} = {
        "All":"すべて",
        "Ability":"権限",
        "User":"ユーザー",
        "Role":"同じロールのアイテムのみ",
        "Self":"自分のアイテムのみ",
        "Create":"作成",
        "Publish":"投稿",
        "Update":"編集",
        "Get":"取得",
        "Delete":"削除",
        "Name":"名前",
        "None":"なし",
    }

    const crud = ["Create","Update","Get","Delete"]

    const menu: {[id:string]:{[id:string]:MenuOption}} = {
        "Content": {
            "Create":{
                select: ["All","None"],
                isOnly: true
            },
            "Update":{
                select: [
                    "All",
                    "Role",
                    "Self",
                    "None"
                ],
                isOnly: true
            },
            "Get":{
                select: [
                    "All",
                    "Role",
                    "Self",
                    "None"
                ],
                isOnly: true
            },
            "Delete":{
                select: ["All","Role","None"],
                isOnly: true
            },
            "Publish":{
                select: [
                    "All",
                    "Role",
                    "Self",
                    "None"
                ],
                isOnly: true
            },
        },"Api": {
            "Create":{
                select: ["All","None"],
                isOnly: true
            },
            "Update":{
                select: ["All","None"],
                isOnly: true
            },
            "Get":{
                select: ["All","None"],
                isOnly: true
            },
            "Delete":{
                select: ["All","None"],
                isOnly: true
            },
        },"Role": {
            "Create":{
                select: ["All","None"],
                isOnly: true
            },
            "Update":{
                select: [
                    "Ability",
                    "User",
                    "Name"
                ],
                isOnly: false
            },
            "Get":{
                select: ["All","None"],
                isOnly: true
            },
            "Delete":{
                select: ["All","None"],
                isOnly: true
            },
        },"User": {
            "Create":{
                select: ["All","None"],
                isOnly: true
            },
            "Update":{
                select: ["All","Self","None"],
                isOnly: true
            },
            "Get":{
                select: ["All","None"],
                isOnly: true
            },
            "Delete":{
                select: ["All","None"],
                isOnly: true
            },
        }
    }

    const crudDescription:{[id:string]:string} = {
        "Create": "作成",
        "Update": "更新",
        "Get":    "取得",
        "Delete":"削除",
        "Publish":"投稿状態の変更",
    }

    useEffect(()=>{
        const r = roles.filter(i=>i.id === params.role_id)
        if(r.length === 0){
            return
        }
        setRole(r[0])
    },[params.role_id])

    return role ? <Box>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <ArrowBackIcon onClick={()=>{nav(-1)}}/>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">ロール編集 / {role.name}</chakra.p>
                </Center>
                <Spacer/>
                {
                    role?.is_lock ?
                        <></> :
                        <Flex>
                            <Box pl={2} pr={2}>
                                <Button colorScheme="green">
                                    適用
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
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"} overflow="auto">
            <Box p={5}>
                <Box bgColor="white" borderWidth="1px" borderRadius="3px" p={5}>
                    <Box bgColor="white" p={5} m={5} borderWidth="1px" borderRadius="3px" >
                        <chakra.p fontWeight="bold" fontSize="20px">ロール名</chakra.p>
                        <Box pt={5}>
                            <Input/>
                        </Box>
                    </Box>
                    {
                        category.map(c=>{
                            return <Box bgColor="white" p={5} m={5} borderWidth="1px" borderRadius="3px" >
                                <chakra.p fontWeight="bold" fontSize="20px">{categoryDescription[c]}</chakra.p>
                                {
                                    role ?
                                        <Box p={5}>
                                            {
                                                crud.map(i=>{
                                                    return <Box p={5} mt={5} borderWidth="1px">
                                                        {
                                                            <chakra.p pb={5} fontWeight="bold">{crudDescription[i]}</chakra.p>
                                                        }
                                                        {
                                                            menu[c][i].isOnly ? <Select>
                                                                {
                                                                    menu[c][i].select.map(i=>{
                                                                        return <option>{detailMap[i]}</option>
                                                                    })
                                                                }
                                                            </Select> : <Box>
                                                                {
                                                                    menu[c][i].select.map(i=>{
                                                                        return <Flex>
                                                                            <chakra.p pr={5}>{detailMap[i]}</chakra.p>
                                                                            <Checkbox></Checkbox>
                                                                        </Flex>
                                                                    })
                                                                }
                                                            </Box>
                                                            // role.abilities[c][i] ?
                                                            //     role.abilities[c][i].join(",") :
                                                            //     ""
                                                        }
                                                    </Box>
                                                })
                                            }
                                            {
                                                c === "Content" ? <Box p={5} mt={5} borderWidth="1px">
                                                    {
                                                        <chakra.p pb={5} fontWeight="bold">{crudDescription["Publish"]}</chakra.p>
                                                    }
                                                    {
                                                        <Select>
                                                            {
                                                                menu[c]["Publish"].select.map(i=>{
                                                                    return <option>{detailMap[i]}</option>
                                                                })
                                                            }
                                                        </Select>
                                                    }
                                                </Box> :<></>
                                            }
                                        </Box> : <></>
                                }
                            </Box>
                        })
                    }
                </Box>
            </Box>
        </Box>
    </Box> : <Box/>
}
export default RoleEditPage
