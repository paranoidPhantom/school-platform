<script setup lang="ts">
const {
    schedule: { subjects: _subjects },
} = useAppConfig();
const _homework = useState<null | []>("homework_global_array", () => {
    return null;
});

const defaultSubject = {
    id: undefined,
    label: "Любой",
    icon: "ic:outline-minus",
};

const filter_state = reactive({
    subject: defaultSubject,
    date: undefined,
});

const homework = computed(() => {
    if (_homework === null) return null;
    return _homework.value
        .sort((a, b) => {
            return a.created_at < b.created_at
                ? 1
                : a.created_at > b.created_at
                ? -1
                : 0;
        })
        .filter((assignment) => {
            if (filter_state.subject.id) {
                if (assignment.subject !== filter_state.subject.id) {
                    return false;
                }
            }
            if (filter_state.date) {
                if (!assignment.date_due.startsWith(filter_state.date)) {
                    return false;
                }
            }

            return true;
        });
});

const subjects = computed(() => {
    const keys = Object.keys(_subjects);
    let retval = [defaultSubject];
    keys.forEach((key) => {
        retval.push({
            id: key,
            icon: _subjects[key].icon,
            label: _subjects[key].full,
        });
    });
    return retval;
});

const normalizeDate = (date: string | undefined) => {
    if (!date) {
        return date;
    }
    const split = date.split("/");
    const d = split[0];
    const m = split[1];
    return `${d.length < 2 ? "0" + d : d}.${m.length < 2 ? "0" + m : m}`;
};

let tomorrow: string | Date = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow = `${tomorrow.getDate() > 9 ? '' : '0'}${tomorrow.getDate()}/${tomorrow.getMonth() > 9 ? '' : '0'}${tomorrow.getMonth()}/${tomorrow.getFullYear()}`
</script>

<template>
    <main class="__home-page">
        <PrimaryTable />
        <hr class="mx-10 opacity-20" />
        <UCard class="card">
            <div class="content">
                <div class="filters">
                    <h4 class="text-2xl text-center">Фильтры</h4>
                    <UFormGroup label="Предмет" name="subject">
                        <UInputMenu
                            :options="subjects"
                            v-model="filter_state.subject"
                        >
                            <template #option="{ option }">
                                <Icon :name="option.icon" />
                                <span class="truncate">{{ option.label }}</span>
                            </template>
                        </UInputMenu>
                    </UFormGroup>
					<hr class="opacity-10">
                    <UFormGroup label="Дата (сдачи)" name="date_due" hint="Формат ДД/ММ/ГГГГ">
                        <UInput v-model="filter_state.date" placeholder="Любая" />
						<div class="flex gap-2 my-2">
							<UButton variant="soft" @click="filter_state.date = ''">Любая</UButton>
							<UButton variant="soft" @click="filter_state.date = tomorrow">Завтра</UButton>
						</div>
                    </UFormGroup>
                </div>
                <div class="list">
                    <h4 class="text-2xl text-center">Домашнее задание</h4>
                    <Icon
                        v-if="!homework"
                        style="margin: 1rem 45%; font-size: 2rem; opacity: 0.5"
                        name="svg-spinners:ring-resize"
                    />
                    <template v-else-if="homework.length === 0">
                        <Icon
                            style="
                                margin: 1rem 45%;
                                font-size: 2rem;
                                opacity: 0.5;
                            "
                            name="bi:database-x"
                        />
                        <p class="text-center">Ничего не найдено...</p>
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

                        <NuxtLink
                            class="details"
                            :to="`/homework/${assignment.subject}/${assignment.id}`"
                        >
                            <UButton
                                variant="link"
                                trailing-icon="i-heroicons-arrow-right"
                                :label="
                                    assignment.comments.length > 0
                                        ? `Комментарии - ${assignment.comments.length}`
                                        : `Оставить комментарий`
                                "
                            />
                        </NuxtLink>
                    </UCard>
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
        .filters {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            padding: 1rem;
            width: 100%;
            flex-shrink: 3.5;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
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
