/**
 * 封装登录相关的请求
 */

//引入工具函数request.js
import req from "@/utils/request"

//账号登录
export function checkLogin(params) {
    return req.post("/login/login",params)
}