import {API_LOC} from "../const";
import {Api, ApplyApiData, ClientEntity, FieldType, Role, UpdateUserEntity, User} from "../model/model";


interface JsonResultArray{
    contents: {[key:string]:any}[]
}

export function toJapaneseFromFieldType(f: string) {
    switch (f) {
        case "string":
            return "テキスト型"
        case "number":
            return "数値型"
        case "boolean":
            return "真偽値型"
        case "date":
            return "日付"
        case "relation":
            return "参照型"
    }
    return "オブジェクト型"
}

export const CMSApi = (()=>{
    return {
        Api: (()=>{
            return {
                create: async (api:ApplyApiData)=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`define`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "POST",
                        body: JSON.stringify(api)
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                getAll: async () => {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return []
                    }

                    const r = (await fetch(API_LOC()+"define/all",{
                        headers: new Headers({
                            authorization:k
                        })
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return (await r.json())
                },
                delete: async (api_id:string)=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`define/${api_id}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "DELETE",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                update: (()=>{
                    return {
                        Preview: async (api_id:string,changedName?:string)=>{
                            const k = localStorage.getItem("authorization");
                            const r = (await fetch(API_LOC()+`define/${api_id}/preview_url`,{
                                headers: new Headers({
                                    authorization: k ? k : ""
                                }),
                                method: "PATCH",
                                body: JSON.stringify(changedName ? {
                                    preview_url: changedName
                                } : {})
                            }))
                            if (r.status === 401){
                                return undefined
                            }
                            return r.ok
                        },
                        ApiId: async(api_id:string,changedName:string) =>{
                            const k = localStorage.getItem("authorization");
                            const r = (await fetch(API_LOC()+`define/${api_id}/name`,{
                                headers: new Headers({
                                    authorization: k ? k : ""
                                }),
                                method: "PATCH",
                                body: JSON.stringify({
                                    api_name: changedName
                                })
                            }))
                            if (r.status === 401){
                                return undefined
                            }
                            return r.ok
                        },
                        ApiField: async (api_id:string,appliedApi:ApplyApiData) => {
                            const k = localStorage.getItem("authorization");
                            const r = (await fetch(API_LOC()+`define/${api_id}/field`,{
                                headers: new Headers({
                                    authorization: k ? k : ""
                                }),
                                method: "PATCH",
                                body: JSON.stringify(appliedApi)
                            }))
                            if (r.status === 401){
                                return undefined
                            }
                            return r.ok
                        }
                    }
                })(),
                getFields: async (api_id:string) => {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return []
                    }
                    const r = (await fetch(API_LOC()+`define/${api_id}`,{
                        headers: new Headers({authorization:k})
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    if (r.ok){
                        return (await r.json()) as FieldType[]
                    }
                    return []
                }
            }
        })(),
        Clients: (()=>{
            return {
                create: async (name:string)=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`client`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "POST",
                        body: JSON.stringify({
                            client_name:name,
                        })
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                update: (()=>{
                    return {
                        ability: async (client_id:string,abilities: string[])=>{
                            const k = localStorage.getItem("authorization");
                            const r = (await fetch(API_LOC()+`client/${client_id}/permissions`,{
                                headers: new Headers({
                                    authorization: k ? k : ""
                                }),
                                method: "PATCH",
                                body: JSON.stringify({
                                    client_ability: abilities
                                })
                            }))
                            if (r.status === 401){
                                return undefined
                            }
                            return r.ok
                        },
                        name: async (client_id:string,name:string)=>{
                            const k = localStorage.getItem("authorization");
                            const r = (await fetch(API_LOC()+`client/${client_id}/name`,{
                                headers: new Headers({
                                    authorization: k ? k : ""
                                }),
                                method: "PATCH",
                                body: JSON.stringify({
                                    client_name:name,
                                })
                            }))
                            if (r.status === 401){
                                return undefined
                            }
                            return r.ok
                        },
                        secret: async (client_id:string)=>{
                            const k = localStorage.getItem("authorization");
                            const r = (await fetch(API_LOC()+`client/${client_id}/secret`,{
                                headers: new Headers({
                                    authorization: k ? k : ""
                                }),
                                method: "PATCH",
                            }))
                            if (r.status === 401){
                                return undefined
                            }
                            return r.ok
                        }
                    }
                })(),
                getAll: async ()=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`client`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "GET",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return ((await r.json()) as ClientEntity[])
                },
                getByClientId: async (id:string)=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`client/${id}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "GET",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return ((await r.json()) as ClientEntity)
                },
                delete: async (clientId:string)=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`client/${clientId}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "DELETE"
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
            }
        })(),
        Content: (()=>{
            return {
                create: async (api_id:string, contents:{[id:string]:any})=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`contents/${api_id}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "POST",
                        body: JSON.stringify(contents)
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                update: async (api_id:string,contentsId:string, contents:{[id:string]:any})=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`contents/${api_id}/${contentsId}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "PATCH",
                        body: JSON.stringify(contents)
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                getByApiId: async (api_id:string) => {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return []
                    }
                    const url = new URL(API_LOC()+`contents/${api_id}`)
                    url.searchParams.append('draft','true')

                    const r = (await fetch(url.toString(),{
                        headers: new Headers({
                            authorization:k
                        })
                    }))
                    if (r.ok){
                        const d = await r.json()
                        const result = (d as JsonResultArray).contents;
                        if(result) {
                            return result
                        }
                    }
                    if (r.status === 401){
                        return undefined
                    }
                    return []
                },
                deleteByApi: async (api_id:string) => {
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`contents/${api_id}/all`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "DELETE",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                deleteById: async(api_id:string,contentsId:string)=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`contents/${api_id}/${contentsId}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "DELETE",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                changePublishStatus: async (isPublish:boolean,api_id:string,contentsId:string) =>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`meta/${api_id}/${contentsId}/status`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "PATCH",
                        body: JSON.stringify({
                            status: isPublish ? "published" : "unpublished"
                        })
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                }
            }
        })(),
        User: (()=>{
            return {
                getAll: async ()=>{
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return []
                    }
                    const r = (await fetch(API_LOC()+`user`,{
                        headers: new Headers({authorization:k})
                    }))
                    if(r.status === 401){
                        return undefined
                    }
                    if (r.ok){
                        return (await r.json()) as User[]
                    }
                    return []
                },
                create: async (mail:string,name:string,password:string)=>{
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return false
                    }

                    const r = (await fetch(API_LOC()+"user",{
                        headers: new Headers({
                            authorization:k
                        }),
                        method:"post",
                        body: JSON.stringify({
                            nick_name: name,
                            mail: mail,
                            password: password
                        })
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                update: async (id:string,user:UpdateUserEntity)=>{
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return false
                    }

                    let reqBody:{[key:string]:any} = {}

                    reqBody["nick_name"] = user.nick_name
                    reqBody["mail"] = user.mail
                    reqBody["roles"] = user.role
                    if(reqBody.password){
                        reqBody["password"] = user.password
                    }

                    const r = (await fetch(API_LOC()+`user/${id}`,{
                        headers: new Headers({
                            authorization:k
                        }),
                        method:"PATCH",
                        body: JSON.stringify(reqBody)
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                delete: async (id:string) => {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return false
                    }

                    const r = (await fetch(API_LOC()+`user/${id}`,{
                        headers: new Headers({
                            authorization:k
                        }),
                        method:"delete",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
            }
        })(),
        Role: (()=>{
            return {
                create: async (name:string)=> {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return false
                    }

                    const r = (await fetch(API_LOC()+"role",{
                        headers: new Headers({
                            authorization:k
                        }),
                        method:"post",
                        body: JSON.stringify({
                            role_name: name
                        })
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                update: async (role_id:string,role_name:string,applyPermission:string[])=>{
                    const k = localStorage.getItem("authorization");
                    const r = (await fetch(API_LOC()+`role/${role_id}`,{
                        headers: new Headers({
                            authorization: k ? k : ""
                        }),
                        method: "PATCH",
                        body: JSON.stringify({
                            role_name: role_name,
                            role_ability: applyPermission
                        })
                    }))
                    if(r.status === 401){
                        return undefined
                    }
                    return r.ok
                },
                get: async ()=> {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return []
                    }
                    const r = (await fetch(API_LOC()+`role/all`,{
                        headers: new Headers({authorization:k})
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    if (r.ok){
                        return (await r.json()) as Role[]
                    }
                    return []
                },
                delete: async (id:string) => {
                    const k = localStorage.getItem("authorization")
                    if(k === null){
                        return false
                    }

                    const r = (await fetch(API_LOC()+`role/${id}`,{
                        headers: new Headers({
                            authorization:k
                        }),
                        method:"delete",
                    }))
                    if (r.status === 401){
                        return undefined
                    }
                    return r.ok
                }
            }
        })()
    }
})()
