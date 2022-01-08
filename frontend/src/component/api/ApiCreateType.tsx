import React, {Dispatch, SetStateAction, useState} from "react";
import {ApplyApiData} from "../../model/model";
import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, IconButton, Input, Stack} from "@chakra-ui/react";
import {EditIcon, HamburgerIcon} from "@chakra-ui/icons";

const ApiCreateType:React.FC<{
    data: ApplyApiData,
    setData:Dispatch<SetStateAction<ApplyApiData>>,
}> = (props)=>{

    return <Box overflow="auto" w="100%" h="100%">
        <Center pl={5} pr={5} minW={"800px"} w="100%" h={"100%"} bgColor={"#f0f9ff"}>
            <Stack>
                <Center w="100%" p={30}>
                    <chakra.p fontSize="30px">APIの型を選択</chakra.p>
                </Center>
                <Flex w={"100%"}>
                    <chakra.dl onClick={()=>{
                        props.setData({...props.data,is_single:false})
                    }} border={(()=>{
                        if(props.data.is_single === true){
                            return ""
                        }else if(props.data.is_single === false){
                            return "2px solid #2c7a7b"
                        }
                        return ""
                    })()} _hover={{transition:".1s",border:"2px solid #2c7a7b"}} m="10px" p="10px" bgColor="white" w={300} h={300}  textAlign="center">
                        <chakra.dd pt="30px" pb="30px">
                            <HamburgerIcon w="60px" h="auto"/>
                        </chakra.dd>
                        <chakra.dt fontWeight="bold" pb="30px">
                            リスト形式
                        </chakra.dt>
                        <chakra.dd color="#777">
                            JSON配列を返却するAPIを作成します。ブログやお知らせの一覧に適しています。
                        </chakra.dd>
                    </chakra.dl>
                    <chakra.dl onClick={()=>{
                        props.setData({...props.data,is_single:true})
                    }} border={(()=>{
                        if(props.data.is_single === true){
                            return "2px solid #2c7a7b"
                        }else if(props.data.is_single === false){
                            return ""
                        }
                        return ""
                    })()} _hover={{transition:".1s",border:"2px solid #2c7a7b"}} m="10px" p="10px" bgColor="white" w={300} h={300}  textAlign="center">
                        <chakra.dd pt="30px" pb="30px">
                            <EditIcon w="60px" h="auto"/>
                        </chakra.dd>
                        <chakra.dt fontWeight="bold" pb="30px">
                            オブジェクト形式
                        </chakra.dt>
                        <chakra.dd color="#777">
                            JSONオブジェクトを返却するAPIを作成します。設定ファイルや単体ページ情報などの取得に適しています。
                        </chakra.dd>
                    </chakra.dl>
                </Flex>
            </Stack>
        </Center>
    </Box>
}

export default ApiCreateType
