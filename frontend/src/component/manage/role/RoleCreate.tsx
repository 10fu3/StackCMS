import {Box, Center} from "@chakra-ui/layout";
import React, {useRef, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    chakra,
    Flex,
    Input,
    Spacer,
    Stack
} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {TextEditor} from "../../content/ContentEditorComponent";
import {CMSApi} from "../../../api/cms";

const RoleCreatePage:React.FC<{}> = (props)=>{

    const nav = useNavigate()

    const [name,setName] = useState('')

    const handleCreate = ()=>{
        if(name.length <= 0){
            return
        }
        (async ()=>{
            setFailed(!(await CMSApi.createRole(name)))
        })()
    }

    const [isFailed,setFailed] = useState<boolean|undefined>()
    const onCompleteClose = () => {
        setFailed(undefined)
        nav(-1)
    }
    const cancelRef = useRef<HTMLButtonElement>(null)

    return <Box>
        <AlertDialog
            isOpen={isFailed !== undefined}
            leastDestructiveRef={cancelRef}
            isCentered
            onClose={onCompleteClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {
                            isFailed ? "エラー" : "完了"
                        }
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {
                            isFailed ? <Box>
                                <Box fontWeight="bold">
                                    ロールの登録ができませんでした
                                </Box>
                            </Box> : <>ロール: {name} が作成されました</>
                        }
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onCompleteClose}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/role`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">ロール管理 / 新規作成</chakra.p>
                </Center>
                <Spacer/>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pt={"10px"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Center overflow="auto" pl={5} pr={5} w={"100%"} h={"100%"} bgColor={"#f0f9ff"}>
                    <Stack maxW="800px" minW={"300px"} w={"100%"}>
                        <Center w="100%" p={30}>
                            <chakra.p fontSize="30px">ロールの基本情報を入力</chakra.p>
                        </Center>
                        <Box p="60px" boxShadow="0 0 20px rgba(0,0,0,.1)" bgColor="white" w={"100%"}>
                            <chakra.p fontWeight="bold">
                                ロール
                            </chakra.p>
                            <chakra.p fontSize="13px" color="#a0a0a0">
                                他のロールと被らないオリジナルな名前を設定してください
                            </chakra.p>
                            <Box pt={5}>
                                <Input value={name} onChange={(e)=>{setName(e.target.value)}}/>
                            </Box>
                        </Box>
                        <Center w="100%" p={30}>
                            <Button onClick={handleCreate} colorScheme="green" isDisabled={name.length <= 0}>
                                ロールを作成
                            </Button>
                        </Center>
                    </Stack>
                </Center>
            </Box>
        </Box>
    </Box>
}
export default RoleCreatePage
