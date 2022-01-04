import {Link, Outlet, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CMSApi} from "../api/cms";
import {User} from "../model/model";
import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Spacer, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import store from "../store";
import {setApis} from "../store/apis";
import {setRoles} from "../store/roles";
import {useSelector} from "react-redux";
import {getUsers, setUsers} from "../store/users";
import {setContents} from "../store/contents";

const MembersList = ()=>{
    const params = useParams<"category"|"id"|"settings">()

    useEffect(()=>{
        if(!params || params.category !== "manage" || params.id !== "member"){
            return
        }else{
            store.dispatch(setApis())
            store.dispatch(setUsers())
            store.dispatch(setRoles())
            store.dispatch(setContents(String(params.id)))
        }
    },[params.id])

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <chakra.p fontWeight="bold">メンバー管理</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Button colorScheme="green">
                        追加
                    </Button>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pt={"10px"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" overflow="auto" h={"100%"}>
                <Box w="100%" p={5} bgColor="white" borderWidth="1px" borderRadius="3px" >
                <Table>
                    <Thead>
                        <Tr>
                            <Th>
                                名前
                            </Th>
                            <Th>
                                所属ロール
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            useSelector(getUsers).map((e,i)=>{
                                return <Tr>
                                    <Th>
                                        {e.nick_name}
                                    </Th>
                                    <Th>
                                        {
                                            e.roles.map(i=>{
                                                return <div>
                                                    {i.name}
                                                </div>
                                            })
                                        }
                                    </Th>
                                </Tr>
                            })
                        }
                    </Tbody>
                </Table>
                </Box>
            </Box>
        </Box>
    </Box>
}
export default MembersList
