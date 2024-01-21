<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from "#ui/types";

const supabase = useSupabaseClient()

definePageMeta({
    title: "Авторизация",
});

const state = reactive({
    email: undefined,
    password: undefined,
});

const route = useRoute()
const router = useRouter()

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.email) errors.push({ path: "email", message: "Обязательное поле" });
    if (!state.password) errors.push({ path: "password", message: "Обязательное поле" });
    return errors;
};

const loading = ref(false)
const toast = useToast()

const onSubmit = async (event: FormSubmitEvent<any>) => {
	if (loading.value) return
	loading.value = true
	const { error } = await supabase.auth.signInWithPassword(event.data)
	if (error) {
		const { data: userExists } = await useFetch("/api/userWithEmailExists", {
			query: {
				email: event.data.email,
			}
		})
		if (userExists.value) {
			toast.add({
				title: "Ошибка авторизации",
				description: error.message,
				color: "red",
				timeout: 5000,
			})
			loading.value = false
		} else {
			const { error } = await supabase.auth.signUp(event.data)
			if (!error) router.push("/auth/sent")
			else loading.value = false
		}
	}
	else router.push(route.query.flow_dest as string || '/')
}
</script>

<template>
    <div class="__auth">
        <UForm
            :validate="validate"
            :state="state"
            class="space-y-4 ring-1 p-12 rounded-xl"
            @submit="onSubmit"
        >
			<h1 class="text-2xl">Войдите в свой аккант</h1>
            <hr class="w-9/12 mx-auto opacity-10">
			<UFormGroup label="Email" name="email">
                <UInput v-model="state.email" />
            </UFormGroup>

            <UFormGroup label="Пароль" name="password">
                <UInput v-model="state.password" type="password" />
            </UFormGroup>
			<div class="flex justify-center">
				<UButton :loading="loading" type="submit" variant="soft">Авторизоваться</UButton>
			</div>
            <hr class="w-9/12 mx-auto opacity-10">
			<OAuthProviders />
        </UForm>
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
