import {Button, chakra, Flex, Input} from "@chakra-ui/react";
import React, {useState} from "react";
import {Box, Center} from "@chakra-ui/layout";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {getApis, setApis} from "../../../store/apis";
import Alert from "../../customHook/alert";
import {CMSApi} from "../../../api/cms";
import store from "../../../store";

const ApiPreviewSettings = ()=>{

    const params = useParams<"id">()

    const apis = useSelector(getApis).filter(i=>i.api_id === params.id)

    const api = apis[0]

    const [url,setUrl] = useState<string>(api?.preview_url)

    const [applyResult,setApplyResult] = useState<boolean|undefined>()

    if (apis.length !== 1){
        return <Box>
            エラーが発生しました.
        </Box>
    }

    const handleApply = ()=>{
        (async ()=>{
            setApplyResult(await CMSApi.Api.update.Preview(api.api_id,url))
            store.dispatch(setApis())
        })()
    }

    const alertClose = ()=>{
        setApplyResult(undefined)
    }

    return <Box>
        <Alert
            title={applyResult ? "成功" : "エラー"}
            body={"プレビューURLの変更に"+(applyResult ? "成功" : "失敗")+"しました"}
            isOpen={applyResult !== undefined}
            onOkClick={alertClose}
            onClose={alertClose}/>
        <Box overflow="auto" p={10} w={"100%"} h={"100%"} borderRadius="5px" borderWidth="1px" bgColor={"white"}>
            <chakra.h1 fontWeight="bold" pt={3} pb={3} fontSize="23px">画面プレビュー</chakra.h1>
            <chakra.p fontWeight="bold">
                遷移先URL
            </chakra.p>
            <chakra.p>
                <Box>
                    画面プレビューボタンをクリックした際の遷移先URLを指定することができます。
                </Box>
                <Box pt={3}>
                    URLの中には
                    <chakra.strong p={1} m={1} bgColor="#ccc">
                        {"{CONTENT_ID}"}
                    </chakra.strong>
                    という文字列を含めてください.
                </Box>
                <Box pt={3}>
                    また
                    <chakra.strong  p={1} m={1} bgColor="#ccc">
                        {"{API_ID}"}
                    </chakra.strong>
                    を含めると, API IDを取得することもできます.
                </Box>
            </chakra.p>
            <chakra.p  pt={3} color="#777" fontSize="13px">現在の遷移先URL: {api.preview_url}</chakra.p>
            <Box pt={3}>
                <Flex>
                    <Input value={url} onChange={(e)=>{setUrl(e.target.value)}}/>
                    <Box pl={3}>
                        <Button colorScheme="green" onClick={handleApply}>
                            適用
                        </Button>
                    </Box>
                </Flex>
            </Box>
        </Box>
    </Box>
}

export default ApiPreviewSettings