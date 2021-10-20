<template>
	<div class="container">
		<div class="canvas" id="canvas"></div>
		<div class="container__content">
			<div class="container__header">Collatz Conjecture</div>
			<div class="container__subheader">Analytics Coming Soon!</div>
		</div>
	</div>
</template>

<script>
import Collatz from "@/components/collatz";

export default {
	name: "Home",
	mixins: [Collatz],
	data() {
		return {};
	},
	mounted() {},
};
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	width: 100vw;
	height: 100vh;

	&__content {
		position: absolute;
		top: 80%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		text-align: center;
	}

	&__header {
		font-size: 4rem;
		letter-spacing: 0.1rem;
	}

	&__subheader {
		margin-top: 0.8rem;
	}
}

.canvas {
	position: absolute;
	top: 0;
	z-index: -1;
}
</style>
