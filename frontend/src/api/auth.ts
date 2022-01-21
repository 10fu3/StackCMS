// ログイン機能
import {API_LOC} from "../const";
import {AuthResult} from "../component/auth/types";
import {User} from "../model/model";


export async function existsAuthCredential(){

    const header = new Headers()
    const auth = localStorage.getItem('authorization')
    if (!auth){
        return null
    }
    header.set("authorization",auth);

    const r = await fetch(API_LOC+"auth/me",{
        method:"GET",
        mode:"cors",
        headers:header
    })
    if(r.ok){
        const j:User = await r.json()
        return j
    }
    return null
}

export async function login(mail?:string, password?:string) {
    let profile = await existsAuthCredential()

    if (profile){
        return profile
    }

    const sendLoginInfo = async () =>{
        const r = await fetch(API_LOC+"auth/login",{
            method:"POST",
            body: JSON.stringify({
                mail:mail,
                password:password
            }),
            mode:"cors"
        })
        if (r.ok){
            const j:AuthResult = await r.json()
            localStorage.removeItem('authorization')
            localStorage.setItem('authorization',j.authorization)
            return j.profile
        }
        return null
    }
    return sendLoginInfo()
}

// ログイン機能
export async function logout(): Promise<boolean> {
    const sendLogout = async ()=>{
        const header = new Headers()
        const auth = localStorage.getItem('authorization')
        if (auth == null){
            return false
        }
        header.set("authorization",auth)
        const r = await fetch(API_LOC+"auth/logout",{
            method:"POST",
            headers:header,
            mode:"cors"
        })
        localStorage.removeItem('authorization')
        return r.ok
    }
    return sendLogout()
}
