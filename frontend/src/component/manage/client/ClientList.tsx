import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Spacer} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {CSSProperties, useEffect} from "react";
import store from "../../../store";
import {getClients, setClients} from "../../../store/clients";
import {useSelector} from "react-redux";
import {getUsers} from "../../../store/users";

const ClientList = ()=>{

    useEffect(()=>{
        store.dispatch(setClients())
    },[])

    const unionCellCss:CSSProperties = {
        padding:20,
        overflow:"hidden",
        borderTop:"1px solid #e7e7e7",
        borderBottom:"1px solid #e7e7e7",
    }

    const nav = useNavigate()

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <chakra.p fontWeight="bold">クライアント管理</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Link to={"/manage/client/create"}>
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
                        </tr>
                        </thead>
                    </table>
                    <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 10px"}}>
                        <tbody>
                        {
                            useSelector(getClients).map((e,i)=>{
                                return <tr onClick={()=>{nav("/manage/client/"+e.client_id)}} style={{width:"100%",backgroundColor:"white",cursor:"pointer"}}>
                                    <th style={{
                                        ...unionCellCss,
                                        borderRadius:"5px 0 0 5px",
                                        borderLeft:"1px solid #e7e7e7",
                                        fontWeight:"normal"
                                    }}>
                                        {e.client_name}
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

export default ClientList