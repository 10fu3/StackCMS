import {User} from "../model/model";
import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {CMSApi} from "../api/cms";

const initialState:User[] = []

export const getUsers = (state:{ users:User[] }):User[] => {
    return state.users.map((e,i)=>e)
}

export function setUsers(){
    return function(dispatch:Dispatch) {
        (async ()=>{
            const users = await CMSApi.User.getAll()
            dispatch(slice.actions.setUsers(users));
        })()
    }
}

const slice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            if(!action.payload){
                return undefined
            }
            return [
                ...action.payload
            ];
        },
    },
});

export default slice.reducer;
