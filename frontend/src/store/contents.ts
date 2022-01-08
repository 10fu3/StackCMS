import {Api, FieldType, Role} from "../model/model";
import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {CMSApi} from "../api/cms";

interface State {
    contents: {[key:string]:{[key:string]:any}[]}
}

const initialState = {
    contents: []
};

export const getContents = (state:State)=> {
    return (state as {contents:{contents:any[]}}).contents.contents;
}


export function setContents(apiId:string){
    return function(dispatch:Dispatch) {
        (async ()=>{
            const r = await CMSApi.getContent(apiId)
            dispatch(slice.actions.setContents(r));
        })()
    }
}

const slice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setContents: (state, action) => {
            return Object.assign({}, state, { contents: action.payload });
        },
    },
});
export default slice.reducer;
