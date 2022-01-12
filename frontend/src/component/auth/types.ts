import {User} from "../../model/model";

export interface AuthResult{
    authorization: string,
    profile: User
}

export interface Message{
    message: string
}
