import {LockIcon, ViewIcon} from "@chakra-ui/icons";
import React from "react";
import {Api, Role, User} from "../model/model";

interface State {
    apis:Api[]
    roles:Role[]
    users: User[]
}

export interface ListContent{
    id:string,
    title:string,
    icon?: React.ReactNode,
}

export interface ListItem{
    title:string,
    item: ListContent[],
    onAdd?: ()=>void
}

export const getDisplay: (state:State)=>{[id:string]:ListItem} = (state:State) => {
    return {
        "api":{
            title: "コンテンツ(API)",
            item: state.apis.map(i => {
                return {id: i.api_id,title: i.api_id} as ListContent
            }),
            onAdd: () => {

            }
        },
        "manage":{
            title:"権限管理",
            item: [
                {
                    title: `${state.users.length}人のメンバー`,
                    id: "member",
                    icon: <ViewIcon/>
                },{
                    title: `${state.roles.length}個のロール`,
                    id: "role",
                    icon: <LockIcon/>
                }
            ]
        }
    }
}
