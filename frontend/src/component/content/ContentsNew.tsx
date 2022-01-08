import {Link, useNavigate, useParams} from "react-router-dom";
import {Box, Center} from "@chakra-ui/layout";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    chakra,
    Flex,
    Spacer,
} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {useSelector} from "react-redux";
import {getFields} from "../../store/fields";
import React, {useEffect, useRef, useState} from "react";
import {CMSApi, toJapaneseFromFieldType} from "../../api/cms";
import {getApis} from "../../store/apis";
import {BooleanEditor, NumberEditor, RelationEditor, TextEditor} from "./ContentEditorComponent";
const ContentsNew = () =>{
    const params = useParams<"id">()

    const nav = useNavigate()

    const fields = useSelector(getFields)[params.id ? params.id : ""]

    const [createContents,setCreateContents] = useState<{[id:string]:any}>((()=>{
        return fields.reduce(function(target, key, index) {
            target[key.field_name] = (()=>{
                switch (key.type) {
                    case "string":
                        return ""
                    case "number":
                        return 0
                    case "boolean":
                        return false
                    case "relation":
                        return ([] as string[])
                }
            })();
            return target;
        }, {} as {[id:string]:any})
    })())

    const [sendFaultResult,setSendFaultResult] = useState<boolean|undefined>(undefined)

    const cancelRef = useRef<HTMLButtonElement>(null)

    const handleSend = ()=>{
        (async ()=>{
            setSendFaultResult(undefined)
            const r = await CMSApi.createContents(params.id ? params.id : "",createContents)
            setSendFaultResult(!r);
            if(r){
                nav(-1)
            }
        })()
    }

    return <Box w={"100%"} h={"100vh"}>

        <AlertDialog
            isOpen={sendFaultResult === true}
            leastDestructiveRef={cancelRef}
            isCentered
            onClose={()=>{}}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {
                            "エラー"
                        }
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Box fontWeight="bold">
                            送信時にエラーが発生しました
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={()=>{setSendFaultResult(false)}}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/api/${params.id}`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center>
                    <Box pl={4}>
                        <chakra.p fontWeight="bold">{params.id} / 新規作成</chakra.p>
                    </Box>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Button colorScheme="green" onClick={handleSend}>
                        追加
                    </Button>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pb="20px" pt={5} pl={5} pr={5} overflow="auto" h={"100%"}>
                <Box w="100%">
                    {
                        fields.map(f=>{
                            return <Box p={5}>
                                <Box p={5} bgColor="white" borderWidth="1px" borderRadius="5px">
                                    <Box>
                                        <chakra.p pb={5} fontWeight="bold">{f.field_name}</chakra.p>
                                        <chakra.p pb={5} color="#777" fontWeight="bold">{toJapaneseFromFieldType(f.type)}</chakra.p>
                                    </Box>
                                    {
                                        (()=>{
                                            if("string" === f.type){
                                                return <TextEditor
                                                    value={createContents[f.field_name]}
                                                    onChange={(e)=>{
                                                        const c = {...createContents}
                                                        c[f.field_name] = e
                                                        setCreateContents(c)
                                                    }}/>
                                            }
                                            if("number" === f.type){
                                                return <NumberEditor value={createContents[f.field_name]}
                                                                     onChange={(e)=>{
                                                                         const c = {...createContents}
                                                                         c[f.field_name] = e
                                                                         setCreateContents(c)
                                                                     }}/>
                                            }
                                            if("boolean" === f.type){
                                                return <BooleanEditor value={createContents[f.field_name]} onChange={(e)=>{
                                                    const c = {...createContents}
                                                    c[f.field_name] = e
                                                    setCreateContents(c)
                                                }}/>
                                            }
                                            if("relation" === f.type){
                                                return <RelationEditor
                                                    apiId={f.relation_api ? f.relation_api : ""}
                                                    onClickItem={(e,i)=>{

                                                        const c = {...createContents}
                                                        if(c[f.field_name] as string[]){
                                                            (c[f.field_name] as string[]).push(i._id)
                                                        }else{
                                                            c[f.field_name] = [i.api_id]
                                                        }
                                                        setCreateContents(c)
                                                    }}
                                                    selected={createContents[f.field_name]}
                                                />
                                            }
                                        })()
                                    }
                                </Box>
                            </Box>
                        })
                    }
                </Box>
            </Box>
        </Box>
    </Box>
}

export default ContentsNew
