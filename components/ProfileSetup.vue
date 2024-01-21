<script lang="ts" setup>
import type { FormSubmitEvent } from "#ui/types";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const enabled = ref(false);

const state = reactive({
	full_name: "",
	avatar_url: ""
})

onMounted(() => {
    if (user.value) {
        if (
            !user.value.user_metadata.full_name
        ) {
            enabled.value = true;
        }
    }
});

const onSubmit = async (event: FormSubmitEvent<any>) => {
    const { error } = await useFetch("/api/userUpdateFromID", {
		method: "POST",
        body: {
			full_name: event.data.full_name,
            avatar_url: event.data.avatar_url
		},
		query: {
			UID: user.value?.id
		}
	})
	if (!error.value) {
		await supabase.auth.refreshSession()
		enabled.value = false
	}
}
</script>

<template>
    <ClientOnly>
        <UModal v-model="enabled" v-if="user">
            <UCard class="p-4">
                <h1 class="text-2xl">У вас не настроен профиль!</h1>
                <hr class="my-4 opacity-10" />
                <p class="my-2">
                    На данный момент у вас нет имени, поэтому вам было дано
                    временное имя<UBadge
                        class="ml-2"
                        variant="subtle"
                        size="md"
                        :label="useRandomNameFromKey(user.id)"
                    />
                </p>
                <hr class="my-4 opacity-10" />
				<UForm @submit="onSubmit" :state="state">
					<h1 class="text-2xl">Введите новое имя:</h1>
					<UInput class="my-2" :placeholder="useRandomNameFromKey(user.id)" v-model="state.full_name" />
					<hr class="my-4 opacity-10" />
					<h1 class="text-2xl">Введите ссылку на автарку:</h1>
					<p class="text-sm opacity-50 my-2">(Извиняйте, платить за серваки куда вы будете грузить свои говноавтарки я не буду)</p>
					<UInput class="my-2" placeholder="https://example.com/avatar.png" v-model="state.avatar_url" />
                    <UAvatar
						size="2xl"
                        :src="state.avatar_url"
                        icon="i-heroicons-photo-16-solid"
                        class="m-2"
                        img-class="object-cover"
                    />
					<hr class="my-4 opacity-10" />
					<UButton type="submit" label="Готово" variant="soft" :disabled="!state.full_name" />
				</UForm>
            </UCard>
        </UModal>
    </ClientOnly>
</template>

<style lang="scss" scoped></style>
