import { getRequest } from "../Apiservice"

export const getAllTaskers=(
    search:string,
    // min_rating:number,
    // max_rating:number,
    pause_account:boolean |null,
    is_verified:boolean,
    sort_by:any,
    sort_order:any,
    per_page:number,
    page:number
)=>{
    return getRequest(`admin/taskers?search=${search}&
        is_available=${pause_account}
        &is_verified=${is_verified}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`)
}

export const getTaskerById=(id:number)=>{
    return getRequest(`admin/taskers/${id}`)
}