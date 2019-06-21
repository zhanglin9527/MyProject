/**
 * 封装账号相关的请求
 */

//引入工具函数request.js
import req from "@/utils/request"

//账号添加
export function accountAdd(params) {
    return req.post("/accountadd",params)
}

//获取表
export function getDataByPage(params) {
    return req.get("/accountmanagebypage",params)
}

//删除
export function accountDel(params) {
    return req.get("/accountdel",params)
}

//数据回填
export function dataBack(params) {
    return req.get("/dataBack",params)
}   

//保存修改
export function SaveEdit(params) {
    return req.post("/saveEdit",params)
}  

//删除全部
export function delAll(params) {
    return req.get("/delAll",params)
}  

// 获取当前登录的用户信息 
export function getInfo () {
    return  req.get('/info')
}
 
/* 验证旧密码是否正确 */
export function checkOldPass(params) {
    return req.post('/checkoldpass', params)
 }

/* 修改密码 */ 
export function passwordModify(params) {
    return req.post('/passwordmodify', params)
}

/* 菜单权限 */
export function getRole () {
    return  req.get('/role')
}