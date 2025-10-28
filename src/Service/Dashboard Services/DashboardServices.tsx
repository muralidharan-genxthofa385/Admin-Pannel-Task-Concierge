import { getRequest } from "../Apiservice"

export const getDashboarDetails=()=>{
    return getRequest(`admin/dashboard`)
}