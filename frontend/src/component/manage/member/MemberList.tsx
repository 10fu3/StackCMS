import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {CSSProperties, useEffect} from "react";
import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Spacer} from "@chakra-ui/react";
import store from "../../../store";
import {setApis} from "../../../store/apis";
import {setRoles} from "../../../store/roles";
import {useSelector} from "react-redux";
import {getUsers, setUsers} from "../../../store/users";
import {setContents} from "../../../store/contents";
import {getProfile, setCurrentUser} from "../../../store/auth";

const MembersList = ()=>{
    //const params = useParams<"category"|"id"|"settings">()

    const unionCellCss:CSSProperties = {
        padding:20,
        overflow:"hidden",
        borderTop:"1px solid #e7e7e7",
        borderBottom:"1px solid #e7e7e7",
    }

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
                    <chakra.p fontWeight="bold">メンバー管理</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Link to={"/manage/member/create"}>
                        <Button colorScheme="green">
                            追加
                        </Button>
                    </Link>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pt={"10px"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Box w="100%">
                    <table style={{width:"100%"}}>
                        <thead style={{width:"100%",color:"#888"}}>
                            <tr>
                                <th style={{width:"50%",padding:10}}>
                                    名前
                                </th>
                                <th style={{width:"50%",padding:10}}>
                                    所属ロール
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 10px"}}>
                        <tbody>
                        {
                            useSelector(getUsers).map((e,i)=>{
                                return <tr onClick={()=>{nav("/profile/"+e.user_id)}} style={{width:"100%",backgroundColor:"white",cursor:"pointer"}}>
                                    <th style={{
                                        ...unionCellCss,
                                        borderRadius:"5px 0 0 5px",
                                        borderLeft:"1px solid #e7e7e7",
                                        fontWeight:"normal"
                                    }}>
                                        {e.nick_name}
                                    </th>
                                    <th style={{width:"50%",
                                        ...unionCellCss,
                                        borderRight:"1px solid #e7e7e7",
                                        borderRadius:"0px 5px 5px 0px",
                                        fontWeight:"normal"
                                    }}>
                                        {
                                            e.roles.map(i=>{
                                                return <div>
                                                    {i.name}
                                                </div>
                                            })
                                        }
                                    </th>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    </Box>
}
export default MembersList
