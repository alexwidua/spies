<template>
	<div>
		<GameMenu />
		<div class="container container--wide">
			<div class="board">
				<Card
					v-for="(card, index) in board"
					:key="index"
					:card="card"
					:index="index"
				/>
			</div>
		</div>
		<div class="board__link" v-html="'Board ID: ' + current_route" />
	</div>
</template>

<script>
/*
 *	Name: Board
 *
 *	This is the game board. It is responsible to display all the game cards and
 *	handle update new clients with the board state.
 *
 */

import Card from '@/components/Game/Card.vue'
import GameMenu from '@/components/Game/GameMenu.vue'
import { mapState, mapMutations } from 'vuex'

export default {
	name: 'Board',
	data() {
		return {
			socketId: '',
			roles: { spies: [], spymasters: [] }
		}
	},
	methods: {
		...mapMutations(['setBoard', 'revealCard'])
	},
	components: {
		Card,
		GameMenu
	},
	computed: {
		...mapState(['board']),
		current_route() {
			return this.$route.params.id
		}
	},
	sockets: {
		/*
		 *  When a new client connects to the server, the server emits init_client.
		 *	@Param: The clients socketId, which gets handled by the socket server,
		 *	<abcdefghijklmnopqrstuvwxyz1234567890>
		 */
		init_client(socketId) {
			// 1. Store the socketId for later use. TODO: Move to vuex
			this.socketId = socketId
		},
		/*
		 *	Every new connected client requests the current board state.
		 */
		request_board_state() {
			// 1. Store the room number and current board (cards) in an object and emit to the socket server.
			let payload = {
				room: this.current_route,
				board: this.board
			}
			this.$socket.client.emit('send_board_state', payload)
		},
		/*
		 *	For new connected clients: receive the requested board state.
		 */
		receive_board_state(payload) {
			this.setBoard(payload) //--> Vuex mutations
		}
	},
	created() {
		/*
		 *	Tells the socket server that the clients wants to join a room.
		 *	This is in created instead of the connect-socket since the connect
		 *	socket doesn't fire properly if the client gets routed.
		 *
		 *	E.g. If the clients creates a board and gets routed
		 */
		this.$socket.client.emit('join_room', this.current_route)
	}
}
</script>

<style lang="scss" scoped>
.board {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;

	&__link {
		margin: 4em auto;
		width: 256px;
		text-align: center;
		font-family: 'IBM Plex Mono';
		font-weight: 600;
		color: rgba(0, 0, 0, 0.2);
	}
}
</style>
