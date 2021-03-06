export interface ClientEntity{
    client_id:string,
    client_name:string,
    client_secret:string,
    client_ability?:string[],
}

export interface FieldType{
    id:string,
    field_name:string,
    api_id:string,
    type:string,
    relation_api?:string
    priority: number
}

export interface UpdateUserEntity {
    nick_name: string,
    mail: string,
    password?: string,
    role: string[]
}

// export interface RelationField extends FieldType{
//     id:string
//     field_name:string
//     api_id:string
//     type:string
//     relation_api?:string
//     priority: number
// }

export interface NormalField extends FieldType{
    id:string
    field_name:string
    api_id:string
    type:string
    priority: number
}

export interface Role{
    is_lock:boolean
    id:string
    name: string
    abilities: {[id:string]:{[id:string]:string[]}}
}

export interface Api{
    preview_url:string
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
    draft_key?:string
}
