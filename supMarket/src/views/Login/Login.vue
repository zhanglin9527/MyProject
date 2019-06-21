<template>
    <div class="login">
        <div class="login-wrap">
            <!-- 标题 -->
            <h3>
                <i class="el-icon-user-solid"></i>
                彼岸花超市管理系统
            </h3>
            <el-form 
                :model="loginForm" 
                status-icon 
                :rules="rules" 
                ref="loginForm" 
                label-width="100px" 
                class="demo-loginForm">
                <el-form-item label="账户" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="loginForm.userGroup" placeholder="请选择用户组" style="width:310px">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {pwdReg} from '@/utils/reg'//引入工具函数
import {checkLogin} from '@/api/login'//引入api
    export default {
        data (){
            //自定义验证
            var checkPwd = (rule,value,callback) =>{ //密码验证
                if(value === ''){ //非空
                    callback(new Error("请输入密码"))
                }else if(value.length > 6 || value.length<3){ //长度
                    callback(new Error("长度在3到6位之间"))
                }else  if (!pwdReg( value )) {
                   callback(new Error('只可以输入字母或者数字')) //格式验证 正则
               } else{
                    callback();
                }
            };
            return {
                 // 登录表单数据
                loginForm: {
                    account: '',  // 账号
                    password: '', //密码
                    userGroup: '' // 用户组
                  
                },
                // 验证规则
                rules: {
                   

                    // 账号
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }, // 非空验证
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' } // 长度验证
                    ],
                    // 密码
                    password: [
                        { required: true, validator: checkPwd , trigger: 'blur' }//密码验证
                    ],
                    //用户分组
                    userGroup:[
                        { required: true, message: '请选择用户组', trigger: 'change' }, // 非空验证
                    ]
                }
            }
        },
        methods: {
            // 登录
            submitForm() {
                // 获取el-form组件 调用验证方法
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {//前段验证通过
                          let params ={ //获取参数
                            account  : this.loginForm.account,
                            password : this.loginForm.password,
                            userGroup : this.loginForm.userGroup
                        }
                        //console.log(params);//打印参数
                       
                        //发送axios请求
                        checkLogin(params)
                        .then((res)=>{
                            let {code,msg,token} = res;
                             //将登录名存入本地
                             
                             window.localStorage.setItem("name",this.loginForm.account)
                            //将token令牌存入本地
                            window.localStorage.setItem("Emperor",token);
                            //判断
                            if(code === 0){
                                this.$message({
                                    showClose: true,
                                    message: msg,
                                    type: 'success'
                                    })
                            this.$router.push("/home")
                             }else if(code === 1){
                                 this.$message({
                                showClose: true,
                                message: msg,
                                type: 'error'
                                });
                            }
                            
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                    } else {
                        console.log('前端验证不通过!')
                        return false;
                    }
                })
            },
            // 重置
            resetForm() {
                // 获取el-form表单 调用内置重置方法
                this.$refs.loginForm.resetFields();
            }
        }
    }
</script>

<style lang="less" >
    @import url(./Login.less);
</style>