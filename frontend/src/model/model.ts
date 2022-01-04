export interface FieldType{
    field_id:string,
    field_name:string,
    api_id:string,
    type:string,
    relation_api?:string,
}

export interface RelationField extends FieldType{
    field_id:string,
    field_name:string,
    api_id:string,
    type:string,
    relation_api?:string,
}

export interface NormalField extends FieldType{
    field_id:string,
    field_name:string,
    api_id:string,
    type:string,
}

export interface Role{
    id:string
    name: string
    abilities: string[]
}

export interface Api{
    api_id: String,
    isSingleContent: boolean,
    fields: FieldType[]
}

export interface User{
    user_id:string,
    nick_name:string,
    mail:string,
    roles: Role[]
}

export interface ContentMeta{
    _id:string,
    api_id:string,
    created_at:string,
    updated_at:string,
    published_at:string,
    revised_at:string,
    created_by:string,
    updated_by:string,
    publish_will:string,
    stop_will:string,
}
