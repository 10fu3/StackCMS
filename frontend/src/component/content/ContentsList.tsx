import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Flex, Spacer, Table} from "@chakra-ui/react";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {CSSProperties, useEffect, useState} from "react";
import {getContents, setContents} from "../../store/contents";
import {useSelector} from "react-redux";
import {getFields} from "../../store/fields";
import {ContentMeta, FieldType} from "../../model/model";
import {toJapaneseFromFieldType} from "../../api/cms";
import store from "../../store";
import apis, {getApis} from "../../store/apis";

const ContentsList = ()=>{

    const params = useParams<"id">()

    const rawFields = useSelector(getFields)

    const apis = useSelector(getApis)

    const [fields,setFields] = useState<FieldType[]>([])

    const nav = useNavigate()

    const unionCellCss:CSSProperties = {
        padding:20,
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
        setFields(inputs)
    },[rawFields])

    return rawFields[params.id ? params.id : ""] ? <Box w={"100%"} h={"100vh"}>
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
            <Box w="100%" pt="10px" pb="20px" pl={5} pr={5} overflow="auto" h={"100%"}>
                <Box w="100%">
                    <chakra.table style={{width:"100%",tableLayout:"fixed"}}>
                        <chakra.thead style={{width:"100%"}}>
                        <chakra.tr>
                            <chakra.th style={{padding:10,width:`calc( 100%/ ${rawFields[String(params.id)].length+1})`}}>
                                <Box>
                                    ステータス
                                </Box>
                            </chakra.th>
                            {
                                fields.map((e)=>{
                                    return <chakra.th style={{padding:10,width:`calc( 100%/ ${rawFields[String(params.id)].length}+1)`}}>
                                        <Box>
                                            {
                                                e.field_name
                                            }
                                        </Box>
                                        <Box color="#777">
                                            {
                                                (()=> {
                                                    if (!(e.type === "relation" && e.relation_api)) {
                                                        return <Box>
                                                            {toJapaneseFromFieldType(e.type)}
                                                        </Box>
                                                    }
                                                    return e.relation_api ? <Center>
                                                        <Flex>
                                                            参照先: <Link to={'/api/' + e.relation_api}>
                                                            <Box textDecoration="underline">
                                                                {
                                                                    e.relation_api
                                                                }
                                                            </Box>
                                                        </Link>
                                                        </Flex>
                                                    </Center> : <></>
                                                })()
                                            }
                                        </Box>
                                    </chakra.th>
                                })
                            }
                        </chakra.tr>
                        </chakra.thead>
                    </chakra.table>
                    <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 10px",tableLayout:"fixed"}}>
                        <tbody style={{width:"100%"}}>
                        {
                            contents ? contents.map((e,j)=>{
                                return <tr
                                    onClick={()=>{
                                        nav(`/api/${params.id}/${e["_id"]}`)
                                    }}
                                    style={{
                                        width:"100%",
                                        cursor:"pointer"
                                    }}>
                                    {
                                        <th style={{
                                            backgroundColor:"white",
                                            width:`calc( 100% / ${rawFields[String(params.id)].length+1})`,
                                            borderRadius:"5px 0 0 5px",
                                            borderTop: "1px solid #e7e7e7",
                                            borderBottom: "1px solid #e7e7e7",
                                            borderLeft: "1px solid #e7e7e7",
                                            borderRight: "0px",
                                            borderWidth: 1
                                        }}>
                                            <Center>
                                                <Box pl={3} borderLeft={`5px solid ${e["published_at"] ? "#008a74" : "#0087ff"}`}>
                                                    {
                                                        e["published_at"] ? <Box>
                                                            <Box>公開済み</Box>
                                                            <Box>{new Date(e["published_at"]).toLocaleString()}</Box></Box> :
                                                            "下書き"
                                                    }
                                                </Box>
                                            </Center>
                                        </th>
                                    }
                                    {
                                        rawFields[params.id !== undefined ? params.id : ""].map((i,j)=>{
                                            const fs = rawFields[params.id !== undefined ? params.id : ""]
                                            return <chakra.th
                                                style={{
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
                                                    fontWeight:"normal"
                                                }}>
                                                {
                                                    (typeof e[i.field_name]) === "object" ? (()=>{
                                                        const r = (e[i.field_name] as ContentMeta[])
                                                        console.log(r)
                                                        if(r && r.length > 0){
                                                            return <ul>
                                                                {
                                                                    r.map(i=> i && i._id ? <li>{i._id}</li> : <Box/>)
                                                                }
                                                            </ul>
                                                        }
                                                        return ""
                                                    })() : <Box><chakra.p fontWeight="">{e[i.field_name]}</chakra.p></Box>
                                                }
                                            </chakra.th>
                                        })
                                    }
                                </tr>
                            }) : <></>
                        }
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    </Box> : <></>
}
export default ContentsList
