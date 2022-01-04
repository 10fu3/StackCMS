import {API_LOC} from "../const";
import {Api, FieldType, Role, User} from "../model/model";

interface JsonResult{
    content: {[key:string]:any}[]
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
            return (await r.json()) as Api[]
        }
        return []
    }

    static async getContent(api_id:string):Promise<{[key:string]:any}[]> {
        const k = localStorage.getItem("authorization")
        if(k === null){
            return []
        }
        const r = (await fetch(API_LOC+`contents/${api_id}`,{
            headers: new Headers({
                authorization:k
            })
        }))
        if (r.ok){
            const result = ((await r.json()) as JsonResult).content;
            console.log(result)
            return result
        }
        return []
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
