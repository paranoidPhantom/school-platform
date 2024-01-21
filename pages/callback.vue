<script setup lang="ts">
onMounted(() => {
	window.location.replace("/")
})
</script>

<template>
    <div class="__callback flex justify-center items-center">
        <Icon class="text-3xl" name="svg-spinners:ring-resize" />
    </div>
</template>

<style scoped lang="scss">
.__callback {
    height: 100vh;
}
</style>