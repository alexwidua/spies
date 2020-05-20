<template>
	<div class="join">
		<div class="join--heading">Join a game</div>
		<div class="join--flex">
			<input class="join__input" v-model="boardID" />
			<button class="join__button" @click="joinRoom()">Join</button>
		</div>
	</div>
</template>

<script>
/*
 *	Name: CreateButtonJoin
 *
 *	Input field to join a specific room, given a room id is entered.
 *
 */

export default {
	name: 'JoinRoom',
	data() {
		return {
			boardID: ''
		}
	},
	methods: {
		/*
		 *	Joins the room id entered in the input field. Param is the boardID v-model.
		 */
		joinRoom() {
			this.$router.push({ path: `/user/${this.boardID}` })
		}
	}
}
</script>

<style lang="scss" scoped>
.join {
	margin: var(--space) 0;
	width: var(--content-width);
	padding: var(--space);

	&--heading {
		font-size: 1.1em;
		font-weight: 600;
		text-transform: uppercase;
		line-height: 5em;
		color: rgb(193, 225, 255);
	}

	&--flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__input {
		height: 60px;
		width: 50%;
		margin-right: 1em;
		padding: 0.5em;
		border: none;
		border-bottom: 1px solid #fff;
		background: rgba(0, 0, 0, 0.1);
		font-size: 1.2em;
		color: #fff;
	}

	&__button {
		width: 50%;
		height: 60px;
		font-size: 1.2em;
		font-weight: 600;
		color: var(--primary-color);
		border: none;
		border-radius: var(--radius);
	}
}
</style>
