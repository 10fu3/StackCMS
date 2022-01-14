import {Box, Center} from "@chakra-ui/layout";
import React, {useEffect, useRef, useState} from "react";
import {ApplyApiData, FieldType} from "../../../model/model";
import {useSelector} from "react-redux";
import {getApis, setApis} from "../../../store/apis";
import {useParams} from "react-router-dom";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    chakra,
    Flex,
    IconButton,
    Input,
    Select
} from "@chakra-ui/react";
import UUID from "uuidjs";
import {AddIcon} from "@chakra-ui/icons";
import {isCompletePage} from "../ApiCreate";
import {CMSApi} from "../../../api/cms";
import store from "../../../store";

const ApiSchemaSettings = () => {

    const cancelRef = useRef<HTMLButtonElement>(null)

    const params = useParams<"id">()

    const [fields, setFields] = useState<FieldType[]>([])

    const [base,setBase] = useState('')

    const [canChange,setCanChange] = useState(false)

    const [appliedResult,setAppliedResult] = useState<boolean|undefined>(undefined)

    const apis = useSelector(getApis)

    useEffect(() => {
        const api = apis.filter((i) => {
            return i.api_id === (params && params.id ? params.id : "")
        })
        if (api.length !== 1) {
            return
        }
        setFields(api[0].fields)
        setBase(JSON.stringify(api[0].fields))
    }, [])

    useEffect(() => {
        if((base !== JSON.stringify(fields)) && isCompletePage({
            api_id: "",
            fields: fields,
            is_single: false
        },2)){
            setCanChange(true)
            return;
        }
        setCanChange(false)
    }, [fields])

    const handleApply = ()=>{
        (async ()=>{

            const datas = fields.map(i=>{
                let d:FieldType = Object.assign({},i)
                if(d.relation_api){
                    const a = apis.filter(j=>j.api_id === d.relation_api)
                    if(a.length === 1){
                        d.relation_api = a[0].unique_id
                    }
                }
                return d
            })

            const d:ApplyApiData = {
                fields: datas
            }

            console.log(d)

            if(await CMSApi.updateApi(params.id ? params.id : "" , d)){
                store.dispatch(setApis)
                setAppliedResult(true)
            }else{
                setAppliedResult(false)
            }
        })()
    }

    return <Box>

        <AlertDialog
            isOpen={appliedResult !== undefined}
            leastDestructiveRef={cancelRef}
            isCentered
            onClose={()=>{setAppliedResult(undefined)}}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {
                            appliedResult === false ? "エラー" : "完了"
                        }
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {
                            appliedResult === false ? <Box>
                                <Box fontWeight="bold">
                                    変更の反映に失敗しました
                                </Box>
                            </Box> : <>変更が反映されました</>
                        }
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={()=>{setAppliedResult(undefined)}}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

        <Box>
            <Box overflow="auto" pt={3} pb={5} pl={5} pr={5} w={"100%"} h={"100%"} borderRadius="5px" borderWidth="1px" bgColor={"white"}>
                {
                    fields.map((e, i) => {
                        return <Box pt="10px" pb="10px">
                            <Flex borderWidth="1px" p="10px 26px 10px 26px" bgColor="white" w={"100%"}>
                                <Box p="10px" flex="1 1 0%">
                                    <chakra.p pb="20px" fontWeight="bold">
                                        フィールドID
                                    </chakra.p>
                                    <Input onChange={(e) => {
                                        let t = [...fields]
                                        t[i] = {
                                            ...t[i],
                                            field_name: e.target.value
                                        }
                                        setFields(t)
                                    }} value={fields[i].field_name}/>
                                </Box>
                                <Box p="10px" flex="1 1 0%">
                                    <chakra.p pb="20px" fontWeight="bold">
                                        種類
                                    </chakra.p>
                                    <Select onChange={(e) => {
                                        let t = [...fields]
                                        t[i] = {
                                            ...t[i],
                                            type: e.target.value
                                        }
                                        setFields(t)
                                    }} value={fields[i].type} defaultValue='string' placeholder='未選択'>
                                        <option value='string'>テキスト型</option>
                                        <option value='number'>数値型</option>
                                        <option value='boolean'>真偽値</option>
                                        <option value='date'>日付型</option>
                                        <option value='relation'>参照型</option>
                                    </Select>
                                </Box>
                                {
                                    e.type === "relation" ? <Box p="10px" flex="1 1 0%">
                                        <chakra.p pb="20px" fontWeight="bold">
                                            参照先API
                                        </chakra.p>
                                        <Select onChange={(e) => {
                                            let t = [...fields]
                                            t[i] = {
                                                ...t[i],
                                                relation_api: e.target.value
                                            }
                                            setFields(t)
                                        }} value={fields[i].relation_api} defaultValue={undefined} placeholder='未選択'>
                                            {
                                                apis.map((e) => {
                                                    return <option value={e.unique_id.valueOf()}>{apis.filter(i=>i.api_id === e.api_id)[0].api_id}</option>
                                                })
                                            }
                                        </Select>
                                    </Box> : <></>
                                }
                                <Center>
                                    {
                                        fields.length > 1 ? <Button colorScheme="red" onClick={() => {
                                            if (fields.length > 0) {
                                                let t = fields.filter((j) => {
                                                    return j.id !== e.id
                                                })
                                                setFields(t)
                                            }
                                        }}>削除</Button> : <></>
                                    }
                                </Center>
                            </Flex>
                        </Box>
                    })
                }
                <Center>
                    <IconButton
                        colorScheme="green"
                        onClick={() => {
                        setFields([...fields, {
                            api_id: params.id ? params.id : "",
                            id: UUID.generate(),
                            field_name: "",
                            relation_api: "",
                            type: ""
                        }])
                    }} aria-label={""}>
                        <AddIcon/>
                    </IconButton>
                </Center>
            </Box>
            <Box pt={10} w="100%">
                <Button onClick={handleApply} isDisabled={!canChange} colorScheme="green" float="right">
                    変更
                </Button>
            </Box>
        </Box>
    </Box>
}

export default ApiSchemaSettings
