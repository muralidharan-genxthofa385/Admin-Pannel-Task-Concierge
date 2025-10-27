import { getRequest, postRequest } from "../Apiservice"

export const getAllServices=(
    category_id:number,
    search:string,
    sort_by:any,
    sort_order:any,
    per_page:number,
    page:number
)=>{
    return getRequest(`services?category_id=${category_id}&search=${search}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`)
}

export const Create_new_service=(data:any)=>{
    return postRequest(`/services`,data)
}