<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {}
</script>
<style lang="scss">
// TODO: Move container to _container.scss
.container {
	max-width: var(--content-width);
	margin: 0 auto;

	&--wide {
		max-width: calc(var(--content-width) * 1.5);
	}
}
</style>
