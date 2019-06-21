/**
 * 封装商品相关的请求
 */

//引入工具函数request.js
import req from "@/utils/request"

//商品添加
export function goodsAdd(params) {
    return req.post("/goods/goodsadd",params)
}

//刷新
export function goodsMan(params) {
    return req.get("/goods/goodsmanage",params)
}

//删除
export function goodsDel(params) {
    return req.get("/goods/goodsdel",params)
}

//数据回填
export function goodsBack(params) {
    return req.get("/goods/goodsback",params)
}

//保存修改
export function saveEdit(params) {
    return req.post("/goods/saveEdit",params)
}

//系统信息
export function goods(){
    return req.get("/goods/goods")
}
