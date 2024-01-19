<script setup lang="ts">
import type { lesson, subject } from "../types/db"
const { schedule } = useAppConfig();

const homework = useState("homework_global", () => { return {} })

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

onMounted(() => {
    for (const card of document.querySelectorAll(".card > span:not(.dummy)")) {
        card.addEventListener("mousemove", handleOnMouseMove);
    }
    document.addEventListener("mousemove", handleOnMouseMoveGlobal);
    timeCheck = setInterval(handleTimeCheck, 1000);
});

onUnmounted(() => {
    for (const card of document.querySelectorAll(".card > span:not(.dummy)")) {
        card.removeEventListener("mousemove", handleOnMouseMove);
    }

    document.removeEventListener("mousemove", handleOnMouseMoveGlobal);
    if (timeCheck) {
        clearInterval(timeCheck);
    }
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
    const matchString = `${Now.getDate()}/${
        Now.getMonth() + 1
    }/${Now.getFullYear()}`;
    for (let i: number = 0; i < homework.value[lesson]?.length; i++) {
        const instance = homework.value[lesson][i];
        if (instance.date_due === matchString) {
            return true;
        }
    }
    return false;
};
</script>

<template>
    <section class="large-table">
        <div class="index">
            <div class="card" style="opacity: 0">
                <span>#</span>
                <span class="dummy">#</span>
            </div>
            <div class="card" v-for="index in schedule.times.length">
                <span>{{ index }}</span>
                <span class="dummy">{{ index }}</span>
            </div>
        </div>
        <div class="time">
            <div class="card">
                <span>Время</span>
                <span class="dummy">Время</span>
            </div>
            <div class="card" v-for="time in schedule.times">
                <span>{{ time.start }} - {{ time.end }}</span>
                <span class="dummy">{{ time.start }} - {{ time.end }}</span>
            </div>
        </div>
        <div
            class="day"
            v-for="(day, index) in schedule.days"
            :class="{ current: index === currentTime.day - 1 }"
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
                            lessonIndex * 2 === currentTime.lessonIndex + 1),
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
                    :class="{ hashw: hasHomework(index + 1, lesson.subject) }"
                ></div>
            </div>
        </div>
    </section>
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

    .index {
        width: var(--index-width) !important;
    }

    > .time {
        width: fit-content !important;
        > .card {
            width: unset;
        }
    }

    > div:not(.modal) {
        padding: calc(var(--gap-size) / 2);
        display: flex;
        flex-direction: column;
        width: calc((100% - var(--index-width)) / 5.5);
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
        width: 90%;
        .hw {
            max-height: calc(100vh - 10rem);
        }
    }
}

@media (max-width: 600px) {
    .large-table {
        display: none;
    }
}
</style>
