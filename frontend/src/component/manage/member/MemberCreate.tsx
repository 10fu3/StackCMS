import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Input, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {CMSApi} from "../../../api/cms";
import Alert from "../../customHook/alert";
import {useNavigate} from "react-router-dom";

const MemberCreate = ()=>{

    const [mail,setMail] = useState('')
    const [name,setName] = useState('')

    const [result,setResult] = useState<boolean>()

    const nav = useNavigate()

    const handleCreate = ()=>{
        (async ()=>{
            setResult(await CMSApi.createUser(mail,name))
        })()
    }

    const handleBack = ()=>{
        nav(-1)
    }


    return <Box h={"100%"}>
        <Alert title={result ? "成功" : "失敗"} body={result ? "ユーザーの作成に成功しました" : "ユーザーの作成に失敗しました"} isOpen={result !== undefined} onOkClick={handleBack} onClose={handleBack}/>
        <Center overflow="auto" pl={5} pr={5} w={"100%"} h={"100%"} bgColor={"#f0f9ff"}>
            <Stack maxW="800px" minW={"300px"} w={"100%"}>
                <Center w="100%" p={30}>
                    <chakra.p fontSize="30px">新規ユーザーの基本情報を入力</chakra.p>
                </Center>
                <Box p="60px" boxShadow="0 0 20px rgba(0,0,0,.1)" bgColor="white" w={"100%"}>
                    <Box>
                        <chakra.p fontWeight="bold">
                            メールアドレス
                        </chakra.p>
                        <Box pt={5}>
                            <Input  value={mail} onChange={(e)=>{
                                setMail(e.target.value)
                            }}/>
                        </Box>
                    </Box>
                    <Box pt={5}>
                        <chakra.p fontWeight="bold">
                            ニックネーム
                        </chakra.p>
                        <Box pt={5}>
                            <Input  value={name} onChange={(e)=>{
                                setName(e.target.value)
                            }}/>
                        </Box>
                    </Box>
                </Box>
                <Center w="100%" p={30}>
                    <Button onClick={handleCreate} colorScheme="green" isDisabled={mail.length <= 0 || name.length <= 0}>
                        ユーザーを作成
                    </Button>
                </Center>
            </Stack>
        </Center>
    </Box>
}

export default MemberCreate
