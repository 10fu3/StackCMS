import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {Api, FieldType, Role} from "../model/model";
import {CMSApi} from "../api/cms";

const initialState:Api[] = []

export const getApis = (state:{ apis:Api[] }):Api[] => {
    return state.apis.map((e,i)=>e)
}

export function setApis(){
    return function(dispatch:Dispatch) {
        (async ()=>{
            dispatch(slice.actions.setApis(await CMSApi.Api.getAll()));
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
            return [
                ...action.payload
            ];
        },
    },
});

export default slice.reducer;
