import Vue from 'vue'
import VueRouter from 'vue-router'
import routerForAdmin from './routerForAdmin'
import routerForUser from './routerForUser'

Vue.use(VueRouter)

export default new VueRouter({
	// mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: resolve => require(['./components/Login.vue'], resolve)
		},
		routerForAdmin.router,
		routerForUser.router
	]
})