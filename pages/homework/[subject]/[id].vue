<script setup lang="ts">
definePageMeta({
    title: "ДЗ какое-то..."
})

//

const { homework: hw_array } = useAppConfig()
const { params } = useRoute()
const { subject, id } = params

const homework = hw_array[subject][parseInt(id)]


const normalizeDate = (date: string | undefined) => {
    if (!date) { return date }
    const split = date.split("/")
    const d = split[0]
    const m = split[1]
    return `${d.length < 2 ? '0' + d : d}.${m.length < 2 ? '0' + m : m}`
}
</script>

<template>
    <div class="root">
        <main>
            <NuxtLink to="/">
                <Icon style="font-size: 2rem;" name="material-symbols:arrow-back-rounded" />
            </NuxtLink>
            <div class="text" v-html="homework.text"></div>
            <div class="attachments" v-if="homework.attachments?.length > 0">
                <ContentSlideshow :content="homework.attachments" prefix="/media/attachments/" />
            </div>
            <div class="dates">
                <p class="date">{{ homework.date ? `Задано:` : `` }} {{ normalizeDate(homework.date) }}
                </p>
                <p class="due-date">Нужно сдать: {{ normalizeDate(homework.date_due) }}</p>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
main {
    margin: 2rem 10%;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(1px);
    border-radius: 1rem;
    outline: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    gap: 1rem;
    flex-direction: column;

    .dates {
        display: flex;
        justify-content: space-between;

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

<style lang="scss">
main .text {
    h2 {
        font-size: 1.25rem;
        margin: 0.5rem 0;
        filter: drop-shadow(0 0.1rem 0.3rem white);
    }
    li {
        list-style: initial;
        margin-left: 1.5rem;
    }
}
</style>