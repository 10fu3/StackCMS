import {Api, FieldType} from "../model/model";

export const getFields = (state:{ apis:Api[] }): {[id:string]:FieldType[]} => {
    let r: {[id:string]:FieldType[]} = {}
    for (const api of state.apis) {
        r[String(api.api_id)] = api.fields
    }
    return r
}
