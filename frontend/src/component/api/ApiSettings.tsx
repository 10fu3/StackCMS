import {Box, Center, Text} from "@chakra-ui/layout";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import React from "react";
import {Button, chakra, Flex, Spacer} from "@chakra-ui/react";

const ApiSettings = ()=>{
    const params = useParams<"category"|"id"|"settings"|"option">()

    if(!(params && params.category && params.id && params.settings)){
        return <Box></Box>
    }

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <chakra.p fontWeight="bold">{params.id}</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Button onClick={()=>{window.history.back()}}>
                        コンテンツ一覧
                    </Button>
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
            <Outlet/>
        </Box>
    </Box>
}

export default ApiSettings
