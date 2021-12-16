const nav = {
    logo: {
        top: {
            en: 'Psychotherapy',
            ru: 'Психотерапия',
        },
        bottom: {
            en: 'in Baltic',
            ru: 'в Балтии',
        },
    },
    location: {
        en: () => {
            const location = localStorage.getItem('loc');
            switch (location) {
                case 'lv':
                    return 'Latvia';
                case 'et':
                    return 'Estonia';
                case 'lt':
                    return 'Lithuania';
            }
        },
        ru: () => {
            const location = localStorage.getItem('loc');
            switch (location) {
                case 'lv':
                    return 'Латвия';
                case 'et':
                    return 'Эстония';
                case 'lt':
                    return 'Литва';
            }
        },
    },
    language: {
        en: 'EN',
        ru: 'RU',
    },
    menu: {
        en: 'Menu',
        ru: 'Меню',
    },
    locations: {
        title: {
            en: 'Where are you browsing from?',
            ru: 'Откуда вы?',
        },
        lt: {
            en: 'Lithuania',
            ru: 'Литва',
        },
        es: {
            en: 'Estonia',
            ru: 'Эстония',
        },
        lv: {
            en: 'Latvia',
            ru: 'Латвия',
        },
    },
    languages: {
        title: {
            en: 'What is your preferred language?',
            ru: 'Какой язык для вас предпочтительнее?',
        },
        ru: {
            en: 'Russian',
            ru: 'Русский',
        },
        es: {
            en: 'Estonian',
            ru: 'Эстонский',
        },
        lv: {
            en: 'Latvian',
            ru: 'Латышский',
        },
        en: {
            en: 'English',
            ru: 'Английский',
        },
    },
};