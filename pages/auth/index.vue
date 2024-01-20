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

const onSubmit = async (event: FormSubmitEvent<any>) => {
	const { error } = await supabase.auth.signInWithPassword(event.data)
	if (!error) router.push(route.query.flow_dest as string || '/')
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
				<UButton type="submit" variant="soft">Авторизоваться</UButton>
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
