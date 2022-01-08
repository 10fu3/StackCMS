import {Box, Center} from "@chakra-ui/layout";
import {ReactElement, useEffect, useRef, useState} from "react";
import {Api, ApplyApiData} from "../../model/model";
import ApiCreateName from "./ApiCreateName";
import apis, {setApis} from "../../store/apis";
import {Button, Flex, Spacer} from "@chakra-ui/react";
import ApiCreateType from "./ApiCreateType";
import ApiCreateField from "./ApiCreateField";

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import {CMSApi} from "../../api/cms";
import store from "../../store";
import {setCurrentUser} from "../../store/auth";
import {setUsers} from "../../store/users";
import {setRoles} from "../../store/roles";
import {setContents} from "../../store/contents";

export const isCompletePage = (api:ApplyApiData, index:number) => {
    switch (index){
        case 0:
            if(api.api_id){
                return true
            }
            break
        case 1:
            if(api.is_single !== undefined && api.is_single !== null){
                return true
            }
            break
        case 2:
            if(api.fields.length > 0){
                for (const field of api.fields) {
                    if(field.field_name.length === 0){
                        return false
                    }
                    if(field.type.length === 0){
                        return false
                    }
                    if(field.type === "relation" && !field.relation_api){
                        return false
                    }
                }
                return true
            }
            break
    }
    return false
}

export const isCompleteCreateApi = (api:ApplyApiData)=>{
    let err:string[] = []
    if(!api.api_id){
        err.push("API / エンドポイント名")
    }
    if(api.is_single === undefined){
        err.push("APIの型")
    }
    if(api.fields.length === 0){
        err.push("フィールドの個数(最低でも1つは必要です)")
    }
    for (let i = 0; i < api.fields.length; i++) {
        const field = api.fields[i]
        if(field.field_name.length === 0){
            err.push(`${i+1}個目のフィールド名が未入力です`)
        }
        if(field.type.length === 0){
            err.push(`${i+1}個目のフィールドの種類`)
        }
        if(field.type === "relation" && !field.relation_api){
            err.push(`${i+1}個目のフィールドの参照先API`)
        }
    }
    return err
}

const ApiCreate = ()=>{

    const [nowPage,setPage] = useState(0)

    const handleNext = ()=>{
        if(nowPage < 3){
            setPage((e)=>{return nowPage+1})
        }
    }

    const handleBack = ()=>{
        if(nowPage > 0){
            setPage((e)=>{return nowPage-1})
        }
    }

    const handleComplete = (r:string[])=>{
        if(r.length > 0){
            setErrorMessage(r)
            setIsOpenComplete(true)
        }else{
            (async ()=>{
                const result = await CMSApi.createApi(api)
                if(result){
                    setErrorMessage([])
                    store.dispatch(setCurrentUser())
                    store.dispatch(setApis())
                    store.dispatch(setUsers())
                    store.dispatch(setRoles())
                }else{
                    setErrorMessage(["通信エラーが発生しました"])
                }
                setIsOpenComplete(true)
            })()
        }
    }

    const [api,setApi] = useState<ApplyApiData>(
        {
            api_id: undefined,
            fields: [],
            is_single: undefined
        }
    )

    const [canNext,setCanNextState] = useState(false)

    useEffect(()=>{
        setCanNextState(nowPage < 2)
    },[nowPage])

    const pages:ReactElement[] = [
        <ApiCreateName data={api} setData={setApi} />,
        <ApiCreateType data={api} setData={setApi} />,
        <ApiCreateField data={api} setData={setApi}/>
    ]

    const [isOpenComplete, setIsOpenComplete] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string[]>([])
    const onCompleteClose = () => setIsOpenComplete(false)
    const cancelRef = useRef<HTMLButtonElement>(null)

    return <Box w={"100%"} h={"100%"}>
        <AlertDialog
            isOpen={isOpenComplete}
            leastDestructiveRef={cancelRef}
            isCentered
            onClose={onCompleteClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {
                            errorMessage.length > 0 ? "エラー" : "完了"
                        }
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {
                            errorMessage.length > 0 ? <Box>
                                <Box fontWeight="bold">
                                    次の項目が入力されていないか, 不備があります
                                </Box>
                                {
                                    errorMessage.map(i=>{
                                        return <Box color="red">
                                            {
                                                i
                                            }
                                        </Box>
                                    })
                                }
                            </Box> : <>APIが作成されました</>
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
        <Box w={"100%"} h={"calc(100% - 64px)"}>
            {
                pages[nowPage]
            }
        </Box>
        <Center w={"100%"} h={"64px"}>
            <Flex maxW="800px" minW={"300px"} w={"100%"}>
                {
                    nowPage > 0 ? <Button onClick={handleBack}>
                        戻る
                    </Button> : <></>
                }
                <Spacer/>
                {
                    canNext ? <Button onClick={handleNext}>
                        進む
                    </Button> : <></>
                }
                {
                    (()=>{
                        const r = isCompleteCreateApi(api)
                        return !canNext ? <Button colorScheme={r.length === 0 ? "green" : "red"} onClick={()=>{handleComplete(r)}}>
                            完了
                        </Button> : <></>
                    })()
                }
            </Flex>
        </Center>
    </Box>
}

export default ApiCreate
