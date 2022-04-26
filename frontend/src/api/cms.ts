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
                    try{
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
                    }catch(e){
                        return undefined
                    }
                },
                getAll: async () => {
                    try{
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
                    }catch(e){
                        return undefined
                    }
                },
                delete: async (api_id:string)=>{
                    try{
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
                    }catch(e){
                        return undefined
                    }
                },
                update: (()=>{
                    return {
                        Preview: async (api_id:string,url?:string)=>{
                            try{
                                const k = localStorage.getItem("authorization");
                                const r = (await fetch(API_LOC()+`define/${api_id}/preview`,{
                                    headers: new Headers({
                                        authorization: k ? k : ""
                                    }),
                                    method: "PATCH",
                                    body: JSON.stringify(url ? {
                                        preview_url: url
                                    } : {})
                                }))
                                if (r.status === 401){
                                    return undefined
                                }
                                return r.ok
                            }catch(e){
                                return undefined
                            }
                        },
                        ApiId: async(api_id:string,changedName:string) =>{
                            try{
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
                            }catch(e){
                                return undefined
                            }
                        },
                        ApiField: async (api_id:string,appliedApi:ApplyApiData) => {
                            try{
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
                            }catch(e){
                                return undefined
                            }
                        }
                    }
                })(),
                getFields: async (api_id:string) => {
                    try{
                        const k = localStorage.getItem("authorization")
                        if(k === null){
                            return []
                        }
                        const r = (await fetch(API_LOC()+`define/${api_id}`,{
                            headers: new Headers({authorization:k})
                        }))
                        if (r.status === 401){
                            return []
                        }
                        if (r.ok){
                            return (await r.json()) as FieldType[]
                        }
                        return []
                    }catch(e){
                        return []
                    }
                }
            }
        })(),
        Clients: (()=>{
            return {
                create: async (name:string)=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                update: (()=>{
                    return {
                        ability: async (client_id:string,abilities: string[])=>{
                            try{
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
                            }catch (e){
                                return undefined
                            }
                        },
                        name: async (client_id:string,name:string)=>{
                            try{
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
                            }catch (e){
                                return undefined
                            }
                        },
                        secret: async (client_id:string)=>{
                            try{
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
                            }catch (e){
                                return undefined
                            }
                        }
                    }
                })(),
                getAll: async ()=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                getByClientId: async (id:string)=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                delete: async (clientId:string)=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
            }
        })(),
        Content: (()=>{
            return {
                create: async (api_id:string, contents:{[id:string]:any})=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                update: async (api_id:string,contentsId:string, contents:{[id:string]:any})=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                getByApiId: async (api_id:string) => {
                    try{
                        const k = localStorage.getItem("authorization")
                        if(k === null){
                            return []
                        }
                        const url = new URL(API_LOC()+`contents/${api_id}`)
                        url.searchParams.append('depth','0')
                        url.searchParams.append('orders','-created_at')
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
                    }catch (e){
                        return undefined
                    }
                },
                getByContentId: async (api_id:string,content_id:string) => {
                    try{
                        const k = localStorage.getItem("authorization")
                        if(k === null){
                            return []
                        }
                        const url = new URL(API_LOC()+`contents/${api_id}/${content_id}`)
                        url.searchParams.append('depth','0')
                        url.searchParams.append('draft','true')

                        const r = (await fetch(url.toString(),{
                            headers: new Headers({
                                authorization:k
                            })
                        }))
                        if (r.ok){
                            const d = await r.json()
                            const result = (d as {[key:string]:any});
                            if(result) {
                                return result
                            }
                        }
                        if (r.status === 401){
                            return undefined
                        }
                        return []
                    }catch (e){
                        return undefined
                    }
                },
                deleteByApi: async (api_id:string) => {
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                deleteById: async(api_id:string,contentsId:string)=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                changePublishStatus: async (isPublish:boolean,api_id:string,contentsId:string) =>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                }
            }
        })(),
        User: (()=>{
            return {
                getAll: async ()=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                create: async (mail:string,name:string,password:string)=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                update: async (id:string,user:UpdateUserEntity)=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                delete: async (id:string) => {
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
            }
        })(),
        Role: (()=>{
            return {
                create: async (name:string)=> {
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                update: async (role_id:string,role_name:string,applyPermission:string[])=>{
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                get: async ()=> {
                    try{
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
                    }catch (e){
                        return undefined
                    }
                },
                delete: async (id:string) => {
                    try{
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
                    }catch (e){
                        return undefined
                    }
                }
            }
        })()
    }
})()
