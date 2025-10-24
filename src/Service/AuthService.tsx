import { postRequest } from "./Apiservice"

export const LoginPost=(data:any)=>{
    return postRequest('/auth/login',data)
}