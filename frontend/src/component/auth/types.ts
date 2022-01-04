export interface Profile{
    id:string,
    nick_name:string
}

export interface AuthResult{
    authorization: string,
    profile: Profile
}

export interface Message{
    message: string
}
