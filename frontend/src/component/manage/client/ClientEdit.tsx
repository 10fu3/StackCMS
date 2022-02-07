import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Checkbox, Flex, Input, Spacer} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {getClients, setClientById} from "../../../store/clients";
import {CMSApi} from "../../../api/cms";
import store from "../../../store";
import Alert from "../../customHook/alert";

const ClientEdit = ()=>{

    const params = useParams<"client_id">()

    const clients = useSelector(getClients).filter(i=>i.client_id === params.client_id)

    const client = clients.length === 0 ? undefined : clients[0]

    const [name,setName] = useState(client?.client_name ? client?.client_name : "")

    const permissions:{[key:string]:string} = {
        "Create":"作成",
        "Update":"更新",
        "Get":   "取得",
        "Delete":"削除",
    }

    const [permission,setPermission] = useState<{[key:string]:boolean}>((()=>{
        return client ? (()=>{
            let crud : {[key:string]:boolean} = {}
            for (const c of (client.client_ability ? client.client_ability : [])) {
                crud[c.split(".")[1]] = true
            }
            return crud
        })() : {
            Create: false,
            Update: false,
            Get:    false,
            Delete: false,
        }
    })())

    const handleUpdatePermission = ()=>{
        const t = (s:string)=>{
            return `Content.${s}.All`
        }
        (async ()=>{
            let p = Object.keys(permission).filter(i=>permission[i]).map(i=>t(i))
            setApplyResult(await CMSApi.Clients.update.ability(params.client_id ? params.client_id : "",p))
        })()
    }

    const handleUpdateName = ()=>{
        (async ()=>{
            setApplyResult(await CMSApi.Clients.update.name(params.client_id ? params.client_id : "" , name))
            store.dispatch(setClientById(params.client_id ? params.client_id : ""))
        })()
    }

    const handleUpdateSecret = ()=>{
        (async ()=>{
            setApplyResult(await CMSApi.Clients.update.secret(params.client_id ? params.client_id : ""))
            store.dispatch(setClientById(params.client_id ? params.client_id : ""))
        })()
    }

    const [applyResult,setApplyResult] = useState<boolean>()

    return <Box w={"100%"} h={"100vh"}>
        <Alert title={applyResult ? "成功" : "失敗"}
               body={`変更の適用に${applyResult ? "成功" : "失敗"}しました`}
               isOpen={applyResult !== undefined}
               onOkClick={()=>{
                   setApplyResult(undefined)
               }}
               onClose={()=>{
                   setApplyResult(undefined)
               }}/>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/client/${client?.client_id}`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">クライアント管理 / {client?.client_name} / 編集</chakra.p>
                </Center>
                <Spacer/>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pt={"10px"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Center h="100%">
                    <Box p={5} w="100%" bgColor="white" borderWidth="1px" borderRadius="3px">
                        <chakra.p fontSize={20} pl={4}>
                            クライアント情報
                        </chakra.p>
                        <Box p={3}>
                            <Flex m={2} borderWidth={1} p={3}>
                                <Center>
                                    <Flex>
                                        <chakra.p fontWeight="bold" pr={2}>クライアントキー</chakra.p> : {client?.client_secret}
                                    </Flex>
                                </Center>
                                <Spacer/>
                                <Button onClick={handleUpdateSecret}>
                                    更新する
                                </Button>
                            </Flex>
                            <Box m={2} borderWidth={1} p={3}>
                                <chakra.p fontWeight="bold" pr={2}>クライアント名 (現在): {client?.client_name}</chakra.p>
                                <Flex pt={3}>
                                    <Box w={"calc(100% - 93px)"} pr={3}>
                                        <Input value={name} onChange={(e)=>{setName(e.target.value)}}/>
                                    </Box>
                                    <Button onClick={handleUpdateName}>
                                        更新する
                                    </Button>
                                </Flex>
                            </Box>
                            <Box m={2} borderWidth={1} p={3}>
                                <chakra.p fontWeight="bold" pt={1} pb={1} pr={2}>全API/コンテンツに対する権限 :</chakra.p>
                                <Flex>
                                    <chakra.ul listStyleType="none">
                                        {
                                            Object
                                                .keys(permissions)
                                                .map(i=>{
                                                    return <chakra.li pt={2}>
                                                        <Flex>
                                                            <Checkbox isChecked={permission[i]} onChange={()=>{
                                                                let changed :{[id:string]:boolean} = {}
                                                                changed[i] = !permission[i]
                                                                console.log(changed)
                                                                setPermission(Object.assign({...permission},changed))
                                                            }} pr={2}/>
                                                            <Box>
                                                                {
                                                                    permissions[i]
                                                                }
                                                            </Box>
                                                        </Flex>
                                                    </chakra.li>
                                                })
                                        }
                                    </chakra.ul>
                                    <Spacer/>
                                    <Center>
                                        <Button onClick={handleUpdatePermission}>
                                            更新する
                                        </Button>
                                    </Center>
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                </Center>
            </Box>
        </Box>
    </Box>
}

export default ClientEdit