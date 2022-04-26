import {HamburgerIcon, LockIcon, ViewIcon} from "@chakra-ui/icons";
import React from "react";
import {Api, ClientEntity, Role, User} from "../model/model";
import {Navigate} from "react-router-dom";

interface State {
    apis:Api[]|undefined
    roles:Role[]|undefined
    users: User[]|undefined
    clients: ClientEntity[]|undefined
}

export interface ListContent{
    id:string,
    title:string,
    icon?: React.ReactNode,
}

export interface ListItem{
    title:string,
    item: ListContent[],
    onAdd?: ()=>React.ReactNode
}

export const getDisplay: (state:State)=>{[id:string]:ListItem}|undefined = (state:State) => {
    if (!state.users || !state.apis || !state.roles || !state.clients){
        return undefined
    }
    return {
        "api":{
            title: "コンテンツ(API)",
            item: (()=>{
                return state.apis.map(i => {
                    return {id: i.api_id,title: i.api_id} as ListContent
                })
            })(),
            onAdd: () => {
                return <Navigate to="create"/>
            }
        },
        "manage":{
            title:"権限管理",
            item: [
                {
                    title: (()=>{
                        return `${state.users.length}人のメンバー`
                    })(),
                    id: "member",
                    icon: <ViewIcon/>
                },{
                    title: (()=>{
                        return `${state.roles.length}個のロール`
                    })(),
                    id: "role",
                    icon: <LockIcon/>
                },{
                    title: (()=>{
                        return `${state.clients.length}個のクライアント`
                    })(),
                    id: "client",
                    icon: <HamburgerIcon/>
                }
            ]
        }
    }
}
