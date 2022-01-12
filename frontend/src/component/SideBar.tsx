import {Box, Center, chakra, Flex, HStack, IconButton, Spacer} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {AddIcon, HamburgerIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {getDisplay} from "../store/displayData";
import {useSelector} from "react-redux";
import {getProfile, setCurrentUser} from "../store/auth";
import store from "../store";
import {setApis} from "../store/apis";
import {setUsers} from "../store/users";
import {setRoles} from "../store/roles";
import useLocationChange from "./customHook/useLocationChange";

const SideBar:React.FC = ()=>{

    const index = ["api","manage"]

    const [params,setParams] = useState<string[]>([])

    const list = useSelector(getDisplay)

    const user = useSelector(getProfile)

    useLocationChange(()=>{
        setParams(window.location.pathname.split("/").filter(e=>e.length > 0))
    })

    useEffect(()=>{
        store.dispatch(setCurrentUser())
        store.dispatch(setApis())
        store.dispatch(setUsers())
        store.dispatch(setRoles())
        if(!user){
            window.location.href = "/login"
            return
        }
    },[params[0],params[1],params[2],params[3]])

    return <Box h={"100vh"}>
        <Box h={"calc(100vh - 64px)"} p={"8px 16px 8px 16px"} color={"white"} overflow="auto">
            {
                list ?
                    index.map((e)=> {
                        return list[e] ? <chakra.dl>
                            <chakra.dt pt="15px" pb="20px">
                                <Flex>
                                    <Center fontWeight="bold">
                                        <Link to={e}>
                                            {list[e].title}
                                        </Link>
                                    </Center>
                                    <Spacer/>
                                    {
                                        list[e].onAdd ? <Link to={"/api/create"}>
                                            <IconButton color="teal" aria-label="add-item" size="xs">
                                                <AddIcon/>
                                            </IconButton>
                                        </Link> : <></>
                                    }
                                </Flex>
                            </chakra.dt>
                            <chakra.dd>
                                {
                                    list[e].item.map((j,i)=>{
                                        return <chakra.ul>
                                            <chakra.li
                                                pt={"10px"}
                                                pl={"20px"}
                                                mr={"20px"}
                                                pb={"10px"}
                                                mt={"1.5px"}
                                                borderRadius="20px 0 0 20px"
                                                bgImage={(()=>{
                                                    if(params.length >= 2 && params[0] ===  e && j.id === params[1]){
                                                        return "linear-gradient(90deg,#139aa1,#285e61)"
                                                    }
                                                    return ""
                                                })()}
                                                listStyleType="none"
                                                key={e+"-"+j.id}

                                            >
                                                <Link to={e+"/"+j.id}>
                                                    <Flex>
                                                        <HStack>
                                                            <Center h={"100%"} alignItems="center">
                                                                {
                                                                    j.icon ? j.icon : <HamburgerIcon/>
                                                                }
                                                            </Center>
                                                            <chakra.p>{j.title}</chakra.p>
                                                        </HStack>
                                                    </Flex>
                                                </Link>
                                            </chakra.li>
                                        </chakra.ul>
                                    })
                                }
                            </chakra.dd>
                        </chakra.dl> : <></>
                    })
                    : <></>}
        </Box>
        <Link to={"/profile/self"}>
            <Box bgColor="#004c40" w="100%" h={"64px"}>
                <Center h={"100%"} color="white">
                    {
                        (()=>{
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const a = useSelector(getProfile)
                            return a ? <Flex>"<div style={{fontWeight:"bold"}}>{a.nick_name}</div>"としてログイン中</Flex> : <p>未ログイン</p>
                        })()
                    }
                </Center>
            </Box>
        </Link>
    </Box>
}

export default SideBar
