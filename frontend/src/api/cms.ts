import {API_LOC} from "../const";
import {Api, ApplyApiData, FieldType, Role, UpdateUserEntity, User} from "../model/model";


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

export class CMSApi{

    static async deleteUser(id:string):Promise<undefined|boolean>{
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
    }

    static async updateUser(id:string,user:UpdateUserEntity):Promise<undefined|boolean>{
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
    }

    static async createUser(mail:string,name:string,password:string):Promise<undefined|boolean>{
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
    }

    static async createRole(name:string): Promise<undefined|boolean> {
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
    }

    static async deleteRole(id:string): Promise<undefined|boolean> {
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

    static async getApis():Promise<undefined|Api[]> {

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
    }

    static async getContent(api_id:string):Promise<undefined|{[key:string]:any}[]> {
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
    }

    static async deleteContentsByApi(api_id:string): Promise<undefined|boolean>{
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
    }

    static async deleteApi(api_id:string): Promise<undefined|boolean>{
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
    }

    static async createContents(api_id:string, contents:{[id:string]:any}): Promise<undefined|boolean>{
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
    }

    static async deleteContents(api_id:string,contentsId:string): Promise<undefined|boolean>{
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
    }

    static async updateContents(api_id:string,contentsId:string, contents:{[id:string]:any}): Promise<undefined|boolean>{
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
    }

    static async changePublishStatus(isPublish:boolean,api_id:string,contentsId:string): Promise<undefined|boolean>{
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

    static async createApi(api:ApplyApiData): Promise<undefined|boolean>{
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
    }

    static async updateApiPreview(api_id:string,changedName?:string): Promise<undefined|boolean>{
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
    }

    static async updateApiId(api_id:string,changedName:string): Promise<undefined|boolean>{
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
    }

    static async updateApiField(api_id:string,appliedApi:ApplyApiData): Promise<undefined|boolean>{
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

    // static async updateApi(api_id:string,appliedApi:ApplyApiData): Promise<undefined|boolean>{
    //     const k = localStorage.getItem("authorization");
    //     const r = (await fetch(API_LOC()+`define/${api_id}`,{
    //         headers: new Headers({
    //             authorization: k ? k : ""
    //         }),
    //         method: "PATCH",
    //         body: JSON.stringify(appliedApi)
    //     }))
    //     if (r.status === 401){
    //         return undefined
    //     }
    //     return r.ok
    // }

    static async getFields(api_id:string): Promise<undefined|FieldType[]>{
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

    static async getRoles(): Promise<undefined|Role[]>{
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
    }

    static async updateRole(role_id:string,role_name:string,applyPermission:string[]): Promise<undefined|boolean>{
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
    }

    static async getUsers(): Promise<undefined|User[]>{
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
    }
}
