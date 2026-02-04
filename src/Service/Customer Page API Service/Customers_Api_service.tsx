import { deleteRequest, getRequest, PutRequest } from "../Apiservice"

export const GetAllCustomers=(
     search:string,
    // min_rating:number,
    // max_rating:number,
    sort_by:any,
    sort_order:any,
    per_page:number,
    page:number
)=>{

    return getRequest(`admin/customers?search=${search}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`)
}

export const getCustomerById=(id:number)=>{
    return getRequest(`/admin/residents/${id}`)
}

export const delete_Customer=(id:number)=>{
    return deleteRequest(`/admin/customers/${id}`)
}

export const edit_customer=(id:number,payload:any)=>{
    return PutRequest(`/admin/customers/${id}`,payload)
}