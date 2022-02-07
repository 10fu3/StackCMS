import {Box, Center} from "@chakra-ui/layout";
import {Link, useParams} from "react-router-dom";
import {Button, chakra, Flex, Spacer} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {ClientEntity} from "../../../model/model";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {CMSApi} from "../../../api/cms";
import store from "../../../store";
import {getClients, setClientById, setClients} from "../../../store/clients";
import {useSelector} from "react-redux";

const ClientDetail = ()=>{

    const params = useParams<"client_id">()

    const clients = useSelector(getClients).filter(i=>i.client_id === params.client_id)

    const client = clients.length === 0 ? undefined : clients[0]

    const permissions:{[key:string]:string} = {
        "Content.Create.All":"作成",
        "Content.Update.All":"更新",
        "Content.Get.All"   :"取得",
        "Content.Delete.All":"削除",
    }

    useEffect(()=>{
        store.dispatch(setClientById(params.client_id ? params.client_id : ""))
    },[])

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/client`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">クライアント管理 / {client?.client_name}</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Link to={`/manage/client/${client?.client_id}/edit`}>
                        <Button colorScheme="green">
                            編集
                        </Button>
                    </Link>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="20px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Box p={5} w="100%" bgColor="white" borderWidth="1px" borderRadius="3px">
                    <chakra.p fontSize={20} pl={4}>
                        クライアント情報
                    </chakra.p>
                    <Box p={3}>
                        <Flex m={2} borderWidth={1} p={3}>
                            <chakra.p fontWeight="bold" pr={2}>クライアントID</chakra.p> : {client?.client_id}
                        </Flex>
                    </Box>
                    <Box p={3}>
                        <Flex m={2} borderWidth={1} p={3}>
                            <chakra.p fontWeight="bold" pr={2}>クライアントキー</chakra.p> : {client?.client_secret}
                        </Flex>
                        <chakra.p color="#888" pl={3} fontWeight="bold" pr={2}>※各APIにアクセスする際, HTTP Headerのキーに X-STACKCMS-API-KEY, 値に 上記クライアントキーを指定して使用します</chakra.p>
                        <chakra.p color={"#ff0000"} pl={3} fontWeight="bold" pr={2}>このキーは外部に漏洩しないようにしてください (ソースコードにハードコーディングするのはやめてください)</chakra.p>
                    </Box>
                    <Box p={3}>
                        <Flex m={2} borderWidth={1} p={3}>
                            <chakra.p fontWeight="bold" pr={2}>クライアント名</chakra.p> : {client?.client_name}
                        </Flex>
                    </Box>
                    <Box p={3}>
                        <Box m={2} borderWidth={1} p={3}>
                            <chakra.p fontWeight="bold" pt={1} pb={1} pr={2}>全API/コンテンツに対する権限 :</chakra.p>
                            <Box>
                                <chakra.ul p={5}>
                                    {
                                        (client?.client_ability ? client?.client_ability : []).map(i=>{
                                            return <chakra.li>
                                                {
                                                    permissions[i]
                                                }
                                            </chakra.li>
                                        })
                                    }
                                    {
                                        (client?.client_ability ? client?.client_ability : [])?.length === 0 ? <chakra.li>
                                            なし
                                        </chakra.li> : <></>
                                    }
                                </chakra.ul>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>
}

export default ClientDetail