import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Checkbox, Flex, Input, Menu, Select, Spacer} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getRoles, setRoles} from "../../../store/roles";
import {Role} from "../../../model/model";
import {CMSApi} from "../../../api/cms";
import Alert from "../../customHook/alert";
import store from "../../../store";
import {setCurrentUser} from "../../../store/auth";
import {setApis} from "../../../store/apis";
import {setUsers} from "../../../store/users";

interface MenuOption{
    menuContent:string[]
    isOnly:boolean
    selected: string[]
}

const RoleEditPage:React.FC = (props)=>{

    const params = useParams<"role_id">()

    const roles = useSelector(getRoles)

    const [role,setRole] = useState<Role>()

    const [sendPerms,setSendPerms] = useState<string[]>([])

    const [sendName,setSendName] = useState('')

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

    const [menu,setMenu] = useState<{[id:string]:{[id:string]:MenuOption}}>({})

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
        setSendName(r[0].name)

        let init:{[id:string]:{[id:string]:MenuOption}} = {
            "Content": {
                "Create":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Update":{
                    menuContent: [
                        "All",
                        "Role",
                        "Self",
                        "None"
                    ],
                    isOnly: true,
                    selected: ["None"],
                },
                "Get":{
                    menuContent: [
                        "All",
                        "Role",
                        "Self",
                        "None"
                    ],
                    isOnly: true,
                    selected: ["None"],
                },
                "Delete":{
                    menuContent: ["All","Role","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Publish":{
                    menuContent: [
                        "All",
                        "Role",
                        "Self",
                        "None"
                    ],
                    isOnly: true,
                    selected: ["None"],
                },
            },"Api": {
                "Create":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Update":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Get":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Delete":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
            },"Role": {
                "Create":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Update":{
                    menuContent: [
                        "Ability",
                        "User",
                        "Name"
                    ],
                    isOnly: false,
                    selected: [],
                },
                "Get":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Delete":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
            },"User": {
                "Create":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Update":{
                    menuContent: ["All","Self","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Get":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
                "Delete":{
                    menuContent: ["All","None"],
                    isOnly: true,
                    selected: ["None"],
                },
            }
        }

        for (const category of Object.keys(r[0].abilities)) {
            for(const curd of Object.keys(r[0].abilities[category])){
                for(const v of r[0].abilities[category][curd]){
                    init[category][curd].selected = [v.split(".")[2]];
                }
            }
        }
        console.log(init)
        setMenu(init)
    },[params.role_id])

    const onChange = (category:string,crud:string,value:string)=>{
        if(!role || !menu[category] || !menu[category][crud]){
            return
        }
        let changedParent:{[id:string]:{[id:string]:MenuOption}} = Object.assign(menu)
        let changedParentSecond:{[id:string]:MenuOption} = Object.assign(menu[category])
        let changed:MenuOption = Object.assign(menu[category][crud])
        if(menu[category][crud].isOnly){
            changed.selected = [value]
            changedParentSecond[crud] = changed
            changedParent[category] = changedParentSecond
            setMenu({...changedParent})
            return;
        }
        if(menu[category][crud].selected.includes(value)){
            changed.selected = changed.selected.filter(i=>i !== value)
        }else{
            changed.selected = [...changed.selected,value]
        }
        changedParentSecond[crud] = changed
        changedParent[category] = changedParentSecond
        setMenu({...changedParent})
    }

    const [applyResult,setApplyResult] = useState<boolean>()

    useEffect(()=>{
        let r = []
        for (const category of Object.keys(menu)) {
            for(const curd of Object.keys(menu[category])){
                r.push(...menu[category][curd].selected.filter(i=>(i !== "None") && (i !== "")).map(i=>`${category}.${curd}.${i}`))
            }
        }
        console.log(menu)
        setSendPerms(r)
    },[menu])

    const onApply = ()=>{
        (async ()=>{
            if(!role){
                return
            }
            setApplyResult(await CMSApi.updateRole(role.id,sendName,sendPerms))
            store.dispatch(setRoles())
        })()
    }

    return role ? <Box>

        <Alert title={applyResult ? "成功" : "失敗"}
               body={`変更の適用に${applyResult ? "成功" : "失敗"}しました`}
               isOpen={applyResult !== undefined}
               onOkClick={()=>{nav(-1)}}
               onClose={()=>{nav(-1)}}/>

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
                                <Button onClick={onApply} colorScheme="green">
                                    適用
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
                            <Input value={sendName} onChange={(e)=>{setSendName(e.target.value)}}/>
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
                                                            menu[c][i].isOnly ? <Select onChange={e=>onChange(c,i,e.target.value)} value={menu[c][i].selected[0]}>
                                                                {
                                                                    menu[c][i].menuContent.map(i=>{
                                                                        return <option value={i}>{detailMap[i]}</option>
                                                                    })
                                                                }
                                                            </Select> : <Box>
                                                                {
                                                                    menu[c][i].menuContent.map((j,index)=>{
                                                                        return <Flex>
                                                                            <chakra.p pr={5}>{detailMap[j]}</chakra.p>
                                                                            <Checkbox onChange={e=>{
                                                                                onChange(c,i,j)
                                                                            }} isChecked={menu[c][i].selected.includes(j)}/>
                                                                        </Flex>
                                                                    })
                                                                }
                                                            </Box>
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
                                                        <Select onChange={e=>onChange(c,"Publish",e.target.value)} value={menu["Content"]["Publish"].selected[0]}>
                                                            {
                                                                menu["Content"]["Publish"].menuContent.map(i=>{
                                                                    return <option value={i}>{detailMap[i]}</option>
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
