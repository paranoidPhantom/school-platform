<script lang="ts" setup></script>

<template>
    <div class="__formatter">
		<slot />
    </div>
</template>

<style lang="scss">
.__formatter {
	ul li {
		list-style: disc;
    }
	ol li {
		list-style: decimal;
    }
	li {
		margin-left: 2rem;
	}
    h1 {
        font-size: xx-large;
        font-weight: 700;
    }

    h2 {
        font-size: x-large;
        font-weight: 600;
    }

    h3 {
        font-size: larger;
        font-weight: 500;
    }

    hr {
        opacity: 0.15;
		margin: 1rem 0;
    }

    a {
        color: rgb(var(--color-primary-DEFAULT));
        text-decoration: underline 1px dotted;
    }
}
</style>
