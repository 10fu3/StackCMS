// ログイン機能
import {API_LOC} from "../const";
import {AuthResult, Profile} from "../component/auth/types";

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
        const j:Profile = await r.json()
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
export async function logout() {
    const sendLogout = async ()=>{
        const header = new Headers()
        const auth = localStorage.getItem('authorization')
        if (auth == null){
            return
        }
        header.set("authorization",auth)
        const r = await fetch(API_LOC+"auth/logout",{
            method:"POST",
            headers:header,
            mode:"cors"
        })
        if(!r.ok){
            alert("ログアウトに失敗しました")
            return
        }
        localStorage.removeItem('authorization')
    }
    sendLogout()
}
