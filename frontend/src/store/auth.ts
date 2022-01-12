import {createSlice, Dispatch,applyMiddleware} from "@reduxjs/toolkit";
import {API_LOC} from "../const";
import {AuthResult, Message} from "../component/auth/types";
import {login, logout} from "../api/auth";
import {setApis} from "./apis";
import store from "./index";
import {Role, User} from "../model/model";

const initialState:{auth:User|null} = {
    auth: null
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            if (action.payload == null){
                state.auth = null
                return
            }
            state.auth = Object.assign({},{
                is_lock: action.payload.is_lock,
                user_id: action.payload.user_id,
                nick_name:action.payload.nick_name,
                mail:action.payload.mail,
                roles: action.payload.roles,
            })
        }
    },
});

export default slice.reducer;

// 認証済みか確認するセレクター
export const isAuthSelector = (state:{auth:{auth:User|null}}) => {
    if(state.auth.auth){
        return true
    }
    return false
};

export const isLoggedIn = async ()=>{

}

export const getProfile = (state:{auth:{auth:User|null}}) => {
    return state.auth.auth
};

export function setLogin(mail:string,password:string){
    return function(dispatch:Dispatch) {
        (async ()=>{
            const user = await login(mail, password);
            // ログイン後にユーザー情報をストアに格納する
            dispatch(slice.actions.setProfile(user));
        })()
    }
}

export function setLogout(){
    return function(dispatch:Dispatch) {
        (async ()=>{
            logout()
            dispatch(slice.actions.setProfile(null))
        })()
    }
}

export function setCurrentUser() {
    return function(dispatch:Dispatch) {
        (async ()=>{
            try {
                const user = await login();
                dispatch(slice.actions.setProfile(user));
            } catch(err) {
            }
        })()
    }
}

