import {Box, Center} from "@chakra-ui/layout";
import {Link, Outlet, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, chakra, Divider, Flex, Spacer} from "@chakra-ui/react";
import useLocationChange from "../customHook/useLocationChange";

interface SettingListItem {
    name:string,
    linkTo:string|undefined,
}

interface SettingListCategory{
    name:string,
    item:SettingListItem[]
}

const ApiSettings = ()=>{

    const split = window.location.pathname.split("/").filter(i=>i !== "")

    const[api_id,setApiId] = useState('')
    const[option,setOption] = useState('')

    useLocationChange(()=>{
        const [,_api_id,,_option] = split
        setApiId(_api_id)
        setOption(_option)
    })

    const items:SettingListCategory[] = [
        {
            name: "API設定",
            item: [
                {
                    name: "基本設定",
                    linkTo: undefined
                },{
                    name: "APIスキーマ",
                    linkTo: "schema"
                },{
                    name: "画面プレビュー",
                    linkTo: "preview"
                },{
                    name: "Webhook",
                    linkTo: "webhook"
                }
            ],
        },{
            name: "その他",
            item: [
                {
                    name: "削除",
                    linkTo: "delete"
                }
            ],
        }
    ]

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <chakra.p fontWeight="bold">{api_id}</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Link to={"/api/"+api_id}>
                        <Button>
                            コンテンツ一覧
                        </Button>
                    </Link>
                </Box>
                <Box pl={2} pr={2}>
                    <Button colorScheme="green">
                        追加
                    </Button>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pr={2}>
            <Box h={"100%"}>
                <Flex h="100%">
                    <Box p={5} minW="260px" bgColor={"#f8fdfb"} h={"calc(100vh - 65px)"} overflow="auto">
                        {
                            items.map(i=>{
                                return <Box>
                                    <chakra.p pt={5} pb={5} fontWeight="bold">{i.name}</chakra.p>
                                    <Divider/>
                                    <Box pt={3} pl={3}>
                                        {
                                            i.item.map(j=>{
                                                return <Link to={`/api/${api_id}/settings/${j.linkTo ? j.linkTo : ""}`}>
                                                    <Box pt={2} pb={2}>
                                                        <chakra.p p={2}
                                                            borderRadius={3}
                                                            backgroundColor={
                                                                option === j.linkTo
                                                                ? "#a8d9dd" : ""}
                                                            color={option === j.linkTo
                                                                ? "#004c40" : ""}
                                                            fontWeight={option === j.linkTo
                                                                ? "bold" : ""}
                                                        >{""+j.name}</chakra.p>
                                                    </Box>
                                                </Link>
                                            })
                                        }
                                    </Box>
                                </Box>
                            })
                        }
                    </Box>
                    <Divider bgColor={"#f8fdfb"} h="calc(100vh - 65px)" w="4px" orientation='vertical' />
                    <Box bgColor={"#f8fdfb"} pt={10} pr={3} pl={5} pb={10} w="100%" h={"calc(100vh - 65px)"} overflow="auto">
                        <Outlet/>
                    </Box>
                </Flex>
            </Box>
        </Box>
    </Box>
}

export default ApiSettings
