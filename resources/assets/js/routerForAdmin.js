export default {
	router:
	{
		path: '/index',
		component: resolve => require(['./components/Index.vue'], resolve),
		meta: { role: 0 },
		children: [
			{
				path: '/article',
				component: resolve => require(['./AdminPage/Article/List.vue'], resolve),
				meta: { role: 0 },
			},
			{
				path: '/category',
				component: resolve => require(['./AdminPage/Category/List.vue'], resolve),
				meta: { role: 0 },
			},
			{
				path: '/category/:type',
				component: resolve => require(['./AdminPage/Category/Form.vue'], resolve),
				meta: { role: 0 },
			},
			{
				path: '/test',
				component: resolve => require(['./components/Test.vue'], resolve),
				meta: { role: 0 },
			},
			{
				path: '/user',
				component: resolve => require(['./AdminPage/User/List.vue'], resolve),
				meta: { role: 0 },
			},
			{
				path: '/user/:type',
				component: resolve => require(['./AdminPage/User/Form.vue'], resolve),
				meta: { role: 0 },
			}
		]
	}
}