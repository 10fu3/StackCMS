import {Box, Center} from "@chakra-ui/layout";
import {chakra, Flex} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React from "react";

const ProfileUpdatePage = ()=>{
    return <Box w={"100%"} h={"100%"} bgColor={"#f7faff"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/member`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">プロフィール / 編集</chakra.p>
                </Center>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Center h={"calc(100% - 65px)"}>
            <Box p={5} w="500px" bgColor="white" borderWidth="1px" borderRadius="3px">
                <chakra.p fontSize={20} pl={4}>
                    プロフィール
                </chakra.p>
                <Box p={3}>
                    <Flex m={2} borderWidth={1} p={2}>
                        <chakra.p fontWeight="bold">名前</chakra.p> :
                    </Flex>
                    <Flex m={2} borderWidth={1} p={2}>
                        <chakra.p fontWeight="bold">内部ユーザーID</chakra.p> :
                    </Flex>
                    <Flex m={2} borderWidth={1} p={2}>
                        <chakra.p fontWeight="bold">メールアドレス</chakra.p> :
                    </Flex>
                    <Box m={2} borderWidth={1} p={2}>
                        <chakra.p fontWeight="bold">所属ロール:</chakra.p>
                        <chakra.ul p={5}>
                            {

                            }
                        </chakra.ul>
                    </Box>
                </Box>
            </Box>
        </Center>
    </Box>
}

export default ProfileUpdatePage
