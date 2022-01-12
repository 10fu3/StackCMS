import {Box} from "@chakra-ui/layout";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    chakra,
    Divider, Flex,
    Spacer
} from "@chakra-ui/react"
import React, {useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CMSApi} from "../../../api/cms";

const ApiDeleteSettings:React.FC<{}> = (props)=>{

    const params = useParams<"id">()

    const nav = useNavigate()

    const [handle,setHandle] = useState<string|undefined>()
    const [handleResult,setHandleResult] = useState<boolean|undefined>()

    const action: {[id:string]:()=>void} = {
        "contents": ()=>{
            (async ()=>{
                setHandleResult(await CMSApi.deleteContentsByApi(params.id ? params.id : ""))
            })()
        },
        "api":()=>{
            (async ()=>{
                setHandleResult(await CMSApi.deleteApi(params.id ? params.id : ""))
            })()
        }
    }

    const handleBack = ()=>{
        nav("/api")
    }

    const handleExecute = ()=>{
        action[handle ? handle : ""]()
        setHandle(undefined)
    }

    const handleCancel = ()=>{
        setHandle(undefined)
    }

    const cancelRef = useRef<HTMLButtonElement>(null)

    return <Box>
        <AlertDialog
            isOpen={!!(handle) || (handleResult !== undefined)}
            leastDestructiveRef={cancelRef}
            isCentered
            onClose={handleCancel}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {
                            handleResult !== undefined ?
                                handleResult ?
                                    "成功": "エラー" :
                                handle !== undefined ?
                                    "注意": ""
                        }
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Box>
                            {
                                handleResult !== undefined ?
                                    handleResult ?
                                        "削除しました": "削除に失敗しました" :
                                    handle !== undefined ?
                                        "本当に削除しますか?": ""
                            }
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        {
                            handleResult !== undefined ?
                                handleResult ?
                                    <Button ref={cancelRef} onClick={handleBack}>
                                        OK
                                    </Button>:
                                    <Button ref={cancelRef} onClick={handleBack}>
                                        OK
                                    </Button> :
                                handle !== undefined ?
                                    <Flex w="100%">
                                        <Button colorScheme="blue" ref={cancelRef} onClick={handleCancel}>
                                            キャンセル
                                        </Button>
                                        <Spacer/>
                                        <Button colorScheme="red" ref={cancelRef} onClick={handleExecute}>
                                            OK
                                        </Button>
                                    </Flex>:
                                    ""
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        <Box overflow="auto" p={10} w={"100%"} h={"100%"} borderRadius="5px" borderWidth="1px" bgColor={"white"}>
            <chakra.p>
                <chakra.p fontWeight="bold">
                    {params.id} APIの全コンテンツを削除
                </chakra.p>
                <chakra.p color="#777" fontSize="13px">
                    危険な操作です。このAPIの全てのコンテンツを削除します。APIそのものは残ります。
                </chakra.p>
            </chakra.p>
            <Box pt={4}>
                <Button color="red" onClick={()=>{setHandle("contents")}}>
                    全コンテンツを削除
                </Button>
            </Box>
            <Box p={5}>
                <Divider/>
            </Box>
            <chakra.p>
                <chakra.p fontWeight="bold">
                    {params.id} APIを削除
                </chakra.p>
                <chakra.p color="#777" fontSize="13px">
                    危険な操作です。実際に稼働しているAPIもすべて動作しなくなります。紐づいているコンテンツも全て削除されます。
                </chakra.p>
            </chakra.p>
            <Box pt={4}>
                <Button color="red" onClick={()=>{setHandle("api")}}>
                    APIを削除
                </Button>
            </Box>
        </Box>
    </Box>
}

export default ApiDeleteSettings
