<script lang="ts" setup></script>

<template>
    <div class="__formatter">
        <slot />
    </div>
</template>

<style lang="scss">
.__formatter {
	font-weight: 200;
    li {
        list-style: initial;
        margin: 0 1rem;
    }
    h2 {
        font-size: 1.75rem;
        margin: 1rem 0;
        font-weight: 800;
    }
}
</style>
