<script setup lang="ts">
import type { lesson, subject } from "../types/db";

import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";
import { Perspective } from "@egjs/flicking-plugins";

import { useWindowSize } from "@vueuse/core";

const flicking_plugins = [new Perspective({ rotate: 0.4, scale: 0.5 })];
const disabled_plugins = [new Perspective({ rotate: 0, scale: 0 })];

const { width } = useWindowSize();
const { schedule } = useAppConfig();


const ListMode = ref(false);

const refreshListMode = () => {
	ListMode.value = width.value <= 600
}

const homework = useState("homework_global", () => {
    return {};
});

const current_hover_subject = ref("");

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

const currentTime = reactive({
    day: 0,
    lessonIndex: 0,
});

function isTimeBetween(
    target: string | Date,
    start: string,
    end: string
): boolean {
    let startTime: Date;
    let endTime: Date;

    if (start.length < 5) {
        start = `0${start}`;
    }
    if (end.length < 5) {
        end = `0${end}`;
    }

    if (typeof target === "string") {
        target = new Date(`1970-01-02T${target}`);
    } else {
        target = new Date(
            `1970-01-02T${
                target.getHours().toString().length < 2 ? "0" : ""
            }${target.getHours()}:${
                target.getMinutes().toString().length < 2 ? "0" : ""
            }${target.getMinutes()}`
        );
    }
    startTime = new Date(`1970-01-02T${start}`);
    endTime = new Date(`1970-01-02T${end}`);

    // Check if the end time is before the start time, indicating a time range that spans midnight
    if (endTime < startTime) {
        endTime = new Date(`1970-01-02T${end}`);
    }

    // Check if the target time is between the start and end times
    return startTime <= target && target <= endTime;
}

const handleOnMouseMove = (e: any) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
};

const handleOnMouseMoveGlobal = (e: any) => {
    const cards = document.querySelectorAll<HTMLElement>(".card");
    for (const card of cards) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
};

const handleTimeCheck = () => {
    const Now = new Date();
    const weekDayID = Now.getDay();
    currentTime.day = weekDayID;
    if (weekDayID > 0 && weekDayID < 6) {
        schedule.times.forEach((time, index) => {
            const { start, end } = time;
            if (isTimeBetween(Now, start, end)) {
                currentTime.lessonIndex = (index + 1) * 2;
                return;
            } else if (
                index > 0 &&
                isTimeBetween(Now, schedule.times[index - 1].end, start)
            ) {
                currentTime.lessonIndex = index * 2 - 1;
                return;
            }
        });
    }
};

let timeCheck: NodeJS.Timeout | null = null;

const addLaggyEffect = () => {
    if (ListMode.value) return;
    for (const card of document.querySelectorAll(".card > span:not(.dummy)")) {
        card.addEventListener("mousemove", handleOnMouseMove);
    }
    document.addEventListener("mousemove", handleOnMouseMoveGlobal);
};

const removeLaggyEffect = () => {
    for (const card of document.querySelectorAll(".card > span:not(.dummy)")) {
        card.removeEventListener("mousemove", handleOnMouseMove);
    }

    document.removeEventListener("mousemove", handleOnMouseMoveGlobal);
};

onMounted(() => {
    addLaggyEffect();
    timeCheck = setInterval(handleTimeCheck, 1000);
});

onUnmounted(() => {
    removeLaggyEffect();
    if (timeCheck) {
		clearInterval(timeCheck);
    }
});

watch(width, refreshListMode)

watch(ListMode, () => {
    if (ListMode.value) removeLaggyEffect();
    else addLaggyEffect();
});

const subjectData = (subject: keyof typeof schedule.subjects): subject => {
    return schedule.subjects[subject];
};

const hasHomework = (index: number, lesson: keyof typeof schedule.subjects) => {
    const Now = new Date();
    const diff =
        index >= currentTime.day
            ? index - currentTime.day
            : 7 - currentTime.day + index;
    Now.setDate(Now.getDate() + diff);
    const matchString = `${Now.getDate() > 8 ? "" : "0"}${Now.getDate()}/${
        Now.getMonth() > 8 ? "" : "0"
    }${Now.getMonth() + 1}/${Now.getFullYear()}`;
    for (let i: number = 0; i < homework.value[lesson]?.length; i++) {
        const instance = homework.value[lesson][i];
        if (instance.date_due === matchString) {
            return true;
        }
    }
    return false;
};

const defIndexFlicker = new Date().getDay() - 1;

const timeAndIndexSetting = ref(false);
const timeAndIndexShown = ref(false);

watchEffect(() => {
	timeAndIndexShown.value = timeAndIndexSetting.value && ListMode.value
})

onMounted(refreshListMode)
</script>

<template>
	<section class="large-table" :class="{ shifted: timeAndIndexShown }">
		<div class="overlay" v-if="timeAndIndexShown"></div>
        <div
            class="index"
            :class="{ lmode: ListMode, frozen: timeAndIndexShown }"
        >
            <div class="card" style="opacity: 0">
                <span>#</span>
                <span class="dummy">#</span>
            </div>
            <div class="card" v-for="index in schedule.times.length">
                <span>{{ index }}</span>
                <span class="dummy">{{ index }}</span>
            </div>
        </div>
        <div
            class="time"
            :class="{ lmode: ListMode, frozen: timeAndIndexShown }"
        >
            <div class="card">
                <span>Время</span>
                <span class="dummy">Время</span>
            </div>
            <div class="card" v-for="time in schedule.times">
                <span>{{ time.start }} - {{ time.end }}</span>
                <span class="dummy">{{ time.start }} - {{ time.end }}</span>
            </div>
        </div>
        <Flicking
            :plugins="ListMode ? flicking_plugins : disabled_plugins"
            :options="{
                align: 'center',
                easing: (x) => 1 - Math.pow(1 - x, 3),
                defaultIndex: defIndexFlicker,
                iOSEdgeSwipeThreshold: 0,
                bound: !ListMode,
                circular: ListMode,
                bounce: ListMode ? '30%' : 0,
                renderOnlyVisible: true,
                deceleration: 0.01,
            }"
        >
            <div
                class="day"
                v-for="(day, index) in schedule.days"
                :class="{ current: index === currentTime.day - 1 }"
                :key="index"
            >
                <div class="card">
                    <span>{{ day }}</span>
                    <span class="dummy">{{ day }}</span>
                </div>
                <div
                    class="card"
                    v-for="(lesson, lessonIndex) in (schedule.lessons[index] as lesson[])"
                    @click="
                        modal.lesson = lesson as typeof modal.lesson;
                        modal.open = true;
                    "
                    @mouseenter="current_hover_subject = lesson.subject"
                    @mouseleave="current_hover_subject = ''"
                    :class="{
                        highlight: current_hover_subject === lesson.subject,
                        current:
                            index === currentTime.day - 1 &&
                            (lessonIndex + 1 === currentTime.lessonIndex / 2 ||
                                lessonIndex * 2 ===
                                    currentTime.lessonIndex + 1),
                        idle: lessonIndex * 2 === currentTime.lessonIndex + 1,
                    }"
                >
                    <span>
                        <Icon :name="subjectData(lesson.subject).icon" />
                        {{ subjectData(lesson.subject).short }}
                    </span>
                    <span class="dummy">
                        <Icon :name="subjectData(lesson.subject).icon" />
                        {{ subjectData(lesson.subject).short }}
                    </span>
                    <div
                        class="status"
                        :class="{
                            hashw: hasHomework(index + 1, lesson.subject),
                        }"
                    ></div>
                </div>
            </div>
        </Flicking>
    </section>
    <div class="flex my-4 px-4 gap-4">
        <UButton v-if="ListMode" variant="link" @click="timeAndIndexSetting = !timeAndIndexSetting">
            <UBadge class="flex gap-2" size="lg" variant="subtle"
                ><Icon name="ic:twotone-schedule" />{{
                    timeAndIndexSetting
						? "Показывать только уроки"
                        : "Показывать время и номер урока"
                }}</UBadge
            >
        </UButton>
    </div>
</template>

<style lang="scss">
.large-table {
    span.icon {
        display: none;
    }

    --index-width: 2rem;
    --gap-size: 0.5rem;

    --color: 0, 0, 239;
    --warning-color: 0, 0, 0;
    --blue-color: 0, 102, 255;
    --red-color: 255, 0, 0;
    // Positioning and sizing of main container
    margin: 1rem 5%;
    width: 90%;
    //
    display: flex;
    justify-content: center;

    transition: all 0.3s;

	.overlay {
		pointer-events: none;
		position: absolute;
		inset: -2px;
		z-index: 2;
	}

	&.shifted {
		width: calc(60vw - 4px);
		translate: 40vw;
		.overlay {
			box-shadow: 0 0 3rem 3rem rgb(10, 10, 10) inset;
		}
	}

    .index {
        width: var(--index-width) !important;
        &.lmode {
            position: absolute;
            z-index: 3;
            right: calc(100% + 10rem);
            &.frozen {
                right: calc(100% + 40vw - var(--index-width) - 1rem);
            }
        }
    }

    > .time {
        width: fit-content !important;
        > .card {
            width: unset;
        }
        &.lmode {
            position: absolute;
            z-index: 3;
            right: calc(100% + 10rem);
            &.frozen {
                right: calc(100% + 40vw - 12rem);
            }
        }
    }

    .day,
    .time,
    .index {
        padding: calc(var(--gap-size) / 2);
        display: flex;
        flex-direction: column;
        width: calc((100% - var(--index-width)) / 5);
        min-width: fit-content;
        gap: var(--gap-size);

        &.current .card {
            filter: drop-shadow(0 0.1rem 0.3rem rgba(var(--color), 0.3));
        }

        .card {
            transition: all 0.3s;
            border-radius: 0.5rem;
            outline: 1px solid rgba(255, 255, 255, 0.05);
            cursor: pointer;
            position: relative;
            z-index: 2;
            padding: 1px;
            display: flex;
            justify-content: center;

            &.highlight:not(:hover) {
                outline: 1px solid rgba(var(--color), 0.5);
            }

            .status {
                position: absolute;
                z-index: 1000;
                right: 0.25rem;
                bottom: 0.25rem;
                width: 0.5rem;
                height: 0.5rem;
                outline: 2px solid rgba(255, 255, 255, 0.2);
                background-color: grey;
                border-radius: 1rem;
                opacity: 0.5;

                &.hashw {
                    background-color: orange;
                }
            }

            &::before {
                background-image: radial-gradient(
                    250px circle at var(--mouse-x) var(--mouse-y),
                    rgba(var(--color), 0.5),
                    transparent 40%
                );
                content: "";
                border-radius: inherit;
                position: absolute;
                z-index: -100;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }

            &.current {
                overflow: hidden;
                --color: 0, 102, 255;
            }

            @keyframes rotate {
                0% {
                    rotate: 0deg;
                }

                100% {
                    rotate: 360deg;
                }
            }

            &.current::before {
                animation: rotate 4s infinite linear;
                background: conic-gradient(
                    from 0deg,
                    rgba(255, 255, 255, 0),
                    rgba(var(--color), 0.8)
                );
                width: 100vw;
                height: 100vw;
                top: 50%;
                left: 50%;
                translate: -50% -50%;
            }

            &.current.idle {
                --color: 255, 0, 0;
            }

            &.current.idle::before {
                background: conic-gradient(
                    from 0deg,
                    rgba(255, 255, 255, 0),
                    rgba(var(--color), 0.8)
                );
            }

            span {
                display: flex;
                justify-content: center;
                gap: 1rem;
                border-radius: inherit;
                padding: 0.5rem;
                background-color: rgba(5, 5, 5, 0.92);

                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                width: calc(100% - 2px);
                height: calc(100% - 2px);

                > svg {
                    height: 100%;
                    transform: scale(1.2);
                }

                &.dummy {
                    opacity: 0;
                }

                &:not(.dummy) {
                    position: absolute;
                    z-index: 100;
                    width: calc(100% - 2px);
                }

                &::before {
                    transition: all 0.6s;
                    background: radial-gradient(
                        200px circle at var(--mouse-x) var(--mouse-y),
                        rgba(var(--color), 0.2),
                        transparent 40%
                    );
                    opacity: 0;
                    content: "";
                    border-radius: inherit;
                    height: 100%;
                    width: 100%;
                    left: 0;
                    top: 0;
                    position: absolute;
                    z-index: 2;
                }

                &:hover::before {
                    opacity: 1;
                }
            }
        }
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0.7);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0);
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s;
}

@media (max-width: 1100px) {
    .large-table {
        width: 100%;
        margin: 1rem 0;
    }

    .card > span {
        font-size: 0.7rem;
    }
    .modal {
        width: 95%;
        .hw {
            max-height: calc(100vh - 10rem);
        }
    }
}

@media (max-width: 600px) {
    .card {
        > span {
            font-size: 1.2rem;
            svg {
                font-size: 0.85rem;
            }
        }
    }
}

@media (min-width: 600px) {
    .flicking-viewport {
        width: 100%;
        overflow: visible;
        .flicking-camera {
            transform: none !important;
        }
    }
}
</style>
