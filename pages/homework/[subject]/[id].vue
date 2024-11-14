<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { computedAsync } from "@vueuse/core";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { params } = useRoute();
const { subject, id } = params;

const homework = ref();
const author = ref();
const route = useRoute();

const { data: fetchedHW } = await supabase
    .from("homework")
    .select("*")
    .eq("id", id)
    .eq("subject", subject)
    .single();
homework.value = fetchedHW;

const { data: fetchedAuthor } = await useFetch("/api/userDataFromID", {
    query: {
        UID: fetchedHW.author,
    },
});
author.value = fetchedAuthor.value;

const normalizeDate = (date: string | undefined) => {
    if (!date) {
        return date;
    }
    const split = date.split("/");
    const d = split[0];
    const m = split[1];
    return `${d.length < 2 ? "0" + d : d}.${m.length < 2 ? "0" + m : m}`;
};

const { data: ast } = (await useAsyncData("markdown", () =>
    parseMarkdown(homework.value.md_text)
)) as { data: any };

useHead({
    title: `${ast.value.data.title}`,
    meta: [
        {
            hid: "description",
            name: "description",
            content: ast.value.data.description || ast.value.data.title,
        },
        {
            hid: "og:title",
            property: "og:title",
            content: ast.value.data.title,
        },
        {
            hid: "og:description",
            property: "og:description",
            content: ast.value.data.description || ast.value.data.title,
        },
    ],
    htmlAttrs: {
        lang: "ru",
    },
});
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
                <NuxtLink
                    v-if="author"
                    :to="`/user/${homework.author}`"
                    class="author"
                >
                    <p class="text-xl flex items-center gap-4">
                        <UAvatar
                            :src="author.avatar_url"
                            :alt="author.full_name"
                            size="sm"
                        />
                        {{ author.full_name }}
                    </p>
                </NuxtLink>
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
    min-height: calc(50vh);
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
    .author {
        width: fit-content;
        padding: 0.5rem;
        border-radius: 1rem;
        transition: all 0.3s ease-in-out;
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
}

.comments {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    margin: 2rem 15%;
}

@media (max-width: 800px) {
    main {
        margin: 0.75rem;
        padding: 0.75rem;
    }
    .comments {
        margin: 0.75rem;
    }
}
</style>
