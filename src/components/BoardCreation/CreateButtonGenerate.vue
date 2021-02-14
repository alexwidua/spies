<template>
	<div class="create">
		<button @click="createBoard()" :disabled="merged_wordlist.length < 24">
			<span v-if="!selected_language && custom_word_array_length === 0">
				Choose a language
			</span>
			<!-- Prettier, what the f-? -->
			<span
				v-if="
					!selected_language &&
						custom_word_array_length > 0 &&
						custom_word_array_length < 25
				"
			>
				Add atleast
				<span class="--highlight">
					{{ 25 - custom_word_array_length }}
				</span>
				more words, or mix them with a language.
			</span>
			<span class="--generate" v-if="merged_wordlist.length > 24">
				Dispatch spies
			</span>
		</button>
	</div>
</template>

<script>
/*
 *	Name: CreateButtonGenerate
 *
 *	Contains the final logic to generate board state.
 *
 */

import wordsJSON from '@/assets/game/words.json'
import rulesJSON from '@/assets/game/rules.json'
import { mapState, mapActions } from 'vuex'

export default {
	name: 'CreateGameGenerateBoard',
	data() {
		return {
			boardID: ''
		}
	},
	computed: {
		...mapState([
			'selected_language',
			'custom_word_array',
			'custom_word_array_length'
		]),
		/*
		 *	Return the shuffled original word list
		 */
		shuffled_wordlist() {
			wordsJSON.forEach((item) => {
				this._shuffle(item.words)
			})
			return wordsJSON
		},
		/*
		 *	Return the shuffled custom word array
		 */
		shuffled_custom_words() {
			let arr = []
			this.custom_word_array.forEach((item) => {
				if (item.length > 0) arr.push(item)
			})
			return this._shuffle(arr)
		},
		/*
		 *	Merge the shuffled original wordlist and custom words, if any, and shuffle them again.
		 *	@Returns: Array with shuffled words,
		 *			  ["<word1>", "<word2>","<...>"]
		 */
		merged_wordlist() {
			let arr = []
			for (let i = 0; i < wordsJSON.length; i++) {
				if (wordsJSON[i].id === this.selected_language) {
					// Push the shuffled word list but subtract the amount of custom words, so the amount equals to the 25 (default) cards
					arr.push(
						...this.shuffled_wordlist[i].words.slice(
							0,
							rulesJSON.cards - this.custom_word_array_length
						)
					)
				}
			}
			// Slice custom words array to <25 (default), concat custom words and the original wordslist and shuffle them again.
			return this._shuffle(
				arr.concat(this.shuffled_custom_words.slice(0, rulesJSON.cards))
			)
		},
		/*
		 *	Assign roles to each card.
		 *	@Returns: Array with shuffled roles,
		 *			  ["blue_agents", "red_agent", "bystander", "assassin", "..."]
		 */
		roles() {
			let roles = []
			for (let key in rulesJSON.roles) {
				if (
					Object.prototype.hasOwnProperty.call(rulesJSON.roles, key)
				) {
					if (key === 'double_agent') {
						let bool_rand = Math.random() >= 0.5
						if (bool_rand) {
							roles.push('blue_agent')
						} else roles.push('red_agent')
					} else {
						for (let i = 0; i < rulesJSON.roles[key]; i++) {
							roles.push(key)
						}
					}
				}
			}
			return this._shuffle(roles)
		},
		/*
		 *	Generate the final, shuffled set of cards.
		 *	@Returns: Object with 25 (default) cards containing index, word, role, revealState (default: false),
		 *			  { 0: { word: <word1>, role: <role>, revealed: <boolean>}, 1: {} }
		 */
		cards() {
			let obj = {}
			let words = this.merged_wordlist
			let roles = this.roles

			for (let i = 0; i < words.length; i++) {
				obj[i] = { word: words[i], role: roles[i], revealed: false }
			}
			return obj
		}
	},
	methods: {
		...mapActions(['setBoard']),
		/*
		 *	Durstenfeld shuffle util, see https://stackoverflow.com/a/12646864
		 *	@Returns: Shuffled array,
		 *			  []
		 */
		_shuffle(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[array[i], array[j]] = [array[j], array[i]]
			}
			return array
		},
		/*
		 *	Generates random 5-character string containing letters A-Z, nums 0-9
		 *	@Returns: 5 character long string <A-Z>, <0-9>
		 */
		_generateBoardID() {
			let rand = Math.random()
				.toString(36)
				.slice(2, 7)
			this.boardID = rand
			return rand
		},
		/*
		 *	Creates board and pushes client to assigned room.
		 */
		createBoard() {
			let arr = this.cards
			let id = this._generateBoardID()

			if (arr) {
				this.setBoard(arr)
				this.$router.push({ path: `/board/${id}` })
			} else {
				console.log('No cards')
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.create {
	background: #eee;
	//padding: var(--space);
	border-bottom-left-radius: var(--radius);
	border-bottom-right-radius: var(--radius);
}
button {
	height: 64px;
	width: 100%;
	background: var(--action-color);
	color: #fff;
	font-size: 1.1em;
	color: #b6b6b6;
	//border: 1px solid rgba(0, 0, 0, 0.1);
	border: none;
	border-bottom-left-radius: calc(var(--radius) / 2);
	border-bottom-right-radius: calc(var(--radius) / 2);
	transition: all 0.5s ease;
	cursor: pointer;

	&:disabled,
	&[disabled] {
		background: #fafafa;
	}
}

.--highlight {
	color: var(--primary-color);
}

.--generate {
	color: #fff;
	font-weight: 600;
	letter-spacing: 0.02em;
}
</style>
