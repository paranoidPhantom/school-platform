<script lang="ts" setup>
definePageMeta({
    title: "Авторизация",
});
</script>

<template>
    <div class="__auth">
        <div class="space-y-4 ring-primary-600 ring-1 p-12 rounded-xl">
            <h1 class="text-2xl">Войдите в свой аккант</h1>
            <hr class="w-9/12 mx-auto opacity-10" />

            <OAuthProviders />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.__auth {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 8rem);
}
</style>
