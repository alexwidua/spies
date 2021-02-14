<template>
	<div class="create__settings">
		<div class="create__settings__section">
			<div style="margin-bottom:1em;">
				<span class="create__onboarding" v-html="'1'" />
				<span
					class="create__settings__section--title"
					v-html="'Choose a language'"
				/>
			</div>
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
					v-html="language.language"
				/>
			</ul>
		</div>
		<!-- <div class="--divider" />
		<div class="create__settings__section">
			<div style="margin-bottom:1em;">
				<span
					class="create__onboarding create__onboarding--optional"
					v-html="'Optional'"
				/>
				<span
					class="create__settings__section--title"
					v-html="'Add custom words'"
				/>
			</div>
			<div
				class="settings__custom"
				@click="useCustomWords = true"
				v-html="'+ Add words'"
			/>

			<textarea
				class="settings__textarea"
				v-if="useCustomWords"
				v-model="custom_words"
				placeholder="Add comma seperated custom words"
			></textarea>
		</div> -->
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
.create__onboarding {
	font-family: 'IBM Plex Mono';
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	background: rgb(255, 255, 255);
	border: 1px solid rgb(212, 212, 212);
	border-radius: 100%;
	font-weight: 600;
	margin-right: 0.75em;
	color: #0069ff;

	&--optional {
		border: 1px dashed rgb(212, 212, 212);
		width: auto;
		padding: 0 1em;
		border-radius: 32px;
	}
}

.create__settings {
	padding: var(--space);
	position: relative;

	&__section {
		//margin-bottom: 0.5em;

		&--title {
			//opacity: 0.8;
			//line-height: 4em;
			font-size: 1.25em;

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
		//color: var(--primary-color);
		cursor: pointer;
		//background: #f2f8ff;
		border: 1px solid rgba(0, 105, 255, 0.2);
		padding: 0.5em 1em;
		color: #708db1;
		display: inline-block;
		width: auto;
		border-radius: calc(var(--radius) / 2);

		&:hover {
			background: #f2f8ff;
			color: #0069ff;
		}
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
