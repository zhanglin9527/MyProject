<template>
    <div class="password-modify">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>修改密码</h2>
            </div>
            <div class="item">
                <el-form 
                style="width: 316px"
                :model="pwdForm" 
                size="small"
                status-icon 
                :rules="rules" 
                ref="pwdForm" 
                label-width="100px" 
                >
                    <!-- 原密码 -->
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input type="password" v-model="pwdForm.oldPwd" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <!-- 新密码 -->
                     <el-form-item label="新密码" prop="newPwd">
                        <el-input type="password" v-model="pwdForm.newPwd" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <!-- 确认新密码 -->
                    <el-form-item label="确认密码" prop="checkPwd">
                        <el-input type="password" v-model="pwdForm.checkPwd" autocomplete="off" show-password></el-input>
                    </el-form-item>
                   
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" show-password>提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import {pwdReg} from "@/utils/reg";//引入工具函数
import local from '@/utils/local'
// 引入请求函数
import { checkOldPass, passwordModify } from '@/api/account'
    export default {
        data(){
            //自定义验证
            // 自定义验证函数
            const checkOldPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('旧密码不能为空'))
                } else {
                    // 把旧密码发送给后端
                    checkOldPass({oldPwd:this.pwdForm.oldPwd})
                        .then(res => {
                            // 接收数据
                            let {code, reason} = res;
                            if (code === 1) {
                                callback(new Error(reason)) // 密码错误提示
                            } else if (code === 0) {
                                callback() // 成功
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            } ;
            //密码验证
            const checkNewPwd = (rule,value,callback) =>{
                if(value === ""){//非空验证
                    callback(new Error("此处不能为空"))
                }else if (value.length>6 || value.length<3){//非空 验证
                    callback(new Error("长度应该在3到6位之间"))
                }else if(!pwdReg(value)){//格式验证
                    callback(new Error("只能包含数字或者字母"))
                }else{
                  callback();
                }
            };
            //新密码与原密码重复验证
            const repeatOldToNew = (rule,value,callback) =>{
                if(value === this.pwdForm.oldPwd){//判断新密码和原密码是否相等
                    callback(new Error("新密码不能和原密码一样"))
                }else{
                    callback();
                }
            };
            //新密码和确认密码是否相等
            const repeatNewToCheck = (rule,value,callback) =>{
                if(value !== this.pwdForm.newPwd){//判断新密码和原密码是否相等
                    callback(new Error("两次输入密码不一致"))
                }else{
                    callback();
                }
            };
            return{
                pwdForm:{
                    oldPwd:"",//旧密码
                    newPwd:"",//新密码
                    checkPwd:""//确认新密码
                },
                rules:{
                    //旧密码验证
                    oldPwd:[
                        {required:true,validator:checkOldPwd,trigger:"blur"}
                    ],
                    //新密码验证 
                    newPwd:[
                        {required:true,validator:checkNewPwd,trigger:"blur"},
                        {required:true,validator:repeatOldToNew,trigger:"blur"}
                    ],
                    //确认新密码验证
                    checkPwd:[
                      
                        {required:true,validator:repeatNewToCheck,trigger:"blur"}
                    ]
                }
            }
        },
        methods:{
            //登录
            submitForm(){
                //h获取el-from组件的 调用验证方法
                this.$refs.pwdForm.validate((valid) =>{
                    //前段验证
                    if(valid){//通过
                        let params ={
                            newPassword : this.pwdForm.newPwd
                        }
                        // 发送修改密码的请求
                    passwordModify(params)
                        .then(res => {
                            // 接收数据
                            let {code, reason} = res;
                            // 判断
                            if (code === 0) {
                                // 弹成功提示
                                this.$message({
                                    type: 'success',
                                    message: reason
                                })
                                // 清除token 退出登录
                                local.remove('user_token')
                                this.$router.push('/login')

                            } else if (code === 1){
                                // 弹失败提示
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {

                        })

                    }else{//不通过
                        console.log("前段验证不通过")
                        return false;
                    }
                })
            },
            //重置
            resetForm(){
                 // 获取el-form表单 调用内置重置方法
                this.$refs.pwdForm.resetFields();
            }
        }
    }
</script>

<style lang="less">
    .password-modify{
        .el-card {
            .el-card__header {
                background-color: #f1f1f1;
                font-size: 20px;
            }
            .el-card__body {
                .el-alert {
                    margin: 20px auto;
                }
            }
        }
    }
</style>