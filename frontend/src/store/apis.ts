import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {Api} from "../model/model";
import {CMSApi} from "../api/cms";

const initialState:Api[] = []

export const getApis = (state:{ apis:Api[] }):Api[] => {
    return state.apis.map((e,i)=>e)
}

export function setApis(){
    return function(dispatch:Dispatch) {
        (async ()=>{
            let d : Api[] = await CMSApi.Api.getAll()
            if(!d.length){
               d = []
            }
            dispatch(slice.actions.setApis(d));
        })()
    }
}

const slice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setApis: (state, action) => {
            if(!action.payload){
                return undefined
            }
            if(action.payload["message"]){
                return []
            }
            return [
                ...action.payload
            ];
        },
    },
});

export default slice.reducer;
