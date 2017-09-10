/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

import App from './App.vue'
import Vuex from 'vuex' // 引入vuex
import iView from 'iview'; // 引入iView
import 'iview/dist/styles/iview.css';    // 使用 CSS
import router from './router'
import store from './store'

// 使用vuex
Vue.use(Vuex);
// 使用iView
Vue.use(iView);

Vue.prototype.$http = axios;
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example', require('./components/Example.vue'));
// Vue.component('login', require('./components/Login.vue'));

// 对所有请求增加 _token
axios.interceptors.request.use(
	config => {
	  // if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
	  //     config.headers.Authorization = `token ${store.state.token}`;
	  // }
	  return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// 增加对认证过期返回401的统一处理 http response 拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					// 返回 401 清除登录信息并跳转到登录页面
					store.commit('logoutSuccess');
					store.commit('setErrorResponseMsg', '登录超时,请重新登录!')
					router.replace({
						path: 'login',
						query: {redirect: router.currentRoute.fullPath}
					})
					break
				case 408:
					// 返回 402 清除token信息并跳转到登录页面
					store.commit('logoutSuccess');
					store.commit('setErrorResponseMsg', '页面超时,请重新登录!')
					router.replace({
						path: 'login',
						query: {redirect: router.currentRoute.fullPath}
					})
					break
				case 500:
					store.commit('setErrorResponseMsg', '网络错误,请重试!')
					break
			}
		}
		return Promise.reject(error.response.data)   // 返回接口返回的错误信息
	}
);


router.beforeEach((to, from, next) => {
	if(!store.state.loginStatus) {
		// 如果未登录 && 路由不是 /login 则重定向到 /login
		if(to.path != '/login') {
			next('/login')
		}else {
			next()
		}
	}else if(store.state.loginStatus) {
		// 如果已登录
		if(to.path == '/login') {
			next(false)
		}else {
			if(to.meta.role != store.state.loginUserInfo.role) {
				next(false)
			}else {
				next()
			}
		}
	}
})
const app = new Vue({
    el: '#app',
    store,
    router,
    template: '<App />',
    components: { App }
});
