interface time {
    start: string;
    end: string;
}

interface subject {
    full: string;
    short: string;
    icon: string;
    bookPDF?: string;
}

interface location {
    short: string;
    floor: number;
}

interface lesson {
    subject: string;
    teacher: string | string[];
    location: string | string[];
}

declare module "nuxt/schema" {
    interface AppConfigInput {
        schedule: {
            days: string[];
            times: time[];
            subjects: {
                [key: string]: subject;
            };
            teachers: {
                [key: string]: string;
            };
            locations: {
                [key: string]: location;
            };
            lessons: lesson[][];
        };
    }
}

interface homework_instance {
    text: string; // Задание
    attachments?: string[] /* Массив ссылок на закрепы.
    Пример:
    Если файл находятся по путю: '/public/media/attachemnts/math/09-05-2023.png',
    то нужно добавить в массив значение 'math/09-05-2023.png'
    */;
    date?: string; // Формат: ДД/ММ/ГГГГ
    date_due: string; // Формат: ДД/ММ/ГГГГ (ВАЖНО: НЕ 09.05.2023, А 9.5.2023)
    links?: string[];
}

interface homework_array {
    terver?: homework_instance[];
    ru_l?: homework_instance[];
    kl_chas?: homework_instance[];
    chem?: homework_instance[];
    alg?: homework_instance[];
    phys?: homework_instance[];
    lit?: homework_instance[];
    phys_ed: homework_instance[];
    en_l?: homework_instance[];
    hist?: homework_instance[];
    inf?: homework_instance[];
    obzh?: homework_instance[];
    geom?: homework_instance[];
    obsh?: homework_instance[];
    geo?: homework_instance[];
    proj?: homework_instance[];
    bio?: homework_instance[];
}

export default defineAppConfig({
    ui: {
        primary: "lime",
        gray: "stone",
    },
    schedule: {
        days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"],
        times: [
            {
                // 1
                start: "9:00",
                end: "9:45",
            },
            {
                // 2
                start: "9:55",
                end: "10:40",
            },
            {
                // 3
                start: "11:00",
                end: "11:45",
            },
            {
                // 4
                start: "12:05",
                end: "12:50",
            },
            {
                // 5
                start: "13:05",
                end: "13:50",
            },
            {
                // 6
                start: "14:05",
                end: "14:50",
            },
            {
                // 7
                start: "15:00",
                end: "15:45",
            },
        ],
        subjects: {
            terver: {
                full: "Вероятность и статистика",
                short: "Вер. и Стат.",
                icon: "mdi:slot-machine-outline",
            },
            ru_l: {
                full: "Русский Язык",
                short: "Рус. Яз.",
                icon: "game-icons:matryoshka-dolls",
            },
            kl_chas: {
                full: "Разговор о важном",
                short: "РОВ",
                icon: "healthicons:war-outline",
            },
            chem: {
                full: "Химия",
                short: "Химия",
                icon: "game-icons:spiky-explosion",
            },
            alg: {
                full: "Алгебра и начало мат. анализа",
                short: "Алгебра",
                icon: "tabler:math",
            },
            phys: {
                full: "Физика",
                short: "Физика",
                icon: "quill:nuclear",
            },
            lit: {
                full: "Литература",
                short: "Лит-ра",
                icon: "tabler:book",
            },
            phys_ed: {
                full: "Физическая Культура",
                short: "Физ-ра",
                icon: "solar:running-round-outline",
            },
            en_l: {
                full: "Английский Язык",
                short: "English",
                icon: "icon-park-outline:english",
            },
            hist_ru: {
                full: "История России",
                short: "История Рос.",
                icon: "material-symbols:history-toggle-off-rounded",
            },
            hist: {
                full: "История",
                short: "История",
                icon: "material-symbols:history-toggle-off-rounded",
            },
            inf: {
                full: "Информатика",
                short: "Инф.",
                icon: "streamline:computer-database-raid-storage-code-disk-programming-database-array-hard-disc",
            },
            obzh: {
                full: "Основы Безопасности и Зашиты Родины",
                short: "ОБЗР",
                icon: "game-icons:deadly-strike",
            },
            geom: {
                full: "Геометрия",
                short: "Геометрия",
                icon: "tabler:geometry",
            },
            obsh: {
                full: "Обществознание",
                short: "Общество.",
                icon: "fluent:people-queue-20-regular",
            },
            geo: {
                full: "География",
                short: "Георгафия",
                icon: "bi:geo",
            },
            proj: {
                full: "Итоговый проект",
                short: "Проект",
                icon: "mdi:matrix",
            },
            bio: {
                full: "Биология",
                short: "Биология",
                icon: "fa6-solid:biohazard",
            },
        },
        teachers: {
            ev: "Арачеева Элина Витальевна",
            nn: "Веретникова Наталья Николаевна",
            rk: "Сухова Рушания Камильевна",
            p_oa: "Прокопченко Ольга Алексеевна",
            i_oa: "Тузова Ольга Алексеевна",
            av: "Перов А. В.",
            ia: "Соколов Игорь Александрович",
            ei: "Утёмова Елена Игоревна",
            pn: "Жарикова Полина Николаевна",
            ni: "Сапрыгин Николай Иванович",
            eb: "Зеленская Елена Борисовна",
            to: "Прохоренко Татьяна Олеговна",
            ng: "Оробинская Наталья Георгевна",
            sv: "Мульганов С.В.",
        },
        locations: {
            ru: {
                short: "Рус. 3",
                floor: 5,
            },
            chem: {
                short: "Химия",
                floor: 4,
            },
            math: {
                short: "Мат. 4",
                floor: 2,
            },
            phys: {
                short: "Физика",
                floor: 4,
            },
            sport: {
                short: "Спорт. Зал",
                floor: 5,
            },
            en_1: {
                short: "Англ. 5",
                floor: 4,
            },
            en_2: {
                short: "Англ. 7",
                floor: 4,
            },
            hist: {
                short: "Ист. 2",
                floor: 2,
            },
            inf: {
                short: "Инф. 1",
                floor: 2,
            },
            geo: {
                short: "Геогр.",
                floor: 3,
            },
            ort: {
                short: "ОРТ 1",
                floor: 3,
            },
            bio: {
                short: "Биол.",
                floor: 4,
            },
        },
        lessons: [
            [
                { subject: "kl_chas", teacher: "ev", location: "ru" },
                { subject: "bio", teacher: "ng", location: "bio" },
                { subject: "alg", teacher: "rk", location: "math" },
                { subject: "alg", teacher: "rk", location: "math" },
                { subject: "phys", teacher: "p_oa", location: "phys" },
                { subject: "hist", teacher: "pn", location: "hist" },
                { subject: "hist_ru", teacher: "pn", location: "hist" },
            ],
            [
                {
                    subject: "inf",
                    teacher: ["sv", "i_oa"],
                    location: ["ort", "inf"],
                },
                {
                    subject: "inf",
                    teacher: ["sv", "i_oa"],
                    location: ["ort", "inf"],
                },
                { subject: "phys_ed", teacher: "av", location: "sport" },
                { subject: "lit", teacher: "ev", location: "ru" },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                { subject: "obsh", teacher: "pn", location: "hist" },
                { subject: "terver", teacher: "rk", location: "math" },
            ],
            [
                { subject: "phys", teacher: "p_oa", location: "phys" },
                { subject: "hist", teacher: "pn", location: "hist" },
                { subject: "alg", teacher: "rk", location: "math" },
                { subject: "geom", teacher: "rk", location: "math" },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                { subject: "ru_l", teacher: "ev", location: "ru" },
                { subject: "ru_l", teacher: "ev", location: "ru" },
            ],
            [
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                { subject: "chem", teacher: "ng", location: "chem" },
                { subject: "alg", teacher: "rk", location: "math" },
                { subject: "lit", teacher: "ev", location: "ru" },
                { subject: "lit", teacher: "ev", location: "ru" },
                {
                    subject: "inf",
                    teacher: ["sv", "i_oa"],
                    location: ["ort", "inf"],
                },
                {
                    subject: "inf",
                    teacher: ["sv", "i_oa"],
                    location: ["ort", "inf"],
                },
            ],
            [
                { subject: "obsh", teacher: "pn", location: "hist" },
                { subject: "geo", teacher: "eb", location: "geo" },
                { subject: "geom", teacher: "rk", location: "math" },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                { subject: "obzh", teacher: "ni", location: "chem" },
                { subject: "phys_ed", teacher: "av", location: "sport" },
            ],
        ],
    },
});
