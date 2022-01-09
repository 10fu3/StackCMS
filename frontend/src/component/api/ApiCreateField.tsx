import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, IconButton, Input, Select, Stack} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction} from "react";
import {ApplyApiData} from "../../model/model";
import {AddIcon} from "@chakra-ui/icons";
import UUID from 'uuidjs';
import {useSelector} from "react-redux";
import {getApis} from "../../store/apis";

const ApiCreateField :React.FC<{
    data: ApplyApiData,
    setData:Dispatch<SetStateAction<ApplyApiData>>,
}> = (props)=>{
    const apis = useSelector(getApis)
    return <Box overflow="auto" pb={5} pl={5} pr={5} w={"100%"} h={"100%"} bgColor={"#f0f9ff"}>
        <chakra.p pt="100px" pb="50px" textAlign="center" w="100%" fontSize="30px">
            コンテンツフィールドを定義
        </chakra.p>
        {
            props.data.fields.map((e,i)=>{
                return <Box pt="10px" pb="10px">
                    <Flex borderWidth="1px" p="10px 26px 10px 26px" bgColor="white" w={"100%"}>
                        <Box p="10px" flex="1 1 0%">
                            <chakra.p pb="20px" fontWeight="bold">
                                フィールドID
                            </chakra.p>
                            <Input onChange={(e)=>{
                                let t = [...props.data.fields]
                                t[i] = {
                                    ...t[i],
                                    field_name: e.target.value
                                }
                                props.setData({...props.data,fields:t})
                            }} value={props.data.fields[i].field_name}/>
                        </Box>
                        <Box p="10px" flex="1 1 0%">
                            <chakra.p pb="20px" fontWeight="bold">
                                種類
                            </chakra.p>
                            <Select onChange={(e)=>{
                                let t = [...props.data.fields]
                                t[i] = {
                                    ...t[i],
                                    type: e.target.value
                                }
                                props.setData({...props.data,fields:t})
                            }} value={props.data.fields[i].type} defaultValue='string' placeholder='未選択'>
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
                                <Select onChange={(e)=>{
                                    let t = [...props.data.fields]
                                    t[i] = {
                                        ...t[i],
                                        relation_api: e.target.value
                                    }
                                    props.setData({...props.data,fields:t})
                                }} value={props.data.fields[i].relation_api} defaultValue={undefined} placeholder='未選択'>
                                    {
                                        apis.map((e)=>{
                                            return <option value={e.unique_id}>{e.api_id}</option>
                                        })
                                    }
                                </Select>
                            </Box> : <></>
                        }
                        <Center>
                            {
                                props.data.fields.length > 1 ? <Button colorScheme="red" onClick={()=>{
                                    if(props.data.fields.length > 0){
                                        let t = props.data.fields.filter((j)=>j.id !== e.id)
                                        props.setData({...props.data,fields:[...t]})
                                    }
                                }}>削除</Button> : <></>
                            }
                        </Center>
                    </Flex>
                </Box>
            })
        }
        <Center>
            <IconButton onClick={()=>{
                props.setData({...props.data,fields:[...props.data.fields,{
                        api_id: props.data.api_id ? props.data.api_id : "",
                        id: UUID.generate(),
                        field_name: "",
                        relation_api: "",
                        type: ""
                    }]})
            }} aria-label={""}>
                <AddIcon/>
            </IconButton>
        </Center>
    </Box>
}

export default ApiCreateField
