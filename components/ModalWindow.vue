<script lang="ts" setup>
import type { teacher, location, lesson, subject } from "../types/db";
const { schedule } = useAppConfig();

const _homework = useState("homework_global", () => {
    return {};
});

const homework = computed(() => {
    let retval = {};
    const Keys = Object.keys(_homework.value);
    Keys.forEach((key) => {
        retval[key] = _homework.value[key].sort((a, b) => {
            return a.created_at < b.created_at
                ? 1
                : a.created_at > b.created_at
                ? -1
                : 0;
        });
    });
	return retval;
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

const normalizeDate = (date: string | undefined) => {
    if (!date) {
        return date;
    }
    const split = date.split("/");
    const d = split[0];
    const m = split[1];
    return `${d.length < 2 ? "0" + d : d}.${m.length < 2 ? "0" + m : m}`;
};

const currentLessonArray = computed(() => {
    return [modal.value.lesson];
});

const modal_tabs = [
    {
        label: "Домашнее задание",
        icon: "material-symbols:menu-book-outline-rounded",
        key: "hw",
    },
    {
        label: "Информация",
        icon: "material-symbols:info-outline",
        key: "info",
    },
];

const teacherString = (teacher: teacher) => {
    let output = "";
    if (Array.isArray(teacher)) {
        teacher.forEach((value, index) => {
            output = `${output}${index === 0 ? "" : " | "}${
                schedule.teachers[value]
            }`;
        });
    } else {
        output = schedule.teachers[teacher];
    }
    return output;
};

const locationString = (location: location) => {
    let output = "";
    if (Array.isArray(location)) {
        location.forEach((value, index) => {
            output = `${output}${index === 0 ? "" : " | "}${
                schedule.locations[value].short
            } (${schedule.locations[value].floor} этаж)`;
        });
    } else {
        output = `${schedule.locations[location].short} (${schedule.locations[location].floor} этаж)`;
    }
    return output;
};

const subjectData = (subject: keyof typeof schedule.subjects): subject => {
    return schedule.subjects[subject];
};
</script>

<template>
    <ClientOnly>
        <TransitionGroup name="modal">
            <div
                class="modal"
                v-if="modal.open"
                v-for="lesson in currentLessonArray"
                :key="JSON.stringify(lesson)"
            >
                <UTabs :items="modal_tabs" class="w-full">
                    <template #default="{ item, index, selected }">
                        <div class="flex items-center gap-2 relative truncate">
                            <Icon
                                :name="item.icon"
                                class="w-4 h-4 flex-shrink-0"
                            />
                            <span class="truncate">{{ item.label }}</span>
                            <span
                                v-if="selected"
                                class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"
                            />
                        </div>
                    </template>
                    <template #item="{ item }">
                        <UCard
                            class="card-container"
                            :ui="{
                                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                                body: { padding: 'p-4 lh:p-8' },
                                header: { padding: 'px-4 py-2 lh:p-4' },
                            }"
                        >
                            <template #header>
                                <span
                                    class="header"
                                    v-for="subject in [
                                        subjectData(modal.lesson.subject),
                                    ]"
                                >
                                    <Icon
                                        class="min-w-4"
                                        :name="subject.icon"
                                    />
                                    <span class="truncate max-w-full !block">{{
                                        subject.full
                                    }}</span>
                                    <button
                                        class="close"
                                        @click="modal.open = false"
                                    >
                                        <Icon name="material-symbols:close" />
                                    </button>
                                </span>
                            </template>
                            <!-- Info -->
                            <div class="info" v-if="item.key === 'info'">
                                <ul>
                                    <li>
                                        <Icon name="ph:chalkboard-teacher" />
                                        {{
                                            teacherString(modal.lesson.teacher)
                                        }}
                                    </li>
                                    <li>
                                        <Icon
                                            name="material-symbols:location-on-outline-rounded"
                                        />
                                        {{
                                            locationString(
                                                modal.lesson.location
                                            )
                                        }}
                                    </li>
                                </ul>
                            </div>
                            <!-- Homework -->
                            <div class="hw" v-else>
                                <div
                                    class="empty"
                                    v-if="
                                        !homework[lesson.subject] ||
                                        homework[lesson.subject]?.length === 0
                                    "
                                >
                                    <Icon
                                        style="font-size: 3rem"
                                        name="mdi:database-search"
                                    />
                                    <p>ДЗ по данному запросу не найдено</p>
                                </div>
                                <div
                                    class="instance"
                                    v-for="instance in homework[lesson.subject]"
                                >
                                    <ContentFormatter class="primary"
                                        ><MDC
                                            tag="div"
                                            :value="instance.md_text"
                                    /></ContentFormatter>

                                    <div class="dates">
                                        <p class="date">
                                            {{ instance.date ? `Задано:` : `` }}
                                            {{ normalizeDate(instance.date) }}
                                        </p>
                                        <p class="due-date">
                                            Нужно сдать:
                                            {{
                                                normalizeDate(instance.date_due)
                                            }}
                                        </p>
                                    </div>

                                    <NuxtLink
                                        class="details"
                                        :to="`/homework/${modal.lesson.subject}/${instance.id}`"
                                    >
                                        <UButton
                                            variant="link"
                                            trailing-icon="i-heroicons-arrow-right"
                                            :label="
                                                instance.comments.length > 0
                                                    ? `Комментарии - ${instance.comments.length}`
                                                    : `Оставить комментарий`
                                            "
                                        />
                                    </NuxtLink>
                                </div>
                            </div>
                        </UCard>
                    </template>
                </UTabs>
            </div>
        </TransitionGroup>
    </ClientOnly>
</template>

<style lang="scss">
.modal {
    position: fixed;
    z-index: 102;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    box-shadow: 0 0 1rem 100vw rgba(0, 0, 0, 0.5);
    border-radius: 3rem;
    width: 65%;

    .close {
        display: flex;
        align-items: center;
        background-color: transparent;
        padding: 0.25rem;
        transition: all 0.3s;
        border-radius: 0.5rem;
        margin-left: auto;

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }

    span {
        display: flex;
        align-items: center;
        gap: 1rem;

        &.header {
            font-size: 1.5rem;
            display: flex;
            justify-content: space-between;
        }
    }

    ul {
        padding: initial;
        margin: initial;
        margin-left: 1rem;
    }

    svg {
        height: 100%;
        transform: scale(1.1);
    }

    .card-container {
        min-height: 70vh;
    }

    .hw {
        &::-webkit-scrollbar {
            display: none;
        }

        max-height: calc(80vh - 10rem);
        overflow-y: auto;

        .empty {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1rem;

            > img {
                width: 20%;
            }

            p {
                text-align: center;
            }
        }

        .instance {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            outline: 1px solid rgba(255, 255, 255, 0.4);
            padding: 1rem;
            margin: 1rem 2px;

            .details {
                width: fit-content;
            }

            .dates {
                display: flex;
                justify-content: space-between;

                p {
                    opacity: 0.7;
                }
            }
        }
    }
}
</style>
