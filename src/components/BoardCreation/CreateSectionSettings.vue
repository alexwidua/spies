<template>
	<div class="create__settings">
		<div class="create__settings__section">
			<span class="create__settings__section--title --language"
				>Choose a language</span
			>
			<ul class="settings__languages">
				<li
					v-for="language in words"
					:key="language.id"
					class="settings__languages--item"
					:class="{
						'settings__languages--item--selected': _selected(
							language.id
						)
					}"
					@click="selectLanguage(language.id)"
				>
					{{ language.language }}
				</li>
			</ul>
		</div>
		<div class="--divider" />
		<div class="create__settings__section">
			<span class="settings__custom" @click="useCustomWords = true">
				Add custom words
				<span class="create__settings__section--title--icon">
					<span v-if="!useCustomWords">+</span>
					<span v-else> {{ custom_word_array_length }}</span>
				</span>
			</span>

			<textarea
				class="settings__textarea"
				v-if="useCustomWords"
				v-model="custom_words"
				placeholder="Add comma seperated custom words"
			></textarea>
		</div>
	</div>
</template>

<script>
/*
 *	Name: CreateSectionSettings
 *
 *	Choose settings during board creation, e.g. language or add custom words.
 *
 */

import wordsJSON from '@/assets/game/words.json' // Import word list
import { mapState, mapActions } from 'vuex'

export default {
	name: 'CreateSectionSettings',
	data() {
		return {
			words: wordsJSON,
			useCustomWords: false
		}
	},
	computed: {
		...mapState([
			'selected_language',
			'custom_word_array',
			'custom_word_array_length'
		]),
		/*
		 *	Two-way computed property to bind the textarea v-model to Vuex (see: https://vuex.vuejs.org/guide/forms.html#two-way-computed-property)
		 */
		custom_words: {
			get() {
				return this.custom_word_array
			},
			set(value) {
				this.updateCustomWords(value)
				this.updateCustomWordCount()
			}
		}
	},
	methods: {
		...mapActions([
			'updateCustomWords',
			'updateLanguage',
			'updateCustomWordCount'
		]),
		/*
		 *	Dispatches the selected language to vuex store.
		 */
		selectLanguage(language) {
			this.updateLanguage(language)
		},
		/*
		 *	Util to style selected language
		 *
		 *	TODO: Move this to computed class styling?
		 */
		_selected(language) {
			if (this.selected_language === language) return true
		}
	}
}
</script>

<style lang="scss" scoped>
.create__settings {
	padding: calc(var(--space) / 2) var(--space);
	position: relative;

	&__section {
		//margin-bottom: 0.5em;

		&--title {
			//opacity: 0.8;
			//line-height: 4em;

			&--icon {
				background: #f2f8ff;
				color: #0069ff;
				padding: 4px 8px;
				border-radius: 20px;
				font-weight: 400;
			}

			&.--interactive {
				cursor: pointer;
				color: #0069ff;
			}
		}
	}
}

.settings {
	&__languages {
		display: flex;
		flex-direction: row;
		margin-top: 1em;
		&--item {
			font-size: 1.1em;
			font-weight: 600;
			color: #708db1;
			padding: 1em;
			//background: #f2f8ff;
			background: #fff;
			border: 1px solid rgba(0, 105, 255, 0.2);
			border-radius: calc(var(--radius) / 2);
			cursor: pointer;
			transition: all 0.2s ease;

			&:hover {
				background: #f2f8ff;
				color: #0069ff;
			}

			&:not(:last-child) {
				margin-right: 0.75em;
			}

			&--selected {
				background: #f2f8ff;
				color: #0069ff;
			}
		}
	}

	&__custom {
		color: var(--primary-color);
	}

	&__textarea {
		display: flex;
		width: 100%;
		min-height: 150px;
		font-size: 1em;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		padding: 0.5em;
		border: 1px solid rgb(235, 235, 235);
		border-radius: var(--radius);
		margin-top: 1.5em;
	}
}

.--divider {
	width: 100%;
	border-bottom: 1px solid rgb(230, 230, 230);
	margin: 2em 0;
}

/*
 * TODO: Fix instructions
 *
.--language::before {
	content: '1';
	position: absolute;
	background: #fff;
	height: 30px;
	width: 30px;
	left: -15px;
	text-align: center;
	line-height: 30px;
	border-radius: 40px;
	border: 1px solid #eee;
	margin-top: -5px;
	box-shadow: 0 2px 4px rgba(3, 27, 78, 0.06);
}
*/
</style>
