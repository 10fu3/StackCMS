import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {CMSApi} from "../api/cms";
import {ClientEntity} from "../model/model";

const initialState:ClientEntity[] = []

export const getClients = (state:{ clients:ClientEntity[] }):ClientEntity[] => {
    return state.clients.map((e,i)=>e)
}

export function setClients(){
    return function(dispatch:Dispatch) {
        (async ()=>{
            dispatch(slice.actions.setClients(await CMSApi.Clients.getAll()));
        })()
    }
}

export function setClientById(id:string){
    return function(dispatch:Dispatch) {
        (async ()=>{
            dispatch(slice.actions.setClientById(await CMSApi.Clients.getByClientId(id)));
        })()
    }
}

const slice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setClients: (state, action) => {
            if(!action.payload){
                return []
            }
            return [
                ...action.payload
            ];
        },
        setClientById: (state,action)=>{
            if(!action.payload){
                return state
            }

            return state.map(i=>{
                if (i.client_id === action.payload["client_id"]){
                    return Object.assign({},action.payload)
                }
                return i
            })
        }
    },
});

export default slice.reducer;
