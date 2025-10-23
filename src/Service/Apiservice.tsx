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

export const getRequest=(url:string,{params}:{params?:any}={})=>{
return api.get(url,{params}).then((res)=>res.data)
}

export const postRequest=(url:string,payload:any)=>{
    return api.post(url,payload).then((res)=>res.data)
}

export const PutRequest=(url:string,payload:any)=>{
    return api.put(url,payload).then((res)=>res.data)
}