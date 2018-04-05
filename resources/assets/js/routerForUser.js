export default {
	router:
	{
		path: '/home',
		component: resolve => require(['./components/Home.vue'], resolve),
		meta: { role: 1 },
		children: [
			{
				path: '/homepage',
				component: resolve => require(['./HomePage/Homepage.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/cate',
				component: resolve => require(['./HomePage/Category.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/writer',
				component: resolve => require(['./HomePage/Writer.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/detail/:id',
				component: resolve => require(['./HomePage/Detail.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/mine',
				component: resolve => require(['./HomePage/Mine/List.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/mine/edit/:id',
				component: resolve => require(['./HomePage/Mine/Edit.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/search/:keyword',
				component: resolve => require(['./HomePage/Search.vue'], resolve),
				meta: { role: 1 },
			},
			{
				path: '/other',
				component: resolve => require(['./components/Test.vue'], resolve),
				meta: { role: 1 },
			}
		]
	}
}