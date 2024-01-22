<script setup lang="ts">
</script>

<template>
    <main class="__home-page">
        <PrimaryTable />
		<UCard class="card" v-if="false">
			<div class="content">
				<div class="filters">
					<h4>Фильтры</h4>
				</div>
				<div class="divider"></div>
				<div class="list">
					
				</div>
			</div>
		</UCard>
    </main>
</template>

<style scoped lang="scss">

.card {
	max-width: min(1000px, 95%);
	margin: 2rem auto;
	.content {
		display: flex;
		align-items: center;
		.filters {
			padding: 1rem;
			width: 100%;
			flex-shrink: 3.5;
		}
		.divider {
			border-right: 1px solid rgba(255, 255, 255, 0.1);
			height: 100%;
        }
		.list {
			width: 100%;
			padding: 1rem;
		}
	}
}

@media (max-width: 600px) {
	.content {
		flex-wrap: wrap;
		.divider {
			display: none;
		}
	}
}
</style>