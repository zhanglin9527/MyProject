<template>
  <div class="left-nav">
      <!-- 标题 -->
        <h3 class="title">
           <img src="../../assets/images/logo-02.png" alt="">
        </h3>
    <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#7ecef4"
        text-color="#000"
        unique-opened
        router
        active-text-color="#ffd04b"
        
        >
        
        <el-submenu :index="(i+1)+''" v-for="(nav,i) in LeftNav" :key="i">
            <template slot="title">
            <i :class="nav.iconCls"></i>
            <span>{{nav.navTitle}}</span>
            </template>
            <el-menu-item 
                v-for="(children,i) in nav.children"
                :key="i"
                :index="children.path"
            >
                {{children.navSubTitle}}
            </el-menu-item>
        </el-submenu>
    </el-menu>
  
  </div>
</template>

<script>
// 引入请求
import { getRole } from '@/api/account'
export default {
     data(){
         return{
             LeftNav:[]
         }
     },
     created(){
         getRole()
         .then(res=>{
             let {role} =res;
             let nav = [
                 //导航一 系统信息
                 {
                     iconCls : 'el-icon-s-tools',
                     navTitle : '系统信息',
                     role: ['超级管理员', '普通用户'],
                     children : [
                         {path:"/home/systeminfo",'navSubTitle': '系统信息'}
                     ]
                 },
                 //导航二 账号管理
                 {
                     iconCls : 'el-icon-s-order',
                     navTitle : '账号管理',
                     role: ['超级管理员'],
                     children : [
                         {path:"/home/accountmanage",'navSubTitle': '账号管理'},
                         {path:"/home/accountadd",'navSubTitle': '账号添加'},
                         {path:"/home/passwordmodify",'navSubTitle': '密码修改'}
                     ]
                 },
                 //导航三 商品管理
                 {
                     iconCls : 'el-icon-s-goods',
                     navTitle : '商品管理',
                     role: ['超级管理员', '普通用户'],
                     children : [
                         {path:"/home/goodsmanage",'navSubTitle': '商品管理'},
                         {path:"/home/goodsadd",'navSubTitle': '商品添加'}
                     ]
                 },
                 //导航四 统计管理
                 {
                     iconCls : 'el-icon-tickets',
                     navTitle : '统计管理',
                     role: ['超级管理员', '普通用户'],
                     children : [
                         {path:"/home/selltotal",'navSubTitle': '销售统计'},
                         {path:"/home/stocktotal",'navSubTitle': '进货统计'}
                     ]
                 },
                 

             ]
            // 过滤导航
            this.LeftNav = nav.filter(v => v.role.includes( role ))
         })
         .catch(err=>{
             console.log(err)
         })
     }
     
};
</script>

<style lang="less">
    .left-nav {
        height: 100%;
         background: #7ecef4;
        .title {
            background: #4cc4fd;
            height: 60px;
            width: 100%;
            img{
                widows: 100%;
                height: 100%;
            }
           
        }
        .el-menu {
            border-right: none;
            .el-submenu {
                color: #fff;
                .el-submenu__title {
                    color: #fff;
                    & > i {
                        color: #fff;
                        }
                    }
                }
                .el-menu-item {
                    color: #fff;
                } 
            
        }
    }
</style>
