<script setup lang="ts">
const supabase = useSupabaseClient();

const homework = useState("homework_global", () => {
    return {};
});

const { query } = useRoute();

const route = useRoute();
const router = useRouter();

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
		title: route.meta.title ? route.meta.title : undefined
	});
})

router.afterEach(() => (modal.value.open = false));
const toast = useToast();

onMounted(() => {
    document.documentElement.classList.add("dark");
    if (query.help === "true") {
        document.documentElement.classList.add("help-enabled");
    }
});

const loading = ref(true)

onMounted(async () => {
	loading.value = false
    homework.value = {};
    const { data } = await supabase.from("homework").select("*, comments(*)");
    data?.forEach((hw) => {
        const subj = hw.subject;
        if (!homework.value[subj]) homework.value[subj] = [];
        delete hw.subject;
        homework.value[subj].push(hw);
    });
});
</script>

<template>
	<div id="app_container">
		<ProfileSetup />
		<div v-if="loading" class="loader">
			<Icon style="margin: auto; font-size: 4rem; opacity: 0.5;" name="svg-spinners:ring-resize"/>
		</div>
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

body {
    margin: 0;
    background-color: rgb(10, 10, 10);
    opacity: 1;
    background-position: center;
    background-size: 20px 20px;

    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
}

.object-cover {
	* {
		object-fit: cover;
	}
}

.loader {
	display: flex;
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
    height: 100%;
}
</style>
