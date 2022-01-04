import {Box, Center, chakra, Flex, HStack, IconButton, Spacer} from "@chakra-ui/react";
import {Link, useParams} from "react-router-dom";
import {AddIcon, HamburgerIcon} from "@chakra-ui/icons";
import React from "react";
import {ListItem} from "../store/displayData";
import {useSelector} from "react-redux";
import {getProfile} from "../store/auth";

const SideBar:React.FC<{list:{[id:string]:ListItem}}> = (props)=>{

    const index = ["api","manage"]

    const params = useParams<"category"|"id">()

    return <Box h={"100vh"}>
        <Box h={"calc(100vh - 64px)"} p={"8px 16px 8px 16px"} color={"white"} overflow="auto">
            {
                props.list ?
                    index.map((e)=> {
                        return props.list[e] ? <chakra.dl>
                            <chakra.dt pt="15px" pb="20px">
                                <Flex>
                                    <Center>
                                        <Link to={e}>
                                            {props.list[e].title}
                                        </Link>
                                    </Center>
                                    <Spacer/>
                                    <IconButton color="teal" aria-label="add-item" size="xs">
                                        <AddIcon/>
                                    </IconButton>
                                </Flex>
                            </chakra.dt>
                            <chakra.dd>
                                {
                                    props.list[e].item.map((j,i)=>{
                                        return <chakra.ul>
                                            <chakra.li
                                                pt={"10px"}
                                                pl={"20px"}
                                                mr={"20px"}
                                                pb={"10px"}
                                                mt={"1.5px"}
                                                borderRadius="20px 0 0 20px"
                                                bgImage={(()=>{
                                                    if(params && params.id && params.category && e === params.category && j.id === params.id){
                                                        return "linear-gradient(90deg,#0EA9B0,#2c7a7b)"
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
        <Box bgColor="#004c40" w="100%" h={"64px"}>
            <Center h={"100%"} color="white">
                {
                    (()=>{
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const a = useSelector(getProfile)
                        return a ? <p>"{a.nick_name}"としてログイン中</p> : <p>未ログイン</p>
                    })()
                }
            </Center>
        </Box>
    </Box>
}

export default SideBar
