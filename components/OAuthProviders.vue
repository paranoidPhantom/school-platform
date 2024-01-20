<script lang="ts" setup>
import type { Provider } from "@supabase/supabase-js";
const props = defineProps<{
	redirect?: string;
}>()

const { auth } = useSupabaseClient();

const authenticateWithOAuth = async (provider: Provider) => {
    await auth.signInWithOAuth({
        provider: provider,
		options: {
			redirectTo: window.location.origin + "/callback"
		}
    });
};

const providers: {
    icon: string;
    key: Provider;
}[] = [
    {
        icon: "bxl:google",
        key: "google",
    },
    {
        icon: "bxl:discord-alt",
        key: "discord",
    },
];
</script>

<template>
    <div class="oauth flex gap-4 justify-center">
        <UButton
            v-for="provider in providers"
            :key="provider.key"
			variant="soft"
			size="xl"
            @click="authenticateWithOAuth(provider.key)"
        >
            <Icon :name="provider.icon" />
        </UButton>
    </div>
</template>

<style lang="scss" scoped></style>
