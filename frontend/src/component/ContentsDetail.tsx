import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Spacer, Table} from "@chakra-ui/react";
import {
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'
import {Link, Outlet, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import MembersList from "./MemberDetail";
import store from "../store";
import {getApis, setApis} from "../store/apis";
import {setUsers} from "../store/users";
import {setRoles} from "../store/roles";
import {getContents, setContents} from "../store/contents";
import {useSelector} from "react-redux";
import {getFields} from "../store/fields";
import RolePage from "./manage/RolePage";

const ContentsDetail = ()=>{

    const params = useParams<"category"|"id"|"settings">()

    useEffect(()=>{
        if(!params || params.category !== "api" || !params.id){
            return
        }else{
            store.dispatch(setApis())
            store.dispatch(setUsers())
            store.dispatch(setRoles())
            store.dispatch(setContents(params.id))
        }
    },[params.id])

    const fields = useSelector(getFields)
    const contents:{[key:string]:any}[] = useSelector(getContents)

    if(params.category === "manage"){
        if(params.id === "member"){
            return <MembersList/>
        }else if(params.id === "roles"){
            return <RolePage/>
        }
    }else if(params.category === "api" && params.id){
        return <Box w={"100%"} h={"100vh"}>
            <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
                <Flex w={"100%"}>
                    <Center>
                        <chakra.p fontWeight="bold">{params.id}</chakra.p>
                    </Center>
                    <Spacer/>
                    <Box pl={2} pr={2}>
                        <Link to={"settings"}>
                            <Button>
                                API設定
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
            <Box w={"100%"} pt={"10px"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
                <Box w="100%" pt="10px" pb="20px" overflow="auto" h={"100%"}>
                    <Box p="3px">
                        <Box w="100%" p={5} bgColor="white" borderWidth="1px" borderRadius="3px" >
                            <Table>
                                <Thead>
                                    <Tr>
                                        {
                                            fields[String(params.id)].map((e)=>{
                                                return <Th>
                                                    {
                                                        e.field_name
                                                    }
                                                </Th>
                                            })
                                        }
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        contents ? contents.map((e,j)=>{
                                            return <Tr>
                                                {
                                                    fields[params.id !== undefined ? params.id : ""].map((i)=>{
                                                        return <Th>
                                                            {
                                                                (typeof e[i.field_name]) === "object" ? `参照: ${i.relation_api}` : e[i.field_name]
                                                            }
                                                        </Th>
                                                    })
                                                }
                                            </Tr>
                                        }) : <></>
                                    }
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    }
    return <></>
}
export default ContentsDetail
