class Translator {
    constructor() {
        this.translations = translations;
        this.texts = [];
        this.lang = 'en';

        this.findAndSortTexts.call(this);
        this.translateElement = this.translateElement.bind(this);
        this.translateElements = this.translateElements.bind(this);
        this.changeLang = this.changeLang.bind(this);
    }

    findAndSortTexts() {
        const elements = [...document.querySelectorAll('[class*="trl"]')];
        this.texts = elements.map(element => {
            const trlClass = [...element.classList].find(cl => cl.includes('trl'));
            const keys = trlClass.split('trl-')[1].split('-');
            return {
                element: element.querySelector('.tn-atom'),
                keys
            }
        });
    }

    translateElement(element) {
        const texts = element.keys.reduce((obj, key) => obj = obj[key], this.translations);
        const text = texts[this.lang]
        element.element.innerHTML = text;
    }

    translateElements() {
        this.texts.forEach(this.translateElement);
    }

    changeLang(lang) {
        this.lang = lang;
        this.translateElements();
    }
};

const tr = new Translator();
tr.changeLang('en');