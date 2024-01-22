<script lang="ts" setup>
const { params: { id: UID } } = useRoute()

const { data: user } = await useFetch("/api/userDataFromID", {
	query: {
		UID
	}
})

const providerIcons = {
	email: "tabler:mail-filled",
	discord: "fa6-brands:discord",
	google: "bi:google"
}
</script>

<template>
    <UCard class="m-8 sm:m-16">
		<h1 class="text-3xl flex items-center gap-4">
			<Icon class="opacity-10" :name="providerIcons[user.provider]" />
			<UAvatar :src="user.avatar_url" :alt="user.full_name" size="xl" />
			{{ user.full_name }}
		</h1>
		<div class="stats">
			<p class="text-xl flex items-center my-4 gap-2">
				<Icon class="text-2xl" name="material-symbols:counter-0-outline"/>
				- {{ user.coins || `???`}}
			</p>
		</div>
	</UCard>
</template>

<style lang="scss" scoped></style>