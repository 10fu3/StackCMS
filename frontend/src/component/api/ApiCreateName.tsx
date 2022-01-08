import {Box, Center, Text} from "@chakra-ui/layout";
import {chakra, Input, Stack} from "@chakra-ui/react"
import React, {Dispatch, SetStateAction, useState} from "react";
import {ApplyApiData} from "../../model/model";

const ApiCreateName:React.FC<{
    data: ApplyApiData,
    setData:Dispatch<SetStateAction<ApplyApiData>>,
}> = (props)=>{



    return <Center overflow="auto" pl={5} pr={5} w={"100%"} h={"100%"} bgColor={"#f0f9ff"}>
        <Stack maxW="800px" minW={"300px"} w={"100%"}>
            <Center w="100%" p={30}>
                <chakra.p fontSize="30px">APIの基本情報を入力</chakra.p>
            </Center>
            <Box p="60px" boxShadow="0 0 20px rgba(0,0,0,.1)" bgColor="white" w={"100%"}>
                <chakra.p fontWeight="bold">
                    API / エンドポイント名
                </chakra.p>
                <chakra.p fontSize="13px" color="#a0a0a0">
                    他のエンドポイント名と被らないオリジナルな名前を設定してください
                </chakra.p>
                <Box pt={5}>
                    <Input  value={props.data.api_id ? props.data.api_id : ""} onChange={(e)=>{
                        props.setData({...props.data,api_id:e.target.value})
                    }}/>
                </Box>
            </Box>
        </Stack>
    </Center>
}

export default ApiCreateName
