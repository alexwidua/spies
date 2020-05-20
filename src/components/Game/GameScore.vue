<template>
	<div class="score">
		<div class="score--title">Remaining agents</div>
		<div class="score__display">
			<span class="score__display--red">{{
				getRemainingAgents('red_agent')
			}}</span>
			<span class="score__display--blue">{{
				getRemainingAgents('blue_agent')
			}}</span>
		</div>
	</div>
</template>

<script>
/*
 *	Name: GameScore
 *
 *	Component containing the logic to display the game's score.
 *
 */

import { mapState } from 'vuex'

export default {
	name: 'GameScore',
	computed: {
		...mapState(['board'])
	},
	methods: {
		/*
		 *	Iterates through the board state to count the remaining unrevealed cards.
		 *	@Param: Team color
		 *			<'red_agent'> or <'blue_agent'>
		 */
		getRemainingAgents(roleParam) {
			let count = 0
			if (roleParam === 'red_agent' || roleParam === 'blue_agent') {
				for (var key in this.board) {
					if (
						!this.board[key].revealed &&
						this.board[key].role === roleParam
					) {
						count++
					}
				}
			}
			return count
		}
	}
}
</script>

<style lang="scss" scoped>
.score {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	color: #808fa5;
	text-align: right;
	transition: all 0.3s ease;

	&--title {
		font-weight: bold;
		color: rgba(3, 27, 78, 0.7);
		text-transform: uppercase;
	}

	&__display {
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		font-size: 2em;

		&--red {
			color: rgb(236, 83, 83);
		}

		&--blue {
			color: rgb(34, 117, 194);
		}
	}
}

// Inherited from parent GameMenu.vue;
// TODO: Make proper css class.
.bar--collapsed .score {
	font-size: 0.7em;
	justify-content: flex-start;
}
</style>
