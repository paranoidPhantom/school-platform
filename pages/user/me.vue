<script lang="ts" setup>
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
	middleware: ["auth"]
})

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const state = reactive({
    full_name: "",
    avatar_url: "",
});

const onSubmit = async (event: FormSubmitEvent<any>) => {
    const { error } = await useFetch("/api/userUpdateFromID", {
        method: "POST",
        body: {
            full_name: event.data.full_name,
            avatar_url: event.data.avatar_url,
        },
        query: {
            UID: user.value?.id,
        },
    });
    if (!error.value) {
        await supabase.auth.refreshSession();
    }
};

onMounted(() => {
    if (user.value) {
        state.full_name = user.value.user_metadata.full_name;
        state.avatar_url = user.value.user_metadata.avatar_url;
    }
});
</script>

<template>
	<div class="__lk">
		<ClientOnly>
			<UCard class="m-8 p-4">
				<h1 class="text-2xl">Личный кабинет</h1>
				<hr class="my-4 opacity-10" />
				<UForm @submit="onSubmit" :state="state">
					<UFormGroup label="Изменить имя">
						<UInput
							class="my-2"
							:placeholder="
								user?.user_metadata.full_name ||
								useRandomNameFromKey(user?.id)
							"
							v-model="state.full_name"
						/>
					</UFormGroup>
					<hr class="my-4 opacity-10" />
					<UFormGroup label="Изменить аватарку" hint="Ссылка на картинку">
						<UInput
							class="my-2"
							:placeholder="
								user?.user_metadata.avatar_url ||
								`https://example.com/avatar.png`
							"
							v-model="state.avatar_url"
						/>
						<UAvatar
							size="2xl"
							:src="state.avatar_url"
							icon="i-heroicons-photo-16-solid"
							class="m-2"
							img-class="object-cover"
						/>
					</UFormGroup>
					<UButton
						type="submit"
						label="Готово"
						variant="soft"
						:disabled="!state.full_name"
						class="mt-2"
					/>
				</UForm>
			</UCard>
		</ClientOnly>
	</div>
</template>

<style lang="scss" scoped></style>
