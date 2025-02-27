import Vue from 'vue'
import VueRouter from 'vue-router'
// Views
import Index from '@/views/Index.vue'
import Board from '@/views/Board.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Index',
		component: Index
	},
	{
		path: '/board/:id',
		name: 'Board',
		component: Board
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
