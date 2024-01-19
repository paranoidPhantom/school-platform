<script lang="ts" setup>
const { $pwa } = useNuxtApp();
</script>

<template>
    <header>
        <img src="/favicon.ico" alt="Logo" />
        <UBadge
            variant="subtle"
            class="flex gap-2 w-fit"
            v-if="$pwa && $pwa.isPWAInstalled"
            ><Icon name="heroicons:check-badge-16-solid" /> Установлено как
            приложение</UBadge
        >
        <UAvatar
            chip-color="primary"
            chip-position="top-right"
            size="sm"
			icon="i-heroicons-user-20-solid"
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt="Avatar"
        />
    </header>
</template>

<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;

    padding: 1rem;
    border-radius: 1rem;
    border-bottom: 1px solid rgb(var(--color-primary-DEFAULT) / 0.7);
}
</style>
