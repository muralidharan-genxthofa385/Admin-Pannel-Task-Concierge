import axios from 'axios'

// const BASE_URL='https://67723ceaee76b92dd4918958.mockapi.io/murali/dharan'
const BASE_URL='http://127.0.0.1:8000/api'


const Token_key='accessToken'

export const logout=()=>{
    localStorage.removeItem(Token_key);
    localStorage.removeItem('user');
    window.location.href='/'
}

const api=axios.create({
    baseURL:BASE_URL,
    headers:{
        'Content-Type':'Application/json'
    }
})

api.interceptors.request.use((config)=>{
const token=localStorage.getItem(Token_key);
if(token){
    config.headers.Authorization=`Bearer ${token}`
}
return config
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const isLoginEndpoint = error.config?.url?.includes('/auth/login');
        
        if (!isLoginEndpoint && (error.response?.status === 401 || 
            error.response?.status === 403 || 
            (error.response?.data?.message && 
             (error.response.data.message.toLowerCase().includes('unauthenticated') || 
              error.response.data.message.toLowerCase().includes('unauthorized'))))) {
            logout();
        }
        
        return Promise.reject(error);
    }
);

export const getRequest=(url:string,{params}:{params?:any}={})=>{
return api.get(url,{params}).then((res)=>res.data)
}

export const postRequest=(url:string,data:any, isMultipart: boolean = false)=>{
const config = isMultipart ? {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   } : {};
   return api.post(url,data, config).then((res)=>res.data)}

export const PutRequest=(url:string,payload:any)=>{
    return api.put(url,payload).then((res)=>res.data)
}

export const deleteRequest=(url:string)=>{
    return api.delete(url).then((res)=>res.data)

}