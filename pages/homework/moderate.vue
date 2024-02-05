<script lang="ts" setup>
definePageMeta({
    middleware: [
        "auth",
        (to, from) => {
            if (process.server) {
                const user = useSupabaseUser();
                if (!user.value?.app_metadata.moderator) return navigateTo("/");
            }
        },
    ],
});

const {
    schedule: { subjects: _subjects },
} = useAppConfig();


const supabase = useSupabaseClient()
const { data: { session: { access_token } } } = await supabase.auth.getSession()

const homework = ref([])

const refreshHW = async () => {
	const { data } = await useFetch("/api/allHomework", {
		headers: {
			access_token: access_token
		}
	})
	homework.value = data.value
        .sort((a, b) => {
            return a.created_at < b.created_at
                ? 1
                : a.created_at > b.created_at
                ? -1
                : 0;
        })
        .filter((entry) => {
            return !entry.approved;
        });
}

const normalizeDate = (date: string | undefined) => {
    if (!date) {
        return date;
    }
    const split = date.split("/");
    const d = split[0];
    const m = split[1];
    return `${d.length < 2 ? "0" + d : d}.${m.length < 2 ? "0" + m : m}`;
};

const approveID = async (ID: number) => {
	await useFetch("/api/moderationAction", {
		query: {
			ID,
			action: "approve",
		},
		method: "POST",
		headers: {
			access_token: access_token
		}
	})
	refreshHW()
}

const deleteID = async (ID: number) => {
	await useFetch("/api/moderationAction", {
		query: {
			ID,
			action: "delete",
		},
		method: "POST",
		headers: {
			access_token: access_token
		}
	})
	refreshHW()
}


onMounted(() => {
	setTimeout(refreshHW, 1);
})
</script>

<template>
    <div class="__moderate-hw p-4 sm:p-16">
        <UCard class="card">
            <div class="content">
                <div class="list">
                    <h4 class="text-2xl text-center">Модерация ДЗ</h4>
                    <Icon
                        v-if="!homework"
                        style="margin: 1rem 45%; font-size: 2rem; opacity: 0.5"
                        name="svg-spinners:ring-resize"
                    />
                    <template v-else-if="homework.length === 0">
                        <Icon
                            style="
                                margin: 1rem calc(50% - 1rem);
                                font-size: 2rem;
                                opacity: 0.5;
                            "
                            name="bi:database-x"
                        />
                        <p class="text-center">Всё чисто!</p>
                    </template>
                    <UCard
                        :to="`/homework/${assignment.subject}/${assignment.id}`"
                        v-for="assignment in homework"
                        class="my-12"
                    >
                        <h2 class="text-2xl">
                            <Icon
                                :name="_subjects[assignment.subject].icon"
                                class="mr-4"
                            />{{ _subjects[assignment.subject].full }}
                        </h2>
                        <hr class="opacity-15 my-4" />
                        <ContentFormatter class="primary opacity-50"
                            ><MDC tag="div" :value="assignment.md_text"
                        /></ContentFormatter>
                        <hr class="opacity-15 my-4" />

                        <div class="flex justify-between my-4">
                            <p class="date">
                                {{ assignment.date ? `Задано:` : `` }}
                                {{ normalizeDate(assignment.date) }}
                            </p>
                            <p class="due-date">
                                Нужно сдать:
                                {{ normalizeDate(assignment.date_due) }}
                            </p>
                        </div>
						<div class="flex gap-4 flex-wrap">
							<UButton @click="approveID(assignment.id)" color="green" variant="soft" label="Одобрить" icon="i-heroicons-check-badge-16-solid" />
							<UButton @click="deleteID(assignment.id)" color="red" variant="soft" label="Отклонить" icon="i-heroicons-x-circle-16-solid"/>
							<NuxtLink
								class="details"
								:to="`/homework/${assignment.subject}/${assignment.id}`"
								target="_blank"
							>
								<UButton color="white" label="Страница ДЗ" />
							</NuxtLink>
						</div>
                    </UCard>
                </div>
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>
