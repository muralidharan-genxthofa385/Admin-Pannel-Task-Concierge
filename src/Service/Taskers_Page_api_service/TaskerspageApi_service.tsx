import { deleteRequest, getRequest, PutRequest } from "../Apiservice"

export const getAllTaskers=(
    search:string,
    // min_rating:number,
    // max_rating:number,
    pause_account:boolean |string,
    is_verified:boolean,
    sort_by:any,
    sort_order:any,
    per_page:number,
    page:number
)=>{
    return getRequest(`admin/taskers?search=${search}&
        pause_account=${pause_account}
        &is_verified=${is_verified}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`)
}

export const getTaskerById=(id:number,task_page:any,task_per_page:any)=>{
    return getRequest(`admin/taskers/${id}?task_page:${task_page}&task_per_page:${task_per_page}`)
}

export const delete_Tasker=(id:number)=>{
    return deleteRequest(`/admin/taskers/${id}`)
}

export const edit_tasker=(id:number,payload:any)=>{
    return PutRequest(`/admin/taskers/${id}`,payload)
}