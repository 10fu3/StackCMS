import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Spacer, VStack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getProfile} from "../store/auth";
import {Link, useNavigate, useParams} from "react-router-dom";
import {User} from "../model/model";
import {getUsers} from "../store/users";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {logout} from "../api/auth";
import {CMSApi} from "../api/cms";

const ProfilePage = ()=>{

    const nav = useNavigate()

    const params = useParams<"id">()

    const [user,setUser] = useState<User|null>();

    let profile = useSelector(getProfile)

    useEffect(()=>{
        (async ()=>{
            const r = (await CMSApi.User.getAll())
            if(!r){
                window.location.href = "/login"
                return
            }
            const filterUsers = r.filter(u=>u.user_id === params.id);
            if(filterUsers.length !== 1){
                setUser(profile)
                return
            }
            setUser(filterUsers[0])
        })()
    },[])

    return <Box w={"100%"} h={"100vh"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/member`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">プロフィール</chakra.p>
                </Center>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <VStack pt={"20px"} w={"100%"}>
                    <Box p={5} maxW="500px" w="100%" bgColor="white" borderWidth="1px" borderRadius="3px">
                        <chakra.p fontSize={20} pl={4}>
                            プロフィール
                        </chakra.p>
                        <Box p={3}>
                            <Flex m={2} borderWidth={1} p={2}>
                                <chakra.p fontWeight="bold">ニックネーム</chakra.p> : {user?.nick_name}
                            </Flex>
                            <Flex m={2} borderWidth={1} p={2}>
                                <chakra.p fontWeight="bold">内部ユーザーID</chakra.p> : {user?.user_id}
                            </Flex>
                            <Flex m={2} borderWidth={1} p={2}>
                                <chakra.p fontWeight="bold">メールアドレス</chakra.p> : {user?.mail}
                            </Flex>
                            <Flex m={2} borderWidth={1} p={2}>
                                <chakra.p fontWeight="bold">変更可能</chakra.p> : {!user?.is_lock ? "はい" : "いいえ"}
                            </Flex>
                            <Box m={2} borderWidth={1} p={2}>
                                <chakra.p fontWeight="bold">所属ロール:</chakra.p>
                                <chakra.ul p={5}>
                                    {
                                        user?.roles.map(i=>{
                                            return <Link to={'/manage/role/'+i.id}>
                                                <chakra.li textDecoration="underline" p={1}>
                                                    {
                                                        i.name
                                                    }
                                                </chakra.li>
                                            </Link>
                                        })
                                    }
                                </chakra.ul>
                            </Box>
                            <Box pl={2} pr={2}>
                                <Link to={"edit"}>
                                    <Center pt={5}>
                                        <Button w={"full"} onClick={()=>{

                                        }} colorScheme="green">
                                            編集
                                        </Button>
                                    </Center>
                                </Link>
                                <Center pt={5}>
                                    <Button w={"full"} onClick={()=>{
                                        (async ()=>{
                                            if(await CMSApi.User.delete(user?.user_id ? user?.user_id : "")){
                                                nav(-1)
                                            }
                                        })()}
                                    } colorScheme="red">
                                        削除する
                                    </Button>
                                </Center>
                                {
                                    profile?.user_id === params.id || params.id === "self" ? <Center pt={5}>
                                        <Button w={"full"} onClick={()=>{
                                            (async ()=>{
                                                if(await logout()){
                                                    nav("/login")
                                                }
                                            })()}
                                        } colorScheme="red">
                                            ログアウト
                                        </Button>
                                    </Center> : <></>
                                }
                            </Box>
                        </Box>
                    </Box>
                </VStack>
            </Box>
        </Box>
    </Box>
}

export default ProfilePage
