import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import Axios from 'axios'
Axios.defaults.baseURL = '/api'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.prototype.$http = Axios
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

// axios请求拦截器:添加请求拦截器，在请求头中加token
Axios.interceptors.request.use(
    config => {
        // 从localStorage中获取token
        let token = localStorage.getItem("token");

        // 如果token有值,我们就放到请求头里面
        if (token) {
            config.headers.token = token;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })
// 响应拦截器
Axios.interceptors.response.use(function(response){
    console.log("response",response)
    //对返回的数据进行操作
    let result = response.data;  // response.data 就是后端返给我们的数据
    console.log(result)
    if(!result.success && result.msg == "noLogin"){ // 说明未登录,被拦截了,那么就要跳回到登陆页面
        alert(result.msg)
        router.push({ path: '/login' });  // 跳转回登陆页面,让用户登陆
        return response
    }else if (!result.success && result.msg=="forbidden"){
        router.push({ path: '/403' });
        return response;
    }else{
        return response
    }
},function(err){
    return Promise.reject(err)
})

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')
