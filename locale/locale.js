class Localizator {
    constructor() {
        this.root = 'https://psy-baltics.com/';
        this.changable = {
            ru: ['.uc-footer-ru', '.trl-ru'],
            en: ['.uc-footer-en', '.trl-en'],
            lv: ['.uc-footer-lv', '.trl-lv'],
            et: ['.uc-footer-et', '.trl-et'],
            lt: ['.uc-footer-lt', '.trl-lt'],
        };
        this.db = localeDb || null;
        this.selectorsToHide = '';
        this.locale = null;
        this.page = null;
        this.possibleLocales = ['ru', 'en', 'lv', 'et', 'lt'];

        this.changeLanguage = this.changeLanguage.bind(this);

        this.getPathParams.apply(this);
        this.fillSelectorsToHide.apply(this);
        this.hideChangable.apply(this);

        document.addEventListener('DOMContentLoaded', this.removeChangable.bind(this));
    }

    getPathParams() {
        if (window.location.toString().includes('5500')) {
            this.locale = 'ru';
            this.page = '';
            return;
        }
        let loc = window.location.toString();
        if (loc.includes('#')) {
            loc = loc.split('#')[0];
        }
        if (loc.includes('?')) {
            loc = loc.split('?')[0];
        }
        this.path = loc.split(this.root)[1];
        const localeAndPage = this.path.split('/');
        if (localeAndPage.length === 1) {
            const data = localeAndPage[0];
            if (this.possibleLocales.includes(data)) {
                this.locale = data;
                this.page = '';
            } else {
                this.locale = 'ru';
                this.page = data;
            }
        } else {
            [this.locale, this.page] = localeAndPage;
        }
        if (!this.possibleLocales.includes(this.locale)) {
            this.locale = 'ru';
        }
    }

    fillSelectorsToHide() {
        let styleStr = '';
        for (let key in this.changable) {
            if (key !== this.locale) {
                this.changable[key].forEach(selector => {
                    if (styleStr) {
                        styleStr += ', ';
                    }
                    styleStr += `${selector}`;
                });
            }
        }
        this.selectorsToHide = styleStr;
    }

    hideChangable() {
        try {
            $(document.head).append(`<style>${this.selectorsToHide} { display: none }</style>`);
        } catch(e) {};
    }

    removeChangable() {
        try {
            $(this.selectorsToHide).remove();
        } catch(e) {};
    }

    changeLanguage(lang) {
        const locale = lang === 'ru' ? '' : lang + '/';
        window.location.href = `${this.root}${locale}${this.page}`;
    }
    
    getTranslation(keys) {
        try {
            const texts = keys.reduce((obj, key) => obj = obj[key], this.db);
            const text = texts[this.locale];
            if (typeof text === 'function') {
                return text();
            } else {
                return text;
            }
        } catch(e) {
            console.warn(e);
            return '';
        }
    }
};
const localizator = new Localizator();