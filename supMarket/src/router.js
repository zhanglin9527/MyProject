import Vue from 'vue'//引入vue
import Router from 'vue-router'//引入路由
import Login from './views/Login/Login.vue'//引入Login.vue


Vue.use(Router)

export default new Router({
  routes: [
    //默认路劲
    {
      path:"/",
      redirect:"/login"//重定向
    },
    //登录
    {
      path:"/login",
      component:()=>import("./views/Login/Login.vue")
    },
    //后台主页
    {
      path:"/home",
      component:()=>import("./views/Home/Home.vue"),
      redirect:"/home/systeminfo",
      children:[
        //系统信息
        {
          path:'/home/systeminfo',
          component:()=>import("./views/SystemInfo/SystemInfo.vue")
        },
        //账号管理
        {
          path:'/home/accountmanage',
          component:()=>import("./views/AccountManage/AccountManage.vue")
        },
        //添加账号
        {
          path:'/home/accountadd',
          component:()=>import("./views/AccountAdd/AccountAdd.vue")
        },
        //密码修改
        {
          path:'/home/passwordmodify',
          component:()=>import('./views/PasswordModify/PasswordModify.vue')
        },
        //商品管理
        {
          path:'/home/goodsmanage',
          component:()=>import('./views/GoodsManage/GoodsManage.vue')
        },
        //添加商品
        {
          path:'/home/goodsadd',
          component:()=>import('./views/GoodsAdd/GoodsAdd.vue')
        },
        //统计管理---销售统计
        {
          path:'/home/selltotal',
          component:()=>import('./views/SellTotal/SellTotal.vue')
        },
        //进货统计
        {
          path:'/home/stocktotal',
          component:()=>import('./views/StockTotal/StockTotal.vue')
        },
        //个人中心
        {
          path:'/home/personal',
          component:()=>import('./views/Personal/Personal.vue')
        }
      ]
    }
  ]
})
