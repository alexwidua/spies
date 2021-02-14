<template>
	<div class="roles">
		<div class="roles--title">Role</div>
		<div class="roles__menu">
			<span
				v-show="!isSpymaster || gameMenuExpanded"
				@click="assignRole('spy')"
				class="roles__menu__select"
				:class="{ 'roles__menu--isSelected': !isSpymaster }"
			>
				Spy
				<span
					class="roles__menu__select--amount"
					v-html="roles.spy.length"
				/>
			</span>
			<span
				v-show="isSpymaster || gameMenuExpanded"
				@click="assignRole('spymaster')"
				class="roles__menu__select"
				:class="{ 'roles__menu--isSelected': isSpymaster }"
			>
				Spymaster
				<span
					class="roles__menu__select--amount"
					v-html="roles.spymaster.length"
				/>
			</span>
		</div>
	</div>
</template>

<script>
/*
 *	Name: GameRole
 *
 *	Component containing the logic to display and change roles between clients.
 *
 */

import { mapState, mapActions } from 'vuex'

export default {
	name: 'GameRole',
	data() {
		return {
			socketId: '',
			defaultRole: 'spy',
			roles: { spy: [], spymaster: [] }
		}
	},
	computed: {
		...mapState(['role', 'board', 'gameMenuExpanded']),
		isSpymaster() {
			if (this.role === 'spymaster') return true
			else return false
		}
	},

	methods: {
		...mapActions(['updateRole']),
		/*
		 *	Util to remove current role from roles object. Is used in assignRole().
		 */
		_dismissRole() {
			for (let key in this.roles) {
				for (let i = 0; i < this.roles[key].length; i++) {
					if (this.roles[key][i].indexOf(this.socketId) > -1) {
						this.roles[key].splice(i, 1)
					}
				}
			}
		},
		/*
		 *	Assign new role.
		 *	@Param: Role
		 *			<'spy'> or <'spymaster'>
		 */
		assignRole(roleParam) {
			if (roleParam === 'spy' || roleParam === 'spymaster') {
				this._dismissRole()
				this.roles[roleParam].push(this.socketId)
				let obj = {
					room: this.$route.params.id,
					roles: this.roles
				}
				this.$socket.client.emit('update_roles', obj)
				this.updateRole(roleParam)
			}
		}
	},
	sockets: {
		/*
		 *  When a new client connects to the server, the server emits init_client.
		 *	@Param: The clients socketId, which gets handled by the socket server,
		 *			<abcdefghijklmnopqrstuvwxyz1234567890>
		 */
		init_client(socketId) {
			// 1. Store the socketId for later use. TODO: Move to vuex
			this.socketId = socketId
			// 2. Push own socketId to the roles array.
			this.roles[this.defaultRole].push(socketId)
		},
		/*
		 *	Every new connected client requests the current board state.
		 *	@Param: SocketId of the client requesting the state,
		 *			<abcdefghijklmnopqrstuvwxyz1234567890>
		 */
		request_roles_state(socketId) {
			// 1. Push new connected socket id into roels array before emitting.
			this.roles[this.defaultRole].push(socketId)
			// 2. Create an Object containing the current route, board and roles and emit to socket server.
			let roles = {
				room: this.$route.params.id,
				roles: this.roles
			}
			this.$socket.client.emit('send_roles_state', roles)
		},
		/*
		 *	For new connected clients: receive the requested role state.
		 *	@Param: Roles object emitted from the socket server,
		 *			<{ spy: [], spymaster: [] }>
		 */
		receive_roles_state(roles) {
			this.roles = roles
		},
		/*
		 *	If a client changes roles, a change event gets emitted to the server.
		 *	This socket contains the new updated roles object.
		 *	@Param:	Updated roles object emitted from the socket server
		 *			<{ spy: [], spymaster: [] }>
		 *
		 *	TODO: Only emit changed role instead of whole object.
		 */
		receive_updated_roles(roles) {
			this.roles = roles
		},
		/*
		 *	If a client leaves the room or refreshes the page, the client gets dropped
		 *	from the roles list
		 *	@Param: SocketId from client that left the room,
		 *			<abcdefghijklmnopqrstuvwxyz1234567890>
		 */
		drop_role(socketId) {
			for (let key in this.roles) {
				for (let i = 0; i < this.roles[key].length; i++) {
					if (this.roles[key][i].indexOf(socketId) > -1) {
						this.roles[key].splice(i, 1)
					}
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.roles {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	color: #808fa5;

	&--title {
		font-weight: bold;
		text-transform: uppercase;
		color: rgba(3, 27, 78, 0.7);
		letter-spacing: 0.06em;
	}

	&__menu {
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		font-size: 1.75em;

		&__select {
			cursor: pointer;
			opacity: 0.5;

			&--amount {
				background: rgba(0, 0, 0, 0.1);
				width: 40px;
				height: 40px;
				display: inline-block;
				text-align: center;
				border-radius: 100%;
				margin-left: 0.1em;
			}
		}

		// TODO: Change units.
		&--isSelected {
			font-weight: 600;
			opacity: 1;
		}
	}
}

// Inherited from parent GameBar.vue, TODO: Proper css classing.
.bar--collapsed .roles {
	font-size: 0.7em;
	justify-content: flex-start;
}
</style>
