import {Box, Flex} from "@chakra-ui/react";
import {Outlet, useParams} from "react-router-dom"
import SideBar from "./SideBar";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {setApis} from "../store/apis";
import {setRoles} from "../store/roles";
import store from "../store";
import {setUsers} from "../store/users";
import {getDisplay} from "../store/displayData";
import {setCurrentUser} from "../store/auth";
const Top = ()=>{

    const params = useParams<"category"|"id">()

    return <Box>
        <Flex h="100vh">
            <Box minW="260px" bgColor="teal.700">
                <SideBar list={useSelector(getDisplay)}/>
            </Box>
            <Box w="calc(100% - 260px)">
                <Outlet/>
            </Box>
        </Flex>
    </Box>
}

export default Top
