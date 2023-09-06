import homework_db from "./hw.json" assert { type: "json" };
interface time {
    start: string;
    end: string;
}

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

const homework: homework_array = homework_db /* {
    // В эти массивы нужно по факту добавлять обьекты (ненужные ключи с массивами можно убрать)
    terver: [],
    ru_l: [],
    kl_chas: [],
    chem: [],
    alg: [
        {
            text: "<ul><li>576,577,581, 582 все четные задания</li></ul>",
            date_due: "8/9/2023",
            date: "6/9/2023",
            attachments: [
                "algebra/06-09.png"
            ]
        }
    ],
    phys: [],
    lit: [
        {
            text: "<ul><li>Рассказ о семье кабановых. Быт и нравы тёмного царства(закладки).</li> <li>Наизусть чтение монологов по выбору</li></ul>",
            date: "6/9/2023",
            date_due: "11/9/2023"
        },
        {
            text: "<ul><li>Описать город Калинов и его обитателей(действия 1-4) с помощью диалогов, монологов, реплик, ремарок, эпитетов, сравнений и т.д.</li><li>Краткая характеристика героев</li></ul>",
            date_due: "6/9/2023",
            date: "5/9/2023",
        }
    ],
    phys_ed: [],
    en_l: [
        {
            text: "<h2>Группа Утёмовой Е.И.:</h2><ul><li>8 упражнение(страница 9)</li> <li>Составить 5 предложений используя 3 упражнение(стр. 10)</li></ul>",
            date: "6/9/2023",
            date_due: "7/9/2023"
        },
        {
            text: "<h2>Группа Утёмовой Е.И.:</h2><ul><li>Упражнение 4B</li></ul>",
            date: "5/9/2023",
            date_due: "6/9/2023",
        },
    ],
    hist: [
        {
            text: "<ul><li>Стр. 17-20</li><li>Видео на почте</li></ul>",
            date: "5/9/2023",
            date_due: "8/9/2023",
        },
    ],
    inf: [
        {
            text: "<ul><li>Подготовиться к проверочной работе</li><li>По желанию прорешать варианты(3-4)</li></ul>",
            date: "5/9/2023",
            date_due: "7/9/2023",
        },
    ],
    obzh: [
        {
            text: `Читать 1 § (стр. 5-11)`,
            date: "6/9/2023",
            date_due: "13/9/2023"
        }
    ],
    geom: [
        {
            text: "<ul><li>Дописать 2-3 аксиомы планиметрии</li><li>Выучить аксиомы А1, А2, А3</li><li>Прочитать пункты 1, 2</li></ul>",
            date_due: "8/9/2023",
        },
    ],
    obsh: [
        {
            text: `Читать 1 §`,
            date: "6/9/2023",
            date_due: "13/9/2023"
        }
    ],
    geo: [],
    proj: [],
    bio: [],
};*/

export default defineAppConfig({
    ui: {
        primary: "green",
        gray: "neutral",
    },
    homework: homework,
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
                full: "Теория вероятностей",
                short: "Тер. Вер.",
                icon: "mdi:slot-machine-outline",
            },
            ru_l: {
                full: "Русский Язык",
                short: "Рус. Яз.",
                icon: "game-icons:matryoshka-dolls",
            },
            kl_chas: {
                full: "Классный Час",
                short: "Кл. Час",
                icon: "healthicons:war-outline",
            },
            chem: {
                full: "Химия",
                short: "Химия",
                icon: "game-icons:spiky-explosion",
            },
            alg: {
                full: "Алгебра",
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
                short: "Англ. Яз.",
                icon: "icon-park-outline:english",
            },
            hist: {
                full: "Всеобщая История",
                short: "Вс. История",
                icon: "material-symbols:history-toggle-off-rounded",
            },
            inf: {
                full: "Информатика",
                short: "Инф.",
                icon: "streamline:computer-database-raid-storage-code-disk-programming-database-array-hard-disc",
            },
            obzh: {
                full: "Основы Безопасности Жизнидеятельности",
                short: "ОБЖ",
                icon: "game-icons:deadly-strike",
            },
            geom: {
                full: "Геометрия",
                short: "Геом.",
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
                full: "Проект наверное",
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
            to: "Прохоренко Т. О.",
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
                // 1
                {
                    subject: "kl_chas",
                    teacher: "ev",
                    location: "ru",
                },
                {
                    subject: "chem",
                    teacher: "nn",
                    location: "chem",
                },
                {
                    subject: "alg",
                    teacher: "rk",
                    location: "math",
                },
                {
                    subject: "phys",
                    teacher: "p_oa",
                    location: "phys",
                },
                {
                    subject: "lit",
                    teacher: "ev",
                    location: "ru",
                },
                {
                    subject: "phys_ed",
                    teacher: "av",
                    location: "sport",
                },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
            ],
            [
                // 2
                {
                    subject: "lit",
                    teacher: "ev",
                    location: "ru",
                },
                {
                    subject: "hist",
                    teacher: "pn",
                    location: "hist",
                },
                {
                    subject: "inf",
                    teacher: ["sv", "i_oa"],
                    location: ["geo", "inf"],
                },
                {
                    subject: "inf",
                    teacher: ["sv", "i_oa"],
                    location: ["geo", "inf"],
                },
                {
                    subject: "geom",
                    teacher: "rk",
                    location: "math",
                },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                {
                    subject: "hist",
                    teacher: "pn",
                    location: "hist",
                },
            ],
            [
                // 3
                {
                    subject: "obzh",
                    teacher: "ni",
                    location: "chem",
                },
                {
                    subject: "alg",
                    teacher: "rk",
                    location: "math",
                },
                {
                    subject: "obsh",
                    teacher: "pn",
                    location: "hist",
                },
                {
                    subject: "obsh",
                    teacher: "pn",
                    location: "hist",
                },
                {
                    subject: "lit",
                    teacher: "ev",
                    location: "ru",
                },
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
            ],
            [
                // 4
                {
                    subject: "terver",
                    teacher: "rk",
                    location: "math",
                },
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
                {
                    subject: "geo",
                    teacher: "eb",
                    location: "geo",
                },
                {
                    subject: "en_l",
                    teacher: ["ia", "ei"],
                    location: ["en_2", "en_1"],
                },
                {
                    subject: "phys",
                    teacher: "p_oa",
                    location: "phys",
                },
                {
                    subject: "proj",
                    teacher: "to",
                    location: "inf",
                },
            ],
            [
                // 5
                {
                    subject: "ru_l",
                    teacher: "ev",
                    location: "ru",
                },
                {
                    subject: "ru_l",
                    teacher: "ev",
                    location: "ru",
                },
                {
                    subject: "alg",
                    teacher: "rk",
                    location: "math",
                },
                {
                    subject: "geom",
                    teacher: "rk",
                    location: "math",
                },
                {
                    subject: "phys_ed",
                    teacher: "av",
                    location: "sport",
                },
                {
                    subject: "hist",
                    teacher: "pn",
                    location: "hist",
                },
                {
                    subject: "bio",
                    teacher: "ng",
                    location: "bio",
                },
            ],
        ],
    },
});
