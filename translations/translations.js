class Translator {
    constructor() {
        this.translations = translations;
        this.texts = [];
        this.lang = 'en';

        this.subscribers = [];

        this.translateElement = this.translateElement.bind(this);
        this.translateElements = this.translateElements.bind(this);
        this.changeLang = this.changeLang.bind(this);

        document.addEventListener('DOMContentLoaded', () => {
            this.findAndSortTexts.call(this);
            this.translateElements();
        });
    }

    findAndSortTexts() {
        const elements = [...document.querySelectorAll('[class*="trl"]')];
        this.texts = elements.map(element => {
            const trlClass = [...element.classList].find(cl => cl.includes('trl'));
            const keys = trlClass.split('trl-')[1].split('-');
            return {
                element: element.querySelector('.tn-atom') || element,
                keys
            }
        });
    }

    translateElement(element) {
        try {
            const texts = element.keys.reduce((obj, key) => obj = obj[key], this.translations);
            const text = texts[this.lang];
            if (typeof text === 'function') {
                element.element.innerHTML = text();
            } else {
                element.element.innerHTML = text;
            }
        } catch(e) {
            console.error(e, element);
        }
    }

    translateElements() {
        this.texts.forEach(this.translateElement);
    }

    changeLang(lang = null) {
        if (lang) {
            this.lang = lang;
        }
        this.translateElements();
        this.subscribers.forEach(s => s.setProperty('lang', lang));
    }
};

const translator = new Translator();