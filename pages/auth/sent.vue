<script lang="ts" setup></script>

<template>
    <div class="flex justify-center my-8 mx-4">
        <UCard class="w-fit p-8 items-center">
            <div class="wrap-note">
                <Icon name="line-md:confirm-circle-twotone" class="text-3xl" />
                <h1 class="text-2xl text-center">
                    На вашу почту отправлено письмо подтверждение.
                </h1>
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped>
.wrap-note {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
</style>
