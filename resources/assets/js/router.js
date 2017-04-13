import Vue from 'vue'
import VueRouter from 'vue-router'

import Example from './components/Example.vue'

Vue.use(VueRouter)

export default new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: resolve => require(['./components/Login.vue'], resolve)
		},
		{
			path: '/index',
			component: resolve => require(['./components/Index.vue'], resolve)
		},
		{
			path: '/about',
			component: resolve => require(['./components/Example.vue'], resolve)
		}
	]
})