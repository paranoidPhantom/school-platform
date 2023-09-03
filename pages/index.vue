<script setup lang="ts">


</script>

<template>
    <PrimaryTable />
    <div class="mobile-indicator">
        <Icon class="icon" name="material-symbols:screen-rotation-outline"/>
    </div>
</template>

<style scoped lang="scss">
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
    align-items: center;
    justify-content: center;
    pointer-events: none;
    .icon {
        font-size: 3rem;
        animation: spin 1s infinite;
    }
}
@media (max-width: 800px) {
    .mobile-indicator {
        opacity: 1;
    }
}
</style>