import {Box, Center} from "@chakra-ui/layout";
import {useSelector} from "react-redux";
import {getRoles} from "../../../store/roles";
import {Button, chakra, Flex, Spacer, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {getProfile} from "../../../store/auth";
import React, {useEffect} from "react";

const RoleListPage = ()=>{
    const self = useSelector(getProfile)

    const nav = useNavigate()

    useEffect(()=>{
        if(!self){
            window.location.href = "/login"
        }
    },[])

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <chakra.p fontWeight="bold">ロール管理</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Button colorScheme="green" onClick={()=>{nav("/manage/role/create")}}>
                        追加
                    </Button>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                {
                    useSelector(getRoles).map((e,i)=>{
                        return <Box pt={3}>
                            <Link to={e.id}>
                                <Box w="100%" p={5} bgColor="white" borderWidth="1px" borderRadius="3px" >
                                    {
                                        e.name
                                    }
                                </Box>
                            </Link>
                        </Box>
                    })
                }
            </Box>
        </Box>
    </Box>
}

export default RoleListPage
