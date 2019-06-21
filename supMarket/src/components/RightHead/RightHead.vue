<template>
    <div class="right-head">
        <el-row :gutter="20">
            <el-col :span="12" class="title"> 
                <i class="el-icon-menu"></i>
                彼岸花超市管理系统
            </el-col>
            <el-col :span="12">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-dropdown @command="handleCommand" >
                            <span class="el-dropdown-link"  >
                                欢迎你，<span style="font-weight:bolder" >{{name}}</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu  slot="dropdown" >
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                                
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="6">
                        <div class="avatar">
                            <img :src="avatarUrl" alt="">
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>    
</template>

<script>
// 引入请求函数
import { getInfo } from '@/api/account'
export default {
    mounted(){
     
        this.name = window.localStorage.getItem("name")
    },
    data(){
        return{
            name : ""  ,
            avatarUrl: '' // 头像地址
        }
    },
    methods:{
        handleCommand(command) {
            
         if(command === "logout"){
             //清除令牌
             window.localStorage.removeItem("Emperor")
             //弹出提示
             this.$message({
                showClose: true,
                message: "恭送吾皇！！！！",
                type: 'success'
            })
            //跳转页面
            setTimeout(()=>{
                this.$router.push("/login")
            },1000)
         }else if (command === "personal"){
             this.$router.push("/home/personal")
         }
           
        },
        getUserInfo() {
            // 发送请求 获取用户信息
            getInfo()
                .then(res => {
                    // 接收数据
                    let { data } = res;

                    // 获取账号
                    let { account, avatarUrl } = data[0]
                    this.userName = account; // 渲染账号
                    this.avatarUrl = 'http://172.16.12.183:4396' + avatarUrl; // 渲染头像地址
                })  
                .catch(err => {
                    console.log(err)
                })
        }
    },
    created() {
        // 请求当前登录的用户信息
        this.getUserInfo();
    }
}
</script>


<style lang="less" >
    .right-head{
        .el-row{
            .title{
                color: #000;
                font-size: 26px;
                height: 20px;
                font-weight: bolder
            }
            .el-col:last-child{
                .el-row{
                    .el-col:first-child{
                        text-align:right;
                    }
                    .el-col:last-child{
                       .avatar {
                            width: 50px;
                            height: 50px;
                            background: green;
                            margin-left: 20px;
                            margin-top: 5px;
                            border-radius: 50%;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>