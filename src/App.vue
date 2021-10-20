<template>
	<div class="app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: "App",
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@100;300;500;700&display=swap");

*,
*:before,
*:after {
	box-sizing: border-box;
	font-weight: 300;
	outline: none;
	font-family: "Raleway", sans-serif;
}

html,
body {
	font-size: 62.5%;
	border: 0;
	margin: 0;
	padding: 0;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
}

.app {
	font-size: 1.6rem;
}
</style>
