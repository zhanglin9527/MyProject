<template>
    <div class="account-add">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>添加管理员账号</h2>
            </div>
            <div class="item">
                <el-form 
                    style="width: 316px"
                    size="small"
                    :model="accountForm"
                    status-icon 
                    :rules="rules"
                    ref="accountForm"
                    label-width="100px"
                 >
                    <!-- 账号 -->
                     <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountForm.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="accountForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认密码 -->
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="accountForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="accountForm.email"></el-input>
                    </el-form-item>
                    <!-- 用户组 -->
                    <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="accountForm.userGroup" placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 提交 和 重置 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('accountForm')">提交</el-button>
                        <el-button @click="resetForm('accountForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {pwdReg,emailReg} from '@/utils/reg';//引入工具函数
    import {accountAdd} from '@/api/account';//引入账号添加api
    export default {
        data(){
            //自定义验证
            //密码验证
            const checkPwd = (rule,value,callback) =>{
                if(value ===""){//非空验证
                    callback(new Error("请输入密码"))
                }else if(value.length>6 || value.length<3){//长度验证
                    callback(new Error("密码长度在3到6位之间"))
                }else if(!pwdReg(value)){//格式验证
                    callback(new Error("只可以输入字母或者数字"))
                }else{
                    callback();
                }
            }
            //二次密码验证
            const confirmPwd =(rule,value,callback) =>{
                  if(value ===""){//非空验证
                    callback(new Error("请再次输入密码"))
                }else if(value !== this.accountForm.password){//两次密码验证全等
                    callback(new Error("两次输入密码不一致"))
                }else{
                    callback();
                }
            }
            //邮箱验证
            var checkEmail =(rule,value,callback) =>{//邮箱验证
                if(value === ''){//非空
                    callback(new Error("请输入邮箱地址"))
                }else if(!emailReg(value)){//格式验证 正则
                    callback(new Error("请输入正确的邮箱格式"))
                }else{
                    callback();
                }
            };
            return {
                accountForm:{
                    account:"",//账号
                    password:"",//密码
                    checkPass:"",//确认密码
                    email:"",//邮箱
                    userGroup: '' // 用户组
                },
                rules:{
                    //账号验证
                    account:[
                         { required: true, message: '请输入账号', trigger: 'blur' }, // 非空验证
                         { min: 3 , max: 5, message:'只能写3-5个字符' , trgger : 'blur'},//长度验证
                    ],
                    //密码验证
                    password:[
                        { required :true, validator: checkPwd , trigger: 'blur'}
                    ],
                    //二次密码验证
                    checkPass:[
                        {required :true ,validator:confirmPwd,trigger:'blur'}
                    ],
                    //邮箱验证
                    email:[
                        {required:true,validator:checkEmail,trigger:["blur ","change"]}
                    ],
                    //用户分组
                    userGroup:[
                        { required: true, message: '请选择用户组', trigger: 'change' }, // 非空验证
                    ]
                }
            }
        },
        methods:{
            // 登录
            submitForm() {
                // 获取el-form组件 调用验证方法
                this.$refs.accountForm.validate((valid) => {
                    if (valid) {//前段验证通过
                          let params ={ //获取参数
                            account  : this.accountForm.account,
                            password : this.accountForm.password,
                            email    : this.accountForm.email,
                            userGroup : this.accountForm.userGroup
                        }
                       accountAdd(params)
                            .then((res)=>{
                                let {code,msg} = res
                                if(code === 0){
                                     this.$message({
                                        showClose: true,
                                        message: msg,
                                        type: 'success'
                                        })
                                        this.$router.push("/home/AccountManage")
                                }else if(code === 1){
                                    this.$message({
                                    showClose: true,
                                    message: msg,
                                    type: 'error'
                                    });
                                }
                                
                            })
                            .catch((err)=>{
                                console.log(err);
                                
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
                this.$refs.accountForm.resetFields();
            }
        }
    }
</script>

<style lang="less">
    .account-add{
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
