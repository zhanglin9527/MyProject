import Vue from 'vue'//引入vue
import App from './App.vue'//引入App.vue
import router from './router'//引入路由
import './assets/css/reset.css';//引入reset.css
import './assets/css/common.css';//引入common.css
//引入element-ui
import ElementUI from 'element-ui'; // 引入JS组件
import 'element-ui/lib/theme-chalk/index.css'; // 引入css样式
// //引入Echarts
import echarts from 'echarts';//引入myCharts.js
//引入axios
import axios from 'axios';
//引入qs
import qs from "qs";

//注册原型上的qs
Vue.prototype.$qs = qs;
//注册原型上的axios
Vue.prototype.$req =axios;
//注册原型上的myCharts
Vue.prototype.$echarts = echarts;
//注册element-ui
Vue.use(ElementUI);

Vue.config.productionTip = false//阻止生产提示

// 设置路由守卫
router.beforeEach((to,from,next)=>{
  //获取本地token的令牌
  let token = window.localStorage.getItem("Emperor");
  if(token){// 如果有token 直接放行
    next();
  }else{//没有则进行判断
    if(to.path === "/login"){//如果去登录放行
      next();
    }else{//不是去登陆 则跳转到登录
      next({path:"/login"})
    }
  }
})
new Vue({//创建vue实例对象
  router,
  render: h => h(App)
}).$mount('#app')//挂载dom
