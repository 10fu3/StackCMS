import {Box, Flex} from "@chakra-ui/react";
import {Outlet} from "react-router-dom"
import SideBar from "./SideBar";
import React, {useEffect} from "react";
import store from "../store";
import {setCurrentUser} from "../store/auth";
import {setApis} from "../store/apis";
import {setUsers} from "../store/users";
import {setRoles} from "../store/roles";
import {setClients} from "../store/clients";
const Top = ()=>{
    useEffect(()=>{
        store.dispatch(setCurrentUser())
        store.dispatch(setApis())
        store.dispatch(setUsers())
        store.dispatch(setRoles())
        store.dispatch(setClients())
    },[])
    return <Box>
        <Flex h="100vh">
            <Box maxW="200px" bgColor="teal.700">
                <SideBar/>
            </Box>
            <Box minW="525px" w="calc(100% - 200px)">
                <Outlet/>
            </Box>
        </Flex>
    </Box>
}

export default Top
