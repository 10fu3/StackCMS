import {Box, Flex} from "@chakra-ui/react";
import {Outlet} from "react-router-dom"
import SideBar from "./SideBar";
import React from "react";
const Top = ()=>{

    return <Box>
        <Flex h="100vh">
            <Box minW="260px" bgColor="teal.700">
                <SideBar/>
            </Box>
            <Box w="calc(100% - 260px)">
                <Outlet/>
            </Box>
        </Flex>
    </Box>
}

export default Top
