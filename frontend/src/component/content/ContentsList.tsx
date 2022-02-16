import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Divider, Flex, Spacer, Table} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {CSSProperties, useEffect, useState} from "react";
import {getContents, setContents} from "../../store/contents";
import {useSelector} from "react-redux";
import {getFields} from "../../store/fields";
import {ContentMeta, FieldType} from "../../model/model";
import {toJapaneseFromFieldType} from "../../api/cms";
import store from "../../store";
import {getApis} from "../../store/apis";
import { Virtuoso } from "react-virtuoso";

const ContentsList = ()=>{

    const params = useParams<"id">()

    const rawFields = useSelector(getFields)

    const apis = useSelector(getApis)

    const [fields,setFields] = useState<FieldType[]>([])

    const nav = useNavigate()

    const unionCellCss:CSSProperties = {
        overflow:"hidden",
    }

    const contents:{[key:string]:any}[] = useSelector(getContents)

    useEffect(()=>{
        store.dispatch(setContents(params.id ? params.id : ""))
    },[params.id])

    useEffect(()=>{
        if(!params.id){
            return;
        }
        if(!rawFields[params.id]){
            return
        }
        if(!contents){
            window.location.href = "/login"
            return
        }
        let inputs:FieldType[] = []
        for (const f of rawFields[params.id]) {
            let input = Object.assign({},f)
            if (f.type === "relation" && f.relation_api) {
                const api = apis.filter(i => i.unique_id === f.relation_api)[0]
                if(!api){
                    return;
                }
                input.relation_api = api.api_id
            }
            inputs.push(input)
        }
        setFields(inputs.map(i=>Object.assign({},{...i})).sort((a,b)=> a.priority - b.priority))
    },[rawFields])

    return rawFields[params.id ? params.id : ""] ? <Box w={"100%"} h={"100vh"} wordBreak={"break-all"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <chakra.p fontWeight="bold">{params.id}</chakra.p>
                </Center>
                <Spacer/>
                <Box pl={2} pr={2}>
                    <Link to={"settings"}>
                        <Button>
                            API設定
                        </Button>
                    </Link>
                </Box>
                {
                    window.location.href.split("/").length === 5 ? <Box pl={2} pr={2}>
                        <Link to={`/api/${params.id}/new`}>
                            <Button colorScheme="green">
                                追加
                            </Button>
                        </Link>
                    </Box> : <></>
                }
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"}>
            <Box w="100%" h={"100%"} pb="20px" pl={5} pr={5}>
                <Box w="100%" h={"100%"}>
                    <Box style={{width:"100%",maxHeight:"56px",overflowY:"scroll"}}>
                        <Flex style={{width:"100%",maxHeight:"56px",fontSize:"12px"}}>
                            <Box style={{padding:10,width:`calc( 100%/ ${rawFields[String(params.id)].length+1})`}}>
                                <Center h={"100%"}>
                                    ステータス
                                </Center>
                            </Box>
                            {
                                fields.map((e)=>{
                                    return <Box style={{padding:10,width:`calc( 100%/ ${rawFields[String(params.id)].length+1})`}}>
                                        <Center>
                                            {
                                                e.field_name
                                            }
                                        </Center>
                                        <Center fontSize="10px" fontWeight="bold" color="#777">
                                            {
                                                (()=> {
                                                    if (!(e.type === "relation" && e.relation_api)) {
                                                        return <Box>
                                                            {toJapaneseFromFieldType(e.type)}
                                                        </Box>
                                                    }
                                                    return e.relation_api ? <Center>
                                                        <Flex>
                                                            <Link to={'/api/' + e.relation_api}>
                                                                <Box textDecoration="underline">
                                                                    参照先:{
                                                                        e.relation_api
                                                                    }
                                                                </Box>
                                                            </Link>
                                                        </Flex>
                                                    </Center> : <></>
                                                })()
                                            }
                                        </Center>
                                    </Box>
                                })
                            }
                        </Flex>
                    </Box>
                    <Box style={{height: 'calc(100% - 56px)',paddingTop:20,width:"100%",borderCollapse:"separate",borderSpacing:"0 10px",tableLayout:"fixed",fontSize:"13px"}}>
                        <Virtuoso style={{height: '100%',width:"100%"}} totalCount={contents ? contents.length : 0} itemContent={
                            i => {
                                let e = contents[i]
                                return <Flex
                                    onClick={()=>{
                                        nav(`/api/${params.id}/${e["_id"]}`)
                                    }}
                                    style={{
                                        paddingBottom:"10px",
                                        width:"100%",
                                        cursor:"pointer",
                                    }}>
                                    {
                                        <Center style={{
                                            backgroundColor:"white",
                                            width:`calc( 100% / ${rawFields[String(params.id)].length+1})`,
                                            borderRadius:"5px 0 0 5px",
                                            borderTop: "1px solid #e7e7e7",
                                            borderBottom: "1px solid #e7e7e7",
                                            borderLeft: "1px solid #e7e7e7",
                                            borderRight: "0px",
                                            borderWidth: 1,
                                        }}>
                                            <Center style={{
                                                paddingRight:5,
                                                paddingLeft:5,
                                            }}>
                                                <Box pl={3} borderLeft={`5px solid ${e["published_at"] ? "#008a74" : "#0087ff"}`}>
                                                    {
                                                        e["published_at"] ? <Box>
                                                                <Box>公開済み</Box>
                                                                <Box>{new Date(e["published_at"]).toLocaleString()}</Box></Box> :
                                                            "下書き"
                                                    }
                                                </Box>
                                            </Center>
                                        </Center>
                                    }
                                    {
                                        fields.map((i,j)=>{
                                            const fs = rawFields[params.id !== undefined ? params.id : ""]
                                            return <Center
                                                style={{
                                                    //overflow: "hidden",
                                                    backgroundColor:"white",
                                                    ...unionCellCss,
                                                    width:`calc( 100% / ${rawFields[String(params.id)].length+1})`,
                                                    borderRadius: (()=>{
                                                        if(j === fs.length-1){
                                                            return "0px 5px 5px 0px"
                                                        }
                                                        return ""
                                                    })(),
                                                    borderTop: "1px solid #e7e7e7",
                                                    borderBottom: "1px solid #e7e7e7",
                                                    borderRight: j === fs.length-1 ? "1px solid #e7e7e7" : "",
                                                    fontWeight:"normal",
                                                    minHeight:"60px",
                                                    paddingRight:5,
                                                    paddingLeft:5,
                                                }}>
                                                <Box overflow="hidden">
                                                    {
                                                        (typeof e[i.field_name]) === "object" ? (()=>{
                                                            const r = (e[i.field_name] as string[])
                                                            if(r && r.length > 0){
                                                                return <chakra.ul>
                                                                    {
                                                                        r.map(i=><chakra.li style={{listStyleType:"disc"}}>・{i}</chakra.li>)
                                                                    }
                                                                </chakra.ul>
                                                            }
                                                            return ""
                                                        })() : <Box>
                                                            <chakra.p style={{maxHeight:"100px"}} fontWeight="">
                                                                {String(e[i.field_name] ? e[i.field_name] : "")}
                                                            </chakra.p></Box>
                                                    }
                                                </Box>
                                            </Center>
                                        })
                                    }
                                </Flex>
                            }
                        }/>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box> : <></>
}
export default ContentsList
