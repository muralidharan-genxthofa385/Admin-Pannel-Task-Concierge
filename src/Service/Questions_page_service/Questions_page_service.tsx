import { getRequest } from "../Apiservice"

export const getAllServicess=()=>{
    return getRequest('/services')

}