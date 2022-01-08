import {API_LOC} from "../const";
import {Api, ApplyApiData, FieldType, Role, User} from "../model/model";


interface JsonResultArray{
    content: {[key:string]:any}[]
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

    static async getApis():Promise<Api[]> {

        const k = localStorage.getItem("authorization")
        if(k === null){
            return []
        }

        const r = (await fetch(API_LOC+"define/all",{
            headers: new Headers({
                authorization:k
            })
        }))
        if (r.ok){
            return ((await r.json()) as Api[])
        }
        return []
    }

    static async getContent(api_id:string):Promise<{[key:string]:any}[]> {
        const k = localStorage.getItem("authorization")
        if(k === null){
            return []
        }
        const url = new URL(API_LOC+`contents/${api_id}`)
        url.searchParams.append('draft','true')

        const r = (await fetch(url.toString(),{
            headers: new Headers({
                authorization:k
            })
        }))
        if (r.ok){
            const d = await r.json()
            const result = (d as JsonResultArray).content;
            if(result) {
                return result
            }
        }
        return []
    }

    static async createContents(api_id:string, contents:{[id:string]:any}): Promise<boolean>{
        const k = localStorage.getItem("authorization");
        return (await fetch(API_LOC+`contents/${api_id}`,{
            headers: new Headers({
                authorization: k ? k : ""
            }),
            method: "POST",
            body: JSON.stringify(contents)
        })).ok
    }

    static async deleteContents(api_id:string,contentsId:string): Promise<boolean>{
        const k = localStorage.getItem("authorization");
        return (await fetch(API_LOC+`contents/${api_id}/${contentsId}`,{
            headers: new Headers({
                authorization: k ? k : ""
            }),
            method: "DELETE",
        })).ok
    }

    static async updateContents(api_id:string,contentsId:string, contents:{[id:string]:any}): Promise<boolean>{
        const k = localStorage.getItem("authorization");
        return (await fetch(API_LOC+`contents/${api_id}/${contentsId}`,{
            headers: new Headers({
                authorization: k ? k : ""
            }),
            method: "PATCH",
            body: JSON.stringify(contents)
        })).ok
    }

    static async changePublishStatus(isPublish:boolean,api_id:string,contentsId:string){
        const k = localStorage.getItem("authorization");
        return (await fetch(API_LOC+`meta/${api_id}/${contentsId}/status`,{
            headers: new Headers({
                authorization: k ? k : ""
            }),
            method: "PATCH",
            body: JSON.stringify({
                status: isPublish ? "published" : "unpublished"
            })
        })).ok
    }

    static async createApi(api:ApplyApiData): Promise<boolean>{
        const k = localStorage.getItem("authorization");
        return (await fetch(API_LOC+`define`,{
            headers: new Headers({
                authorization: k ? k : ""
            }),
            method: "POST",
            body: JSON.stringify(api)
        })).ok
    }

    static async updateApi(api_id:string,appliedApi:ApplyApiData): Promise<boolean>{
        const k = localStorage.getItem("authorization");
        return (await fetch(API_LOC+`define/${api_id}`,{
            headers: new Headers({
                authorization: k ? k : ""
            }),
            method: "PATCH",
            body: JSON.stringify(appliedApi)
        })).ok
    }

    static async getFields(api_id:string): Promise<FieldType[]>{
        const k = localStorage.getItem("authorization")
        if(k === null){
            return []
        }
        const r = (await fetch(API_LOC+`define/${api_id}`,{
            headers: new Headers({authorization:k})
        }))
        if (r.ok){
            const result = (await r.json()) as FieldType[]
            return result
        }
        return []
    }

    static async getRoles(): Promise<Role[]>{
        const k = localStorage.getItem("authorization")
        if(k === null){
            return []
        }
        const r = (await fetch(API_LOC+`role/all`,{
            headers: new Headers({authorization:k})
        }))
        if (r.ok){
            const result = (await r.json()) as Role[]
            return result
        }
        return []
    }

    static async getUsers(): Promise<User[]>{
        const k = localStorage.getItem("authorization")
        if(k === null){
            return []
        }
        const r = (await fetch(API_LOC+`user`,{
            headers: new Headers({authorization:k})
        }))
        if (r.ok){
            const result = (await r.json()) as User[]
            return result
        }
        return []
    }
}
