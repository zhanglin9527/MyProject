<template>
    <div class="home">
       <el-container>
        <el-aside width="300px">
            <LeftNav></LeftNav>
            
        </el-aside>
        <el-container>
            <el-header>
                <RightHead  ref="rightHead"></RightHead>
            </el-header>
            <el-main>
                <!-- 路由出口 -->
                <router-view @自定义事件="fn"></router-view>
            </el-main>
            <el-footer>
                <RightFooter></RightFooter>
            </el-footer>
            </el-container>
    </el-container>
    </div>
</template>

<script>
// 引入请求函数
import { getInfo } from '@/api/account'
import LeftNav from "@/components/LeftNav/LeftNav.vue";//引入左侧导航组件
import RightHead from "@/components/RightHead/RightHead.vue";//引入右侧头部组件
import RightFooter from "@/components/RightFooter/RightFooter.vue";//引入右侧头部组件
    export default {
        components:{ //注册组件
            LeftNav ,
            RightHead,
            RightFooter
        },
        methods:{
              fn() {
               this.$refs.rightHead.getUserInfo()
            }
      
          /*   getUserInfo() {
                    // 发送请求 获取用户信息
                    getInfo()
                            .then(res => {
                                // 接收数据
                                let { data } = res;

                                // 获取账号
                                let { account, avatarUrl } = data[0]
                                this.userName = account; // 渲染账号
                                this.avatarUrl = 'http://127.0.0.1:4396' + avatarUrl; // 渲染头像地址
                            })  
                            .catch(err => {
                                console.log(err)
                            })
                    
             } */
        }
    }
</script>

<style lang="less">
    .home{
        height: 100%;
        .el-container{
            height: 100%;
            .el-aside {
                background-color: #D3DCE6;
                text-align: center;
            }
            .el-header {
                background-color: #4cc4fd;
                line-height: 60px;
            }
            .el-footer {
                background-color: #fff;
                line-height: 60px;
            }
        }
    }
    
</style>