<template>
	<div
		class="bar"
		:class="{
			'bar--expanded': this.gameMenuExpanded,
			'bar--collapsed': !this.gameMenuExpanded
		}"
	>
		<div class="bar__container">
			<GameRole />
			<GameScore />
		</div>
	</div>
</template>

<script>
/*
 *	Name: GameMenu
 *
 *	Menu bar that is display at the top during gameplay.
 *
 */

//import Role from '@/components/Game/GameRole.vue'
import GameRole from '@/components/Game/GameRole.vue'
import GameScore from '@/components/Game/GameScore.vue'
import { mapState, mapMutations } from 'vuex'

export default {
	name: 'GameMenu',
	components: {
		//Role,
		GameScore,
		GameRole
	},
	methods: {
		...mapMutations(['updateGameMenu']),
		/*
		 *	Expand/minimize menu bar. Stored in Vuex to eventually persist this setting.
		 */
		toggle() {
			this.updateGameMenu()
		}
	},
	computed: {
		...mapState(['gameMenuExpanded'])
	}
}
</script>

<style lang="scss">
.bar {
	width: 100%;
	//margin-bottom: 8em;
	padding: 2em;
	position: relative;
	display: flex;
	align-items: center;
	transition: all 0.3s ease;

	&__container {
		width: calc(var(--content-width) * 1.25);
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	// TODO: Change units.
	//&--collapsed {
	//background: #fff;
	//}

	&--expanded {
		height: 300px;
		//background: #fff;
	}
}

.toggle {
	position: absolute;
	right: 0;
	top: 0;
	margin: 2em;
	padding: 4px 16px;
	border-radius: 25px;
	cursor: pointer;
	background: rgba(255, 255, 255, 0.6);
	box-shadow: 0 2px 4px rgba(3, 27, 78, 0.06);
}

// TODO: Ductape solution for responsive, re-do properly.
@media only screen and (max-width: 900px) {
	.bar {
		margin-bottom: 0;
		padding: 2em;
	}

	.bar--collapsed {
		height: 120px;
	}
}
</style>
