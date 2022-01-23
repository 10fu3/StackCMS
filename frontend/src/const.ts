export const API_LOC = ()=>{
    return process.env.API ? process.env.API : "http://localhost:8080/api/v1/"
}
