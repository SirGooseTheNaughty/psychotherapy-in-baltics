class Header {
    constructor() {
        this.cont = document.querySelector('.balt-nav');
        this.controls = {
            togglers: {
                languages: this.cont.querySelector('.nav-language'),
                menu: this.cont.querySelector('.nav-menu'),
            },
            languages: {
                ru: this.cont.querySelector('.nav-languages__ru'),
                et: this.cont.querySelector('.nav-languages__et'),
                lv: this.cont.querySelector('.nav-languages__lv'),
                en: this.cont.querySelector('.nav-languages__en'),
            },
            mobile: {
                languages: this.cont.querySelector('.mobile-select__languages select'),
            }
        };
        this.menu = {
            desktop: document.querySelector('#rec392236590'),
            mobile: document.querySelector('#rec392236647'),
            links: [],
        };
        this.body = document.querySelector('body');
        this.translator = translator;

        this.toggleLanguages = this.toggleLanguages.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.setLanguage = this.setLanguage.bind(this);

        this.menu.desktop.classList.add('my-menu');
        this.menu.mobile.classList.add('my-menu');
        setTimeout(() => {
            this.menu.desktop.classList.add('my-menu-transition');
            this.menu.mobile.classList.add('my-menu-transition');
        }, 10);
        this.menu.links = [...this.menu.desktop.querySelectorAll('a'), ...this.menu.mobile.querySelectorAll('a')];

        this.controls.togglers.languages.addEventListener('click', this.toggleLanguages);
        this.controls.togglers.menu.addEventListener('click', this.toggleMenu);
        // for (let key of Object.keys(this.controls.languages)) {
        //     this.controls.languages[key].addEventListener('click', () => this.setLanguage(key));
        // }
        this.menu.links.forEach(link => link.addEventListener('click', this.toggleMenu));

        // let lang = getLanguageCookie();
        // if (!lang) {
        //     lang = window.navigator.language.split('-')[0] || 'ru';
        //     setLanguageCookie(lang);
        // }

        // this.setLanguage(lang);
        this.setLanguage('ru', false);
    }

    toggleMenu() {
        if (this.cont.getAttribute('data-menu') === 'opened') {
            this.menu.desktop.classList.remove('opened');
            this.menu.mobile.classList.remove('opened');
            this.body.classList.remove('menu-opened');
            this.cont.setAttribute('data-menu', '');
        } else {
            this.menu.desktop.classList.add('opened');
            this.menu.mobile.classList.add('opened');
            this.body.classList.add('menu-opened');
            this.cont.setAttribute('data-menu', 'opened');
        }
    }

    toggleLanguages() {
        this.cont.setAttribute('data-languages', this.cont.getAttribute('data-languages') === 'opened' ? '' : 'opened');
    }

    setLanguage(lang, isToggler = true) {
        console.log('set lang ' + lang);
        this.cont.setAttribute('data-language', lang);
        setLanguageCookie(lang);
        this.translator && this.translator.changeLang(lang);
        isToggler && this.toggleLanguages();
    }
}

const header = new Header();