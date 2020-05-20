import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// BOARD CREATION
		selected_language: false,
		custom_word_array: [],
		custom_word_array_length: 0,
		// GAME STATES
		board: [],
		// GAME DYNAMIC
		role: 'player',
		selected_card: false,
		// MISC
		gameMenuExpanded: true //TODO: Persist for better UX.
	},
	mutations: {
		// BOARD CREATION
		updateLanguage(state, language) {
			state.selected_language = language
		},
		updateCustomWords(state, words) {
			state.custom_word_array = words
		},
		updateCustomWordCount(state, words) {
			state.custom_word_array_length = words
		},
		// GAME STATES
		setBoard(state, board) {
			state.board = board
		},
		// GAME DYNAMIC
		selectCard(state, index) {
			state.selected_card = index
		},
		deselectCard(state) {
			state.selected_card = false
		},
		revealCard(state, index) {
			state.board[index].revealed = true
		},
		updateRole(state, role) {
			state.role = role
		},
		updateGameMenu(state) {
			state.gameMenuExpanded = !state.gameMenuExpanded
		}
	},
	actions: {
		// BOARD CREATION
		updateLanguage({ state, commit }, language) {
			state.selected_language === language
				? commit('updateLanguage', false)
				: commit('updateLanguage', language)
		},
		// TODO: Feels clunky and wrong. Fix this in next version, mb use tagging plugins
		updateCustomWords({ commit }, words) {
			commit('updateCustomWords', words.split(','))
		},
		updateCustomWordCount({ state, commit }) {
			let length = 0
			state.custom_word_array.forEach((item) => {
				if (item.length > 0) length++
			})
			commit('updateCustomWordCount', length)
		},
		// GAME STATE
		setBoard({ commit }, board) {
			commit('setBoard', board)
		},
		// GAME DYNAMIC
		updateSelectedCard({ state, commit }, index) {
			if (state.selected_card === index) {
				commit('deselectCard')
			} else {
				commit('selectCard', index)
			}
		},
		updateRole({ commit }, role) {
			commit('updateRole', role)
		}
	}
})
