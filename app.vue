<script setup lang="ts">
const { query } = useRoute()

onMounted(() => {
	document.documentElement.classList.add("dark")
	if (query.help === "true") {
		document.documentElement.classList.add("help-enabled")
	}
})
</script>

<template>
	<NuxtPage />
</template>

<style lang="scss">
body {
	margin: 0;
	background-color: #000000;
	opacity: 1;
	background-position: center;
	background-image: radial-gradient(rgba(255,255,255,0.4) 0.5px, rgb(10,10,10) 0.5px);
	background-size: 20px 20px;
}

h1,h2,h3,h4,h5,h6,p,button,a, span {
    color: white;
    font-family: sans-serif;
}

.page-enter-from,
.page-leave-to {
	translate: -5% 0;
	opacity: 0;
}

.page-enter-active,
.page-leave-active {
	transition: all 0.3s;
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>