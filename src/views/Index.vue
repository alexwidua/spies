<template>
	<div class="main">
		<div class="hero-text">
			Spies is an adaptation of the well-known board game Codenames by
			Vlaada Chvátil using Vue and socket.io.
		</div>
		<Join />
		<div class="create-container">
			<div class="create-game--heading">Create a game</div>
			<div class="create-game">
				<Settings />
				<Generate />
			</div>
		</div>
	</div>
</template>

<script>
/*
 *	Name: Index
 *
 *	Vue app index. TODO: Change structure?
 *
 */

import Join from '@/components/BoardCreation/CreateButtonJoin.vue'
import Settings from '@/components/BoardCreation/CreateSectionSettings.vue'
import Generate from '@/components/BoardCreation/CreateButtonGenerate.vue'

export default {
	name: 'Index',
	components: {
		Join,
		Settings,
		Generate
	}
}
</script>

<style lang="scss">
.main {
	height: 100vh;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	background: var(--primary-color);
}

.hero-text {
	width: 30%;
	text-align: center;
	font-size: 1.7em;
	color: #fff;
	font-weight: 600;
}

// TODO: Move to Base
h1 {
	font-size: 2em;
	color: #fff;
}

p {
	font-size: 1.2em;
	color: #fff;
}

.create-game {
	width: var(--content-width);
	background: #fff;
	border-radius: var(--radius);

	&--heading {
		font-size: 1.1em;
		font-weight: 600;
		color: rgb(193, 225, 255);
		text-transform: uppercase;
		line-height: 5em;
		margin-left: var(--space);
	}
}
</style>
