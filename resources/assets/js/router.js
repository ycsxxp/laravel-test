import Vue from 'vue'
import VueRouter from 'vue-router'

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
		{
			path: '/index',
			component: resolve => require(['./components/Index.vue'], resolve),
			children: [
				{
					path: '/article',
					component: resolve => require(['./components/Article/List.vue'], resolve)
				},
				{
					path: '/category',
					component: resolve => require(['./AdminPage/Category/List.vue'], resolve)
				},
				{
					path: '/category/:type',
					component: resolve => require(['./AdminPage/Category/Form.vue'], resolve)
				},
				{
					path: '/test',
					component: resolve => require(['./components/Test.vue'], resolve)
				},
				{
					path: '/user',
					component: resolve => require(['./components/User/List.vue'], resolve),
				},
				{
					path: '/user/:type',
					component: resolve => require(['./components/User/Form.vue'], resolve)
				}
			]
		},
		{
			path: '/home',
			component: resolve => require(['./components/Home.vue'], resolve),
			children: [
				{
					path: '/homepage',
					component: resolve => require(['./components/HomePage/Homepage.vue'], resolve)
				},
				{
					path: '/cate',
					component: resolve => require(['./components/HomePage/Category.vue'], resolve)
				},
				{
					path: '/writer',
					component: resolve => require(['./components/HomePage/Writer.vue'], resolve)
				},
				{
					path: '/detail/:id',
					component: resolve => require(['./components/HomePage/Detail.vue'], resolve)
				},
				{
					path: '/mine',
					component: resolve => require(['./HomePage/Mine/List.vue'], resolve)
				},
				{
					path: '/other',
					component: resolve => require(['./components/Test.vue'], resolve)
				}
			]
		}
	]
})