<script setup lang="ts">
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const supabase = useSupabaseClient();

const homework = useState("homework_global", () => {
    return {};
});

const homework_arr = useState("homework_global_array", () => {
    return [];
});

const { query } = useRoute();

const route = useRoute();
const router = useRouter();

defineShortcuts({
    shift_a: () => {
        router.push("/homework/moderate");
    },
});

const modal = useState<{
    open: boolean;
    lesson: {
        subject: string;
        teacher: string;
        location: string;
    };
}>("global_modal", () => {
    return {
        open: false,
        lesson: {
            subject: "ru_l",
            teacher: "ev",
            location: "ru",
        },
    };
});

watchEffect(() => {
    useHead({
        titleTemplate: (title) =>
            title ? `${title} | 10Б` : `Домашнее задание | 10Б`,
        title: route.meta.title ? route.meta.title : undefined,
    });
});

router.afterEach(() => (modal.value.open = false));

onMounted(() => {
    document.documentElement.classList.add("dark");
    if (query.help === "true") {
        document.documentElement.classList.add("help-enabled");
    }
});

const loading = ref(true);

const recalculateHW = () => {
    homework_arr.value.forEach((hw) => {
        const subj = hw.subject;
        if (!homework.value[subj]) homework.value[subj] = [];
        homework.value[subj].push(hw);
    });
};

watch(homework_arr, recalculateHW);

onMounted(async () => {
    const wait = setInterval(() => {
        if (loading.value === false) clearInterval(wait);
        loading.value = false;
    }, 100);

    homework.value = {};
    const { data } = await supabase.from("homework").select("*");
    homework_arr.value = data;
});

const handle_postgres_changes = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
) => {
    const hw = payload.eventType !== "DELETE" ? payload.new : payload.old;
    switch (payload.eventType) {
        case "INSERT":
            homework_arr.value.push(hw);
            break;
        case "UPDATE":
            homework_arr.value.forEach((hw_checking, index: number) => {
                if (hw_checking.id === hw.id) {
                    homework_arr.value[index] = hw;
                }
            });
            break;
        case "DELETE":
            homework_arr.value.forEach((hw_checking, index: number) => {
                if (hw.id === hw_checking.id) {
                    homework_arr.value.splice(index, 1);
                }
            });
            break;
    }
};

const listener = supabase
    .channel("custom-all-channel")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "homework" },
        handle_postgres_changes
    )
    .subscribe();
</script>

<template>
    <div id="app_container">
        <NuxtLoadingIndicator color="rgb(var(--color-primary-DEFAULT))" />
        <ProfileSetup />
        <Transition name="loader">
            <div v-if="loading" class="loader">
                <Icon
                    style="font-size: 4rem; opacity: 0.5"
                    name="svg-spinners:ring-resize"
                />
                <p style="font-size: 1.5rem; opacity: 0.8">Доброе утро!</p>
            </div>
        </Transition>
        <Head>
            <Link
                rel="apple-touch-icon"
                href="/icons/apple_homework.png"
                sizes="180x180"
            />
        </Head>
        <GlobalHeader />
        <NuxtPwaManifest />
        <ModalWindow />
        <NuxtPage />
        <UNotifications />
    </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap");

html,
body {
    max-width: 100vw;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

body {
    margin: 0;
    opacity: 1;
    background-position: center;
    background-size: 20px 20px;

    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
}

.app_container {
    overflow-x: hidden;
}

.object-cover {
    * {
        object-fit: cover;
    }
}

.loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    position: fixed;
    z-index: 103;
    inset: 0;
    background-color: rgb(10, 10, 10);
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
button,
a,
span {
    color: rgb(230, 230, 230);
    opacity: 0.95;
}

.upd-notice {
    display: flex;
    gap: 2rem;
    position: fixed;
    inset: 0;
    top: unset;
    padding: 1rem;
    z-index: 2;
}

.loader-enter-from,
.loader-leave-to {
    opacity: 0;
    > p {
        opacity: 0 !important;
    }
}

.loader-enter-active,
.loader-leave-active {
    transition: all 0.5s ease-in-out 0.2s;
    p {
        transition: all 0.5s;
    }
}

.page-enter-from,
.page-leave-to {
    translate: -5% 0;
    opacity: 0;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.3s;
    position: absolute;
    width: 100%;
}
</style>
