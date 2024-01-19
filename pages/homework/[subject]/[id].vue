<script setup lang="ts">
definePageMeta({
    title: "ДЗ какое-то...",
});

//
const supabase = useSupabaseClient();
const { params } = useRoute();
const { subject, id } = params;

const homework = ref();

onMounted(async () => {
    const { data } = await supabase
        .from("homework")
        .select()
        .eq("id", id)
        .eq("subject", subject)
        .single();
    homework.value = data;
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
</script>

<template>
    <div class="root">
        <main>
            <NuxtLink to="/">
                <Icon
                    style="font-size: 2rem"
                    name="material-symbols:arrow-back-rounded"
                />
            </NuxtLink>
            <template v-if="homework">
                <ContentFormatter class="primary"
                    ><MDC tag="div" :value="homework.md_text"
                /></ContentFormatter>
                <div
                    class="attachments"
                    v-if="homework.attachments?.length > 0"
                >
                    <ContentSlideshow
                        :content="homework.attachments"
                        prefix="/media/attachments/"
                    />
                </div>
                <div class="dates">
                    <p class="date">
                        {{ homework.date ? `Задано:` : `` }}
                        {{ normalizeDate(homework.date) }}
                    </p>
                    <p class="due-date">
                        Нужно сдать: {{ normalizeDate(homework.date_due) }}
                    </p>
                </div>
            </template>
            <Icon
                style="margin: auto; font-size: 4rem; opacity: 0.5"
                v-else
                name="svg-spinners:ring-resize"
            />
        </main>
    </div>
</template>

<style scoped lang="scss">
main {
    display: flex;
    gap: 1rem;
    flex-direction: column;

    margin: 2rem 10%;
    min-height: calc(100vh - 4rem);
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(1px);
    border-radius: 1rem;
    outline: 1px solid rgba(255, 255, 255, 0.3);

    .dates {
        display: flex;
        justify-content: space-between;
        margin-top: auto;

        p {
            opacity: 0.7;
        }
    }
}

@media (max-width: 800px) {
    main {
        margin: 0.75rem;
        padding: 0.75rem;
    }
}
</style>
