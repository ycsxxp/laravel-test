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


router.beforeEach((to, from, next) => {
	if(!store.state.loginStatus && to.path != '/login') {
		// 如果未登录 && 路由不是 /login 则重定向到 /login
		next('/login')
	}else if(store.state.loginStatus && (to.path == '/login' || to.path == '/')) {
		// 如果已登录 && 路由是 /login或者 / 则不跳转
		next(false)
	}else {
		next()
	}
})
const app = new Vue({
    el: '#app',
    store,
    router,
    template: '<App />',
    components: { App }
});
