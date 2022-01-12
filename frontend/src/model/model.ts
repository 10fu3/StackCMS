export interface FieldType{
    id:string,
    field_name:string,
    api_id:string,
    type:string,
    relation_api?:string
}

export interface RelationField extends FieldType{
    id:string
    field_name:string
    api_id:string
    type:string
    relation_api?:string
}

export interface NormalField extends FieldType{
    id:string
    field_name:string
    api_id:string
    type:string
}

export interface Role{
    is_lock:boolean
    id:string
    name: string
    abilities: {[id:string]:{[id:string]:string[]}}
}

export interface Api{
    unique_id:string
    api_id: string
    is_single: boolean
    fields: FieldType[]
}

export interface ApplyApiData {
    api_id?: string
    is_single?: boolean
    fields: FieldType[]
}

export interface User{
    is_lock:boolean
    user_id:string
    nick_name:string
    mail:string
    roles: Role[]
}

export interface ContentMeta{
    _id:string
    api_id:string
    created_at:string
    updated_at:string
    published_at:string
    revised_at:string
    created_by:string
    updated_by:string
    publish_will:string
    stop_will:string
}
