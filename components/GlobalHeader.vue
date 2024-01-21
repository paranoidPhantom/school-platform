<script lang="ts" setup>
const { $pwa } = useNuxtApp();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const items = computed(() => {
    const route = useRoute();
    let retval: any[] = [
        [
            {
                slot: "account",
                disabled: true,
            },
        ],
    ];
    if (user.value) retval.push([
        {
            label: "Выложить ДЗ",
            icon: "i-heroicons-arrow-up-on-square-16-solid",
            href: "/homework/new"
        }],
        [{
            label: "Личный кабинет",
            icon: "i-heroicons-adjustments-vertical-20-solid",
            href: "/auth/me"
        },
    ]);
    retval.push([
        {
            label: user.value ? "Выйти" : "Авторизация",
            icon: "i-heroicons-arrow-right-start-on-rectangle-16-solid",
            href: user.value ? undefined : `/auth?flow_dest=${route.fullPath}`,
            click: user.value
                ? async () => {
                      await supabase.auth.signOut();
                      window.location.reload();
                  }
                : undefined,
        },
    ]);
	return retval;
});
</script>

<template>
    <header>
        <NuxtLink to="/">
            <img class="h-8" src="/icons/logo.png" alt="Logo" />
        </NuxtLink>
        <UTooltip
            text="Используеться технология PWA"
            v-if="$pwa && $pwa.isPWAInstalled"
        >
            <UBadge variant="subtle" class="flex gap-2 w-fit scale-90" size="xs"
                ><Icon name="heroicons:check-badge-16-solid" />Установлено как
                приложение</UBadge
            >
        </UTooltip>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <template #account="{ item }">
                <div class="text-left">
                    <p>
                        {{ user ? "Доброе утро," : "Вы не авторизованы..." }}
                    </p>
                    <p
                        :title="
                            user.user_metadata.full_name ||
                            useRandomNameFromKey(user.id)
                        "
                        v-if="user"
                        class="truncate max-w-40 font-medium text-gray-900 dark:text-white"
                    >
                        {{
                            user?.user_metadata.full_name ||
                            useRandomNameFromKey(user.id)
                        }}
                    </p>
                </div>
            </template>
            <UAvatar
                chip-color="primary"
                chip-position="top-right"
                size="sm"
                icon="i-heroicons-user-20-solid"
                alt="Avatar"
				img-class="object-cover"
				:src="user?.user_metadata.avatar_url"
            />
        </UDropdown>
    </header>
</template>

<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;

    padding: 1rem;
    border-radius: 1rem;
    border-bottom: 1px solid rgb(var(--color-primary-DEFAULT) / 0.7);
}
</style>
