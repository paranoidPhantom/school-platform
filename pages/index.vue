<script setup lang="ts">
const title = "Расписание уроков блин (10Б, 23-24)"

</script>

<template>
    <title>{{ title }}</title>
    <h1 class="info">{{ title }}</h1>
    <PrimaryTable />
    <div class="mobile-indicator">
        <Icon class="icon" name="material-symbols:screen-rotation-outline"/>
        <span>Экран блин поверни</span>
    </div>
</template>

<style scoped lang="scss">
.info {
    text-align: center;
    width: 100%;
    margin: 1rem 0;
}

@keyframes spin {
    0% {
        rotate: 0deg;
    }
    100% {
        rotate: -360deg;
    }
}
.mobile-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: black;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    gap: 1rem;
    .icon {
        font-size: 3rem;
        animation: spin 1s infinite;
    }
}
@media (max-width: 600px) {
    .mobile-indicator {
        opacity: 1;
    }
}
</style>