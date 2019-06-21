/**
 * 封装统计相关的请求
 */

//引入工具函数request.js
import req from "@/utils/request"

export function refresh(params) {
    return req.get("/lande/refresh",params)
}