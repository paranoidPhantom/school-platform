<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { computedAsync } from "@vueuse/core";
definePageMeta({
    title: "Задание",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { params } = useRoute();
const { subject, id } = params;

const homework = ref();
const author = ref();
const route = useRoute();

interface commentFetched {
    id: number;
    created_at: string;
    descendant_of: number;
    content: string;
    author_id: string;
}

interface comment {
    id: number;
    content: string;
    author: {
        full_name: string;
        avatar_url: string;
    };
    time: string;
}

const localComments = ref<commentFetched[]>([]);

const comments = computedAsync<comment[]>(async () => {
    if (homework.value && homework.value.comments) {
        const retval: comment[] = [];
        const arr = localComments.value
            .concat(homework.value.comments)
            .sort((a, b) => {
                return a.created_at < b.created_at
                    ? 1
                    : a.created_at > b.created_at
                    ? -1
                    : 0;
            }) as commentFetched[];
        for (let i = 0; i < arr.length; i++) {
            const comment = arr[i];
            const dateObj = new Date(comment.created_at);
            const time = `${dateObj.toLocaleTimeString(
                "ru"
            )} - ${dateObj.toLocaleDateString("ru")}`;
            const { data } = await useFetch("/api/userDataFromID", {
                query: {
                    UID: comment.author_id,
                },
            });
            retval.push({
                content: comment.content,
                author:
                    Object.keys(data.value).length > 0
                        ? data.value
                        : {
                              full_name: useRandomNameFromKey(
                                  comment.author_id
                              ),
                          },
                time,
                id: comment.id,
            });
        }
        return retval;
    }
}, null);

onMounted(async () => {
    const { data: fetchedHW } = await supabase
        .from("homework")
        .select("*, comments(*)")
        .eq("id", id)
        .eq("subject", subject)
        .single();
    homework.value = fetchedHW;
    if (!fetchedHW) return;
    const { data: fetchedAuthor } = await useFetch("/api/userDataFromID", {
        query: {
            UID: fetchedHW.author,
        },
    });
    author.value = fetchedAuthor.value;
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

const commentState = reactive({
    input: "",
});

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.input)
        errors.push({ path: "input", message: "Обязательное поле" });
    return errors;
};

const onSubmit = async (event: FormSubmitEvent<any>) => {
    if (!user.value) return;
    const content = event.data.input;
    const created_at = new Date().toISOString();
    const pushObject = {
        content,
        author_id: user.value.id,
        descendant_of: homework.value.id,
        created_at,
    };
    const { error } = await supabase.from("comments").insert(pushObject as any);
    commentState.input = "";
    if (error) commentState.input = content;
    else localComments.value.push(pushObject as commentFetched);
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
        <hr
            style="width: 80%; max-width: 35rem; opacity: 0.1; margin: 0 auto"
        />
        <section class="comments">
            <UAlert
                :icon="
                    user
                        ? `i-heroicons-pencil-square-20-solid`
                        : `i-heroicons-user-20-solid`
                "
                :title="
                    user
                        ? 'Оставьте коммениарий'
                        : `Войдите чтобы комментировать`
                "
            >
                <template #description>
                    <template v-if="user">
                        <UForm
                            @submit="onSubmit"
                            :validate="validate"
                            :state="commentState"
                        >
                            <UFormGroup name="input">
                                <UTextarea
                                    resize
                                    class="my-4"
                                    placeholder="Ваш комментарий"
                                    v-model="commentState.input"
                                />
                            </UFormGroup>
                            <UButton
                                class="mt-4"
                                type="submit"
                                variant="soft"
                                label="Оставить"
                            />
                        </UForm>
                    </template>
                    <UButton
                        v-else
                        class="mt-2"
                        label="Войти"
                        variant="soft"
                        :to="`/auth?flow_dest=${route.fullPath}`"
                    />
                </template>
            </UAlert>
            <UAlert
                class="w-10/12"
                v-for="comment in comments"
                :ui="{ avatar: { base: 'object-cover' } }"
                :avatar="{
                    src: comment.author.avatar_url,
                    alt: comment.author.full_name,
                }"
                :title="comment.author.full_name"
                :description="comment.content"
            />
        </section>
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
