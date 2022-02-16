import {Link, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {getFields} from "../../store/fields";
import React, {useEffect, useRef, useState} from "react";
import {CMSApi, toJapaneseFromFieldType} from "../../api/cms";
import {Box, Center} from "@chakra-ui/layout";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button, chakra, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, useToast
} from "@chakra-ui/react";
import {
    AddIcon,
    ArrowBackIcon,
    CheckIcon,
    DeleteIcon,
    EditIcon,
    HamburgerIcon,
    RepeatIcon,
    ViewIcon
} from "@chakra-ui/icons";
import {BooleanEditor, NumberEditor, RelationEditor, TextEditor} from "./ContentEditorComponent";
import {getContents, setContents} from "../../store/contents";
import NotFound from "../NotFound";
import {ContentMeta} from "../../model/model";
import {getApis} from "../../store/apis";
import store from "../../store";

const ContentsEditor  = ()=>{
    const params = useParams<"id"|"contents_id">()

    const fields = useSelector(getFields)[params.id ? params.id : ""].map(i=>{return Object.assign({},i)}).sort((a,b)=> a.priority - b.priority)

    const api = useSelector(getApis).filter(i=>i.api_id === params.id)

    const [sendFaultResult,setSendFaultResult] = useState<boolean|undefined>(undefined)

    const cancelRef = useRef<HTMLButtonElement|null>(null)

    const [displayContent,setDisplayContent] = useState<{[key:string]:any}>((()=>{
        const r = useSelector(getContents).filter((i)=>{
            return i["_id"] === params.contents_id
        })
        if(r.length > 0){
            return Object.assign({},r[0])
        }
        return {}
    })())

    const nav = useNavigate()

    const toast = useToast()

    const handleDelete = ()=>{
        (async ()=>{
            const r = (await CMSApi.Content.deleteById(params.id ? params.id : "",
                params.contents_id ? params.contents_id : ""))
            setSendFaultResult(!r)
            if(r){
                nav(-1)
            }
        })()
    }

    const handleUpdate = ()=>{
        (async ()=>{
            setSendFaultResult(undefined)
            const r = (await CMSApi.Content.update(params.id ? params.id : "",
                params.contents_id ? params.contents_id : "",
                displayContent))
            setSendFaultResult(!r)
            if(r){
                (async ()=>{
                    const newContent = await CMSApi.Content.getByContentId(params.id ? params.id : "", params.contents_id ? params.contents_id : "")
                    setDisplayContent(newContent)
                })()
                toast({
                    title: 'Success!',
                    description: "コンテンツの更新に成功しました",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
        })()
    }

    const handleGoPreview = ()=>{
        if(api.length === 1 && api[0].preview_url && api[0].preview_url.length > 0){
            const link = api[0].preview_url.replaceAll("{API_ID}",api[0].api_id).replaceAll("{CONTENT_ID}",displayContent["_id"])
            window.open(link)
            return
        }
        alert("APIにプレビュー用のURLが設定されていません.")
    }

    const handleChangePublish = ()=>{

        const publishFlag = !(displayContent as ContentMeta).published_at;

        (async ()=>{
            setSendFaultResult(undefined)
            const r = (await CMSApi.Content.changePublishStatus(publishFlag,params.id ? params.id : "",
                params.contents_id ? params.contents_id : ""))
            setSendFaultResult(!r)
            if(r){
                (async ()=>{
                    const newContent = await CMSApi.Content.getByContentId(params.id ? params.id : "", params.contents_id ? params.contents_id : "")
                    setDisplayContent(newContent)
                })()
                toast({
                    title: 'Success!',
                    description: `コンテンツの公開状態を${!publishFlag ? "\"公開\"" : "\"非公開\""}に変更しました`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
        })()
    }

    if(useSelector(getContents).filter((i)=>{
        return i["_id"] === params.contents_id
    }).length === 0){
        return <NotFound/>
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

        <Box pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Center h={"100%"}>
                <Flex w={"100%"}>
                    <Center>
                        <Link to={`/api/${params.id}`}>
                            <ArrowBackIcon/>
                        </Link>
                    </Center>
                    <Center>
                        <Box pl={4}>
                            <chakra.p fontWeight="bold">{params.id} / 編集</chakra.p>
                        </Box>
                    </Center>
                    <Spacer/>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<HamburgerIcon />}
                            variant='outline'
                        />
                        <MenuList>
                            <MenuItem icon={<DeleteIcon color={"#E53E3E"}/>} onClick={handleDelete}>
                                削除
                            </MenuItem>
                            <MenuItem icon={<ViewIcon/>} onClick={handleGoPreview}>
                                下書きをプレビュー
                            </MenuItem>
                            <MenuItem icon={(displayContent as ContentMeta).published_at ? <EditIcon color={"#319795"}/> : <CheckIcon color={"#3182ce"}/>} onClick={handleChangePublish}>
                                {
                                    (displayContent as ContentMeta).published_at ? "下書きに戻す" : "公開"
                                }
                            </MenuItem>
                            <MenuItem icon={<RepeatIcon color={"#38A169"}/>} colorScheme="green" onClick={handleUpdate}>
                                更新
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Center>
        </Box>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" pb="20px" pt={5} pl={1} pr={1} overflow="auto" h={"100%"}>
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
                                                    value={displayContent[f.field_name]}
                                                    onChange={(e)=>{
                                                        const c = {...displayContent}
                                                        c[f.field_name] = e
                                                        setDisplayContent(c)
                                                    }}/>
                                            }
                                            if("number" === f.type){
                                                return <NumberEditor value={displayContent[f.field_name]}
                                                                     onChange={(e)=>{
                                                                         const c = {...displayContent}
                                                                         c[f.field_name] = e
                                                                         setDisplayContent(c)
                                                                     }}/>
                                            }
                                            if("boolean" === f.type){
                                                return <BooleanEditor value={displayContent[f.field_name]} onChange={(e)=>{
                                                    const c = {...displayContent}
                                                    c[f.field_name] = String(c[f.field_name]) !== "true"
                                                    setDisplayContent(c)
                                                }}/>
                                            }
                                            if("relation" === f.type){
                                                return <RelationEditor
                                                    apiId={f.relation_api ? f.relation_api : ""}
                                                    onClickItem={(i,e)=>{
                                                        let c: {[id:string]:any} = Object.assign({},displayContent)
                                                        const relations = c[f.field_name] as string[]
                                                        if(relations){
                                                            if(relations.includes(e._id)){
                                                                c[f.field_name] = relations.filter(i=>i !== e._id)
                                                            }else{
                                                                c[f.field_name] = [...c[f.field_name],e._id]
                                                            }
                                                        }else{
                                                            c[f.field_name] = [e._id]
                                                        }
                                                        setDisplayContent(c)
                                                    }}
                                                    selected={displayContent[f.field_name] as string[]}
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

export default ContentsEditor
