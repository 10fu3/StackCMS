export const API_LOC = ()=>{
    return process.env.REACT_APP_API ? process.env.REACT_APP_API : "http://localhost:8080/api/v1/"
}
