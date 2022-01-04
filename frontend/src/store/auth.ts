import {createSlice, Dispatch,applyMiddleware} from "@reduxjs/toolkit";
import {API_LOC} from "../const";
import {AuthResult, Message, Profile} from "../component/auth/types";
import {login, logout} from "../api/auth";
import {setApis} from "./apis";
import store from "./index";

const initialState:{auth:Profile|null} = {
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
            state.auth = Object.assign({

            },{nickName: action.payload.nick_name},{
                id: action.payload.id
            },{
                nick_name: action.payload.nick_name
            })
        }
    },
});

export default slice.reducer;

// 認証済みか確認するセレクター
export const isAuthSelector = (state:{auth:{auth:Profile|null}}) => {
    return state.auth.auth !== null
};

export const getProfile = (state:{auth:{auth:Profile|null}}) => {
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

