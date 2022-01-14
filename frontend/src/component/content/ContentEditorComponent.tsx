import {
    chakra, Flex,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Switch,
    Textarea
} from "@chakra-ui/react";
import {Box, Center} from "@chakra-ui/layout";
import React, {CSSProperties, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {CMSApi, toJapaneseFromFieldType} from "../../api/cms";
import {ContentMeta, FieldType} from "../../model/model";
import {useSelector} from "react-redux";
import {getApis} from "../../store/apis";

export interface EditorProps{
    value: any,
    onChange: (value:any) => void
}

export const TextEditor:React.FC<EditorProps> = (props)=>{
    return <Box pt={1}>
        <Textarea value={props.value} onChange={(e)=>{
            props.onChange(e.target.value)
        }} placeholder='ここにテキストをタイプします' />
    </Box>
}

export const BooleanEditor:React.FC<EditorProps> = (props)=>{
    return <Box pt={1}>
        <Switch onClick={(e)=>{props.onChange(e)}} colorScheme="green"/>
    </Box>
}

export const NumberEditor:React.FC<EditorProps> = (props)=>{
    return <Box pt={1}><NumberInput value={props.value} onChange={(e)=>{props.onChange(e)}} placeholder="ここに数字を入力します" defaultValue={0}>
        <NumberInputField />
        <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
        </NumberInputStepper>
    </NumberInput></Box>
}

export const RelationEditor:React.FC<RelationListProps> = (props)=>{
    return <Box pt={1}>
        <chakra.p>参照済みコンテンツ件数: {(props.selected ? props.selected : []).length}</chakra.p>
        <RelationList {...props}/>
    </Box>
}

export interface RelationListProps {
    apiId:string
    onClickItem: (index:number,item:ContentMeta)=>void
    selected: string[]
}

export const RelationList :React.FC<RelationListProps> = (props)=>{

    const [contents,setContents] = useState<{[key:string]:any}[]>([])

    const apis = useSelector(getApis).filter(f=>f.unique_id === props.apiId).filter(f=>f.fields.length > 0)

    const allApis = useSelector(getApis)

    const fields = apis[0].fields.map(i=>{
        let f:FieldType = Object.assign({},i)
        if(!f.relation_api){
            return f
        }
        const as = allApis.filter(a=>{
            return a.unique_id === f.relation_api
        })

        if(as.length > 0){
            f.relation_api = as[0].api_id
        }
        return f
    })

    useEffect(()=>{
        (async ()=>{
            const r = await CMSApi.getContent(apis[0].api_id)
            setContents(r)
        })()
    },[props.apiId])

    const unionCellCss:CSSProperties = {
        padding:20,
        overflow:"hidden",
    }

    return apis.length > 0 ? <Box w="100%">
        <chakra.table style={{width:"100%",tableLayout:"fixed"}}>
            <chakra.thead style={{width:"100%"}}>
                <chakra.tr>
                    <chakra.th style={{padding:10,width:`calc( 100%/ ${fields.length+1})`}}>
                        <Box>
                            ステータス
                        </Box>
                    </chakra.th>
                    {
                        fields.map((e)=>{

                            if(e.relation_api){
                                const a = apis.filter(i=>i.api_id === e.relation_api)
                                if(a && a.length > 0){
                                    e.relation_api = a[0].api_id
                                }
                            }

                            return <chakra.th style={{padding:10,width:`calc( 100%/ ${fields.length}+1)`}}>
                                <Box>
                                    {
                                        e.field_name
                                    }
                                </Box>
                                <Box color="#777">
                                    {
                                        e.type === "relation" && e.relation_api ?
                                            <Center>
                                                <Flex>
                                                    参照先: <Link to={'/api/'+e.relation_api}>
                                                    <Box textDecoration="underline">
                                                        {
                                                            e.relation_api
                                                        }
                                                    </Box>
                                                </Link>
                                                </Flex>
                                            </Center> : <Box>
                                                {toJapaneseFromFieldType(e.type)}
                                            </Box>
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
                            props.onClickItem(j,(e as ContentMeta))
                        }}
                        style={{
                            width:"100%",
                            backgroundColor: (props.selected ? props.selected : []).includes((e as ContentMeta)._id)
                                ? "#f0f9ff"
                                : "white" ,
                            cursor:"pointer",}}>
                        {
                            <th
                                style={{
                                //backgroundColor:"white",
                                width:`calc( 100% / ${fields.length+1})`,
                                borderRadius:"5px 0 0 5px",
                                borderTop: "1px solid #e7e7e7",
                                borderBottom: "1px solid #e7e7e7",
                                borderLeft: "1px solid #e7e7e7",
                                borderRight: "0px",
                                borderWidth: 1
                            }}>
                                <Center>
                                    <Box pl={3} borderLeft={`5px solid ${e["publish_at"] ? "#2cff00" : "#0087ff"}`}>
                                        {
                                            e["publish_at"] ? "公開済み" : "下書き"
                                        }
                                    </Box>
                                </Center>
                            </th>
                        }
                        {
                            fields.map((i,j)=>{

                                return <chakra.th
                                    style={{
                                        //backgroundColor:"white",
                                        ...unionCellCss,
                                        width:`calc( 100% / ${fields.length+1})`,
                                        borderRadius: (()=>{
                                            if(j === fields.length-1){
                                                return "0px 5px 5px 0px"
                                            }
                                            return ""
                                        })(),
                                        borderTop: "1px solid #e7e7e7",
                                        borderBottom: "1px solid #e7e7e7",
                                        borderRight: j === fields.length-1 ? "1px solid #e7e7e7" : "",
                                        fontWeight:"normal"
                                    }}>
                                    {
                                        (typeof e[i.field_name]) === "object" ? (()=>{
                                            const r = (e[i.field_name] as ContentMeta[])
                                            if(r && r.length > 0){
                                                return r.map(i=>i._id ? <Box>{i._id}</Box> : <Box/>)
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
    </Box> : <></>
}
