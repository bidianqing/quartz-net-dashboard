import axios from 'axios';

const httpClient = axios.create({
    baseURL: ''

})

httpClient.interceptors.request.use(function(config){
    return config;
},function(error){
    return Promise.reject(error);
})

export default httpClient