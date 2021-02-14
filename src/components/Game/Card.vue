<template>
	<div class="card" @click="_selectCard()">
		<div class="role" :class="classStates">
			<transition name="animations--fade">
				<span
					v-if="selected_card === index"
					class="text--reveal"
					@click="_revealCard()"
					v-click-outside="onClickOutside"
					v-html="'Reveal?'"
				/>
			</transition>
			<span class="text--word" v-html="card.word" />
		</div>
	</div>
</template>

<script>
/*
 *	Name: Card
 *
 *	The card the user interacts with. Contains the word and, if revealed,
 *	the team color.
 *
 */

import vClickOutside from 'v-click-outside'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
	name: 'Card',
	/*
	 *	Props, originally derived from Vuex.
	 *	[Vuex] -> [Board.vue] -> [Card.vue]
	 */
	props: {
		// Card contents
		card: {
			// { card.revealed: <bool>, card.role: <string>, card.word: <string> }
			type: Object
		},
		// Util for the selection of different game cards.
		index: {
			// <0-24>
			type: String
		}
	},
	/*
	 *	ClickOutside is a package used to deselect card when somewhere else.
	 */
	directives: {
		clickOutside: vClickOutside.directive
	},
	computed: {
		...mapState(['board', 'selected_card', 'role']),
		isSpymaster() {
			if (this.role === 'spymaster') return true
			else return false
		},
		classStates() {
			return {
				// Player view
				'role--hidden': !this.card.revealed,
				'role--revealed--red':
					this.card.role === 'red_agent' && this.card.revealed,
				'role--revealed--blue':
					this.card.role === 'blue_agent' && this.card.revealed,
				'role--revealed--bystander':
					this.card.role === 'bystander' && this.card.revealed,
				'role--revealed--assassin':
					this.card.role === 'assassin' && this.card.revealed,
				// Spymaster view
				spymaster: this.isSpymaster,
				'spymaster--red':
					this.card.role === 'red_agent' && this.isSpymaster,
				'spymaster--blue':
					this.card.role === 'blue_agent' &&
					this.isSpymaster &&
					!this.card.revealed,
				'spymaster--bystander':
					this.card.role === 'bystander' && this.isSpymaster,
				'spymaster--assassin':
					this.card.role === 'assassin' && this.isSpymaster,
				// Misc style utils
				isSelected: this.selected_card === this.index,
				isRevealed: this.card.revealed
			}
		}
	},
	methods: {
		...mapActions(['updateSelectedCard']),
		...mapMutations(['deselectCard', 'revealCard']),
		/*
		 *	Selecting a card will trigger a confirm modal.
		 */
		_selectCard() {
			if (!this.card.revealed) this.updateSelectedCard(this.index)
		},
		/*
		 *	Actual card reveal, that gets emited to other clients.
		 */
		_revealCard() {
			// 1. Set reveal state locally
			this.revealCard(this.selected_card)
			// 2. Create object containing route and the revealed card and emit to socket server.
			let obj = {
				room: this.$route.params.id,
				index: this.selected_card
			}
			this.$socket.client.emit('reveal_card', obj)
			// 3. Deselect card after operation
			this.deselectCard()
		},
		/*
		 *	See clickOutside-directive ^
		 */
		onClickOutside() {
			this.deselectCard()
		}
	},
	sockets: {
		/*
		 *	Receive card reveal event from other client.
		 *	@Param: Index of revealed card
		 *			<0-24>
		 */
		receive_reveal(cardIndex) {
			this.revealCard(cardIndex)
		}
	}
}
</script>

<style lang="scss" scoped>
// TODO: Confusing class naming, fix.
.card {
	position: relative;
	height: var(--card-height);
	width: var(--card-width);
	margin: var(--card-margin);
	cursor: pointer;
	user-select: none;
}

.role {
	width: 100%;
	height: 100%;
	border-radius: var(--radius);
	transition: all 0.2s ease;

	&:hover {
		box-shadow: var(--shadow);
	}

	&--hidden {
		background: #fff;
		border: 1px solid var(--border-color);
		box-shadow: 0 2px 4px rgba(3, 27, 78, 0.06);
	}

	&--revealed {
		&--red {
			background: url('~@/assets/images/red_agent.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position-y: -15px;
		}

		&--blue {
			background: url('~@/assets/images/blue_agent.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position-y: -15px;
		}

		&--bystander {
			background: url('~@/assets/images/bystander.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position-y: -15px;
		}

		&--assassin {
			background: url('~@/assets/images/assassin.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position-y: -15px;
		}
	}
}

.spymaster {
	&--red {
		border: 1px solid rgb(255, 221, 221);
		border-bottom: 2px dashed rgb(202, 72, 72);
		background: rgb(255, 230, 230);
		color: rgb(172, 35, 35);

		// Experimental
		//&:hover {
		//box-shadow: 1px 10px 30px 0 rgba(228, 88, 88, 0.3) !important;
		//}
	}

	&--blue {
		border: 1px solid rgb(182, 211, 255);
		border-bottom: 2px solid rgb(67, 142, 255);
		background: rgb(222, 235, 255);
		color: rgb(0, 54, 136);
	}

	&--bystander {
		background: rgb(255, 249, 238);
		color: rgb(116, 104, 81);
		border: 1px solid rgb(255, 233, 192);
	}

	&--assassin {
		border-bottom: 2px solid #000;
		background: rgb(73, 73, 73);
		color: #fff;
	}
}

.text {
	&--word {
		position: absolute;
		left: 50%;
		top: 50%;
		font-size: 1.1em;
		transform: translateX(-50%) translateY(-50%);
		transition: all 0.3s ease;
		border: 1px transparent solid;
	}

	&--reveal {
		background: #000;
		color: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		padding: 4px 10px;
		border-radius: 40px;
		z-index: 10;
		transition: all 0.1s ease;
		box-shadow: 0 10px 20px rgba(3, 27, 78, 0.1);

		&:hover {
			background: #616161;
		}
	}
}

.isSelected {
	position: relative;
	transform: scale(1.1);
	box-shadow: 0 10px 20px rgba(3, 27, 78, 0.1);

	& .text--word {
		font-size: 0.75em;
		position: absolute;
		left: 50%;
		top: 85%;
		transform: translateX(-50%);
		background: #fff;
		border: 1px #eee solid;
		color: #000 !important;
		padding: 2px 12px;
		border-radius: 25px;
		box-shadow: 0 10px 20px rgba(3, 27, 78, 0.1);
	}
}

.isRevealed {
	cursor: not-allowed;

	&.spymaster {
		opacity: 0.3;
		&:hover {
			opacity: 1;
		}
		& .text--word {
			opacity: 0.9;
		}
	}

	&.role:hover {
		transform: none;
		box-shadow: none;
	}

	& .text--word {
		opacity: 0;
		background: #fff;
		padding: 4px 16px;
		border-radius: 25px;
		color: #000;
		box-shadow: 1px 10px 30px 0 rgba(0, 0, 0, 0.2);
	}

	&:hover .text--word {
		opacity: 1;
	}
}

// Vue animations
.animations {
	&--fade-enter-active,
	&--fade-leave-active {
		transition: opacity 0.3s ease;
	}
	&--fade-enter,
	&--fade-leave-to {
		opacity: 0;
	}
}
</style>
