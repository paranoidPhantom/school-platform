<script setup lang="ts">
const { schedule } = useAppConfig()

interface subject {
    full: string;
    short: string;
    icon: string;
}

interface location {
    short: string;
    floor: number;
}

interface lesson {
    subject: keyof typeof schedule.subjects;
    teacher: keyof typeof schedule.teachers | (keyof typeof schedule.teachers)[];
    location: keyof typeof schedule.locations | (keyof typeof schedule.locations)[];
}

const modal: {
    open: boolean,
    lesson: lesson
} = reactive({
    open: false,
    lesson: {
        subject: "ru_l",
        teacher: "ev",
        location: "ru"
    }
})
const currentTime = reactive({
    day: 0,
    lessonIndex: 0
})

function isTimeBetween(target: string | Date, start: string, end: string): boolean {
    let startTime: Date;
    let endTime: Date;

    if (start.length < 5) { start = `0${start}` }
    if (end.length < 5) { end = `0${end}` }

    if (typeof target === 'string') {
        target = new Date(`1970-01-02T${target}`);
    } else {
        target = new Date(`1970-01-02T${target.getHours()}:${target.getMinutes()}`)
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
    const { currentTarget: target } = e
    const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`)
    target.style.setProperty("--mouse-y", `${y}px`)
}

const handleOnMouseMoveGlobal = (e: any) => {
    const cards = document.querySelectorAll<HTMLElement>(".card")
    for (const card of cards) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`)
        card.style.setProperty("--mouse-y", `${y}px`)
    }
}

const handleTimeCheck = () => {
    const Now = new Date()
    const weekDayID = Now.getDay()
    currentTime.day = weekDayID
    if (weekDayID > 0 && weekDayID < 6) {
        schedule.times.forEach((time, index) => {
            const { start, end } = time
            console.log("_")
            if (isTimeBetween(Now, start, end)) {
                currentTime.lessonIndex = (index + 1) * 2
                console.log("A")
                return
            } else if (index > 0 && isTimeBetween(Now, schedule.times[index - 1].end, start)) {
                currentTime.lessonIndex = index * 2 - 1
                console.log("B")
                return
            }
        });
    }
}

let timeCheck: NodeJS.Timeout | null = null

onMounted(() => {
    for (const card of document.querySelectorAll(".card > span:not(.dummy)")) {
        card.addEventListener("mousemove", handleOnMouseMove)
    }
    document.addEventListener("mousemove", handleOnMouseMoveGlobal)
    timeCheck = setInterval(handleTimeCheck, 1000)
})



onUnmounted(() => {
    for (const card of document.querySelectorAll(".card > span:not(.dummy)")) {
        card.removeEventListener("mousemove", handleOnMouseMove)
    }

    document.removeEventListener("mousemove", handleOnMouseMoveGlobal)
    if (timeCheck) { clearInterval(timeCheck) }
})

const subjectData = (subject: keyof typeof schedule.subjects): subject => {
    return schedule.subjects[subject]
}

const currentLessonArray = computed(() => {
    return [modal.lesson]
})
</script>

<template>
    <section class="container">
        <ClientOnly>
            <TransitionGroup name="modal">
                <div class="modal" v-if="modal.open" v-for="lesson in currentLessonArray" :key="(JSON.stringify(lesson))">
                    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                        <template #header>
                            <span class="header">
                                <Icon :name="subjectData(lesson.subject).icon" />{{ subjectData(lesson.subject).full }}
                                <button class="close" @click="modal.open = false">
                                    <Icon name="material-symbols:close" />
                                </button>
                            </span>
                        </template>
                        <ul>
                            <li>
                                <Icon name="ph:chalkboard-teacher" />

                            </li>
                            <li>
                                <Icon name="material-symbols:location-on-outline-rounded" />
                            </li>
                        </ul>
                    </UCard>
                </div>
            </TransitionGroup>
        </ClientOnly>
        <div class="index">
            <div class="card" style="opacity: 0;">
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
        <div class="day" v-for="(day, index) in schedule.days" :class="{ current: index === currentTime.day - 1 }">
            <div class="card">
                <span>{{ day }}</span>
                <span class="dummy">{{ day }}</span>
            </div>
            <div class="card" v-for="(lesson, lessonIndex) in schedule.lessons[index]"
                @click="modal.subject = schedule.subjects[lesson.subject]; modal.location = schedule.locations[lesson.location]; modal.teacher = schedule.teachers[lesson.teacher]; modal.open = true"
                :class="{ current: index === currentTime.day - 1 && (lessonIndex + 1 === currentTime.lessonIndex / 2 || lessonIndex * 2 === currentTime.lessonIndex + 1), idle: lessonIndex * 2 === currentTime.lessonIndex + 1 }">
                <span>
                    <Icon :name="schedule.subjects[lesson.subject].icon" /> {{ schedule.subjects[lesson.subject].short }}
                </span>
                <span class="dummy">
                    <Icon :name="schedule.subjects[lesson.subject].icon" /> {{ schedule.subjects[lesson.subject].short }}
                </span>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
.icon-container {
    > svg {
        height: 100%;
        margin-right: 0.5rem;
        transform: scale(1.1);
    }
}

.container {
    --index-width: 2rem;
    --gap-size: 0.5rem;
    // Positioning and sizing of main container
    margin: 1rem 5%;
    width: 90%;
    //
    display: flex;
    justify-content: center;

    .index {
        width: var(--index-width);
    }

    >.time {
        width: calc((100% - var(--index-width)) / 6.5);
    }

    >div {
        padding: calc(var(--gap-size) / 2);
        display: flex;
        flex-direction: column;
        width: calc((100% - var(--index-width)) / 5.5);
        min-width: fit-content;
        gap: var(--gap-size);

        &.current {
            filter: drop-shadow(0 0.1rem 0.3rem rgba(0, 255, 179, 0.3));
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

            &::before {
                background-image: radial-gradient(250px circle at var(--mouse-x) var(--mouse-y),
                        rgba(0, 255, 179, 0.5),
                        transparent 40%);
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
                background: conic-gradient(from 0deg, rgba(255, 255, 255, 0), rgba(0, 255, 179, 0.8));
                width: 100vw;
                height: 100vw;
                top: 50%;
                left: 50%;
                translate: -50% -50%;
            }

            &.current.idle::before {
                background: conic-gradient(from 0deg, rgba(255, 255, 255, 0), rgba(255, 0, 0, 0.8));
            }

            span {
                display: flex;
                justify-content: center;
                gap: 1rem;
                border-radius: inherit;
                padding: 0.5rem;
                background-color: rgb(5, 5, 5);

                width: calc(100% - 2px);
                height: calc(100% - 2px);

                >svg {
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
                    background: radial-gradient(200px circle at var(--mouse-x) var(--mouse-y),
                            rgba(0, 255, 179, 0.2),
                            transparent 40%);
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
</style>