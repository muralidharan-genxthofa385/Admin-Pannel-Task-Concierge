import { deleteRequest, getRequest, postRequest } from "../Apiservice"

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

export const getServiceById=(id:number)=>{
    return getRequest(`/services/${id}`)
}

export const Create_new_service=(data:any)=>{
    return postRequest(`/services`,data)
}

export const Edit_service=(id:number,payload:any)=>{
    return postRequest(`/services/${id}`,payload)
}


export const delete_a_service=(id:number|string)=>{
    return deleteRequest(`/services/${Number(id)}`)
}