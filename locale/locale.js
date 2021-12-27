class Localizator {
    constructor() {
        this.root = 'https://psy-baltics.com';
        this.path = window.location.toString().split(this.root)[1];
        [this.locale, this.page] = this.path.split('/');
        if (!this.locale) {
            this.locale = 'ru';
        }
        this.changable = {
            ru: [],
            en: [],
            lv: [],
        };
        this.db = localeDb || null;
        this.selectorsToHide = '';

        this.changeLanguage = this.changeLanguage.bind(this);

        this.fillSelectorsToHide.apply(this);
        this.hideChangable.apply(this);

        document.addEventListener('DOMContentLoaded', this.removeChangable.apply(this))
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
        $(document.head).append(`<style>${this.selectorsToHide} { display: none }</style>`);
    }

    removeChangable() {
        $(this.selectorsToHide).remove();
    }

    changeLanguage(lang) {
        const locale = lang === 'ru' ? '' : lang + '/';
        window.location.href = `${this.root}/${locale}${this.page}`;
    }
    
    getTranslation(keys) {
        try {
            const texts = keys.reduce((obj, key) => obj = obj[key], this.translations);
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