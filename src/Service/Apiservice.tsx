import axios from 'axios'

const BASE_URL='https://67723ceaee76b92dd4918958.mockapi.io/murali/dharan'


const api=axios.create({
    baseURL:BASE_URL,
    headers:{
        'Content-Type':'Application/json'
    }
})


export const get=(url:string,{params}:{params?:any}={})=>{
return api.get(url,{params})
}