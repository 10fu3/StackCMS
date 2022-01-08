import {Role, User} from "../model/model";
import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {CMSApi} from "../api/cms";

const initialState:Role[] = []

export const getRoles = (state:{ roles:Role[] }):Role[] => {
    return state.roles.map((e,i)=>e)
}

export function setRoles(){
    return function(dispatch:Dispatch) {
        (async ()=>{
            const roles = await CMSApi.getRoles()
            dispatch(slice.actions.setRoles(roles));
        })()
    }
}

const slice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setRoles: (state, action) => {
            return [
                ...action.payload
            ];
        },
    },
});
export default slice.reducer;
