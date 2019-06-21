/**
 * 工具函数
 */

/* 验证密码 */
export function pwdReg(value) {
    // 正则
    const reg = /^[A-Za-z0-9]+$/;
    return reg.test( value )
}
//验证邮箱
export function emailReg(value){
    //正则
    const reg =/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg.test(value)
}