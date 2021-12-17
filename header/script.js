class Header {
    constructor() {
        this.cont = document.querySelector('.balt-nav');
        this.controls = {
            togglers: {
                languages: this.cont.querySelector('.nav-language'),
                locations: this.cont.querySelector('.nav-location'),
                menu: this.cont.querySelector('.nav-menu'),
            },
            languages: {
                ru: this.cont.querySelector('.nav-languages__ru'),
                et: this.cont.querySelector('.nav-languages__es'),
                lv: this.cont.querySelector('.nav-languages__lv'),
                en: this.cont.querySelector('.nav-languages__en'),
            },
            locations: {
                LT: this.cont.querySelector('.nav-locations__lt'),
                ET: this.cont.querySelector('.nav-locations__es'),
                LV: this.cont.querySelector('.nav-locations__lv'),
            },
            mobile: {
                languages: this.cont.querySelector('.mobile-select__languages select'),
                locations: this.cont.querySelector('.mobile-select__locations select'),
            }
        };
        this.menu = {
            desktop: document.querySelector('#rec392236590'),
            mobile: document.querySelector('#rec392236647'),
            links: [],
        };
        this.body = document.querySelector('body');
        this.translator = translator;

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.fetchLocation = this.fetchLocation.bind(this);

        this.menu.desktop.classList.add('my-menu');
        this.menu.mobile.classList.add('my-menu');
        setTimeout(() => {
            this.menu.desktop.classList.add('my-menu-transition');
            this.menu.mobile.classList.add('my-menu-transition');
        }, 10);
        this.menu.links = [...this.menu.desktop.querySelectorAll('a'), ...this.menu.mobile.querySelectorAll('a')];

        for (let key of Object.keys(this.controls.togglers)) {
            this.controls.togglers[key].addEventListener('click', () => this.toggleDropdown(key));
        }
        // for (let key of Object.keys(this.controls.languages)) {
        //     this.controls.languages[key].addEventListener('click', () => this.setLanguage(key));
        // }
        for (let key of Object.keys(this.controls.locations)) {
            this.controls.locations[key].addEventListener('click', () => this.setLocation(key));
        }
        // this.controls.mobile.languages.addEventListener('change', (e) => this.setLanguage(e.target.value, false));
        this.controls.mobile.locations.addEventListener('change', (e) => this.setLocation(e.target.value, false));
        this.menu.links.forEach(link => link.addEventListener('click', this.toggleMenu));

        let lang = getLanguageCookie();
        if (!lang) {
            lang = window.navigator.language.split('-')[0] || 'ru';
            setLanguageCookie(lang);
        }
        const loc = getLocationCookie();
        if (!loc) {
            this.setLocation('lv');
            this.fetchLocation();
        } else {
            this.setLocation(loc);
        }

        this.setLanguage(lang);
    }

    async fetchLocation() {
        const loc = await getLocationRequest();
        setLocationCookie(loc);
        this.setLocation(loc);
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

    toggleDropdown(dropdown = '') {
        if (dropdown === 'menu') {
            return this.toggleMenu();
        }
        this.cont.setAttribute(
            'data-opened',
            this.cont.getAttribute('data-opened') === dropdown ? '' : dropdown
        );
    }

    setLanguage(lang, isToggler = true) {
        console.log('set lang ' + lang);
        this.cont.setAttribute('data-language', lang);
        setLanguageCookie(lang);
        this.translator && this.translator.changeLang(lang);
        isToggler && this.toggleDropdown();
    }

    setLocation(location, isToggler = true) {
        const loc = location.toLowerCase();
        console.log('set location ' + loc);
        this.cont.setAttribute('data-location', loc);
        setLocationCookie(loc);
        // this.translator && this.translator.changeLang();
        this.controls.togglers.locations.firstElementChild.textContent = this.translator
            ? (this.translator.getTranslation(['nav', 'location']) || 'Language')
            : 'Language';
        isToggler && this.toggleDropdown();
    }
}

const header = new Header();