
import { deleteRequest, getRequest, postRequest } from "../Apiservice"

export const getAllServicess=()=>{
    return getRequest('/services')
}

export const getQuestionByServiceID=(id:number)=>{
    return(`/services/${id}/questions`)
}

export const PostQuestion=(data:any,serviceId:number)=>{
    return postRequest(`/services/${serviceId}/questions`,data)
}

export const getAllQuestions=(service_id:any,search:string,sort_by:any,sort_order:any,per_page:any,page:any)=>{
    return getRequest(`/service-questions?service_id=${service_id}&search=${search}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`)
}

export const deleteQuestionbyId=(question_id:number)=>{
    return deleteRequest(`/service-questions/${question_id}`)
}