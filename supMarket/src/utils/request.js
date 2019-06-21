/*
*引入 axios 封装
*/


//引入axios
import axios from "axios";
//引入qs
import qs from "qs";
// 引入本地存储封装
import local from '@/utils/local'
//设置默认请求地址
axios.defaults.baseURL = "http://172.16.12.183:4396";

/* 
    在axios的请求发送出去之前，头部携带token
*/
// 请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    let token = local.get('Emperor')

    // 给头部携带token
    config.headers.authorization = `Bearer ${token}` 
    return config
})

//暴露请求方式
export default {
    get(url,params = {}){
        return new Promise((resolve, reject) => {
            axios.get(url, { 
                params
            })
                .then(response => {
                    resolve(response.data)   // 成功
                })
                .catch(err => {
                    reject(err)   // 失败
                })
       })
    },
    post(url, params={}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify( params ))
                .then(response => {
                    resolve(response.data)   // 成功
                })
                .catch(err => {
                    reject(err)   // 失败
                })
        })
    }
}