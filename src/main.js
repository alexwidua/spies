import Vue from 'vue'
import App from './App.vue'
// Vue Router and Vuex
import router from './router'
import store from './store'
// Socket.io
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
// Styles
import '@/assets/style/index.scss'

Vue.use(VueSocketIOExt, io(process.env.VUE_APP_HOST))

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app')
