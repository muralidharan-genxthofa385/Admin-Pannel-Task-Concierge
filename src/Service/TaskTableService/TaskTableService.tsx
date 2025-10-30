import { getRequest } from "../Apiservice"

export const getAllTasks=(
    search:string,
    status:string,
    service_id:number | null,
    sort_by:any,
    sort_order:any,
    per_page:number,
    page:number,
)=>{
    return  getRequest(`/admin/bookings?search=${search}&status=${status}&service_id=${service_id}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`);

}

