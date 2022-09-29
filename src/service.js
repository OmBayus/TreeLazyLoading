import axios from "axios"

const getOne = (key)=>{
    return axios.get("http://localhost:3010/lazyLoading/"+key)
}


const service = {getOne}

export default service;