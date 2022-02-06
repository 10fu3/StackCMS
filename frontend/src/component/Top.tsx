import {Box, Flex} from "@chakra-ui/react";
import {Outlet} from "react-router-dom"
import SideBar from "./SideBar";
import React, {useEffect} from "react";
import store from "../store";
import {setCurrentUser} from "../store/auth";
import {setApis} from "../store/apis";
import {setUsers} from "../store/users";
import {setRoles} from "../store/roles";
const Top = ()=>{
    useEffect(()=>{
        store.dispatch(setCurrentUser())
        store.dispatch(setApis())
        store.dispatch(setUsers())
        store.dispatch(setRoles())
    },[])
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
