
import { deleteRequest, getRequest, postRequest, PutRequest } from "../Apiservice"

export const getAllServicess=()=>{
    return getRequest('/services')
}

export const getQuestionByServiceID=(id:number)=>{
    return getRequest(`/services/${id}/questions`)
}

export const getAllQuestions=(service_id:any,search:string,sort_by:any,sort_order:any,per_page:any,page:any)=>{
    return getRequest(`/service-questions?service_id=${service_id}&search=${search}&sort_by=${sort_by}&sort_order=${sort_order}&per_page=${per_page}&page=${page}`)
}

export const getQuestionByID=(id:number)=>{
    return getRequest(`/service-questions/${id}`)
}


export const PostQuestion=(data:any,serviceId:number)=>{
    return postRequest(`/services/${serviceId}/questions`,data)
}
export const EditQuestion=(id:number,data:any)=>{
    return PutRequest(`/service-questions/${id}`,data)
}

export const deleteQuestionbyId=(question_id:number)=>{
    return deleteRequest(`/service-questions/${question_id}`)
}