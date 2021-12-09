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
                est: this.cont.querySelector('.nav-languages__es'),
                lv: this.cont.querySelector('.nav-languages__lv'),
                en: this.cont.querySelector('.nav-languages__en'),
            },
            locations: {
                LT: this.cont.querySelector('.nav-locations__lt'),
                ET: this.cont.querySelector('.nav-locations__es'),
                LV: this.cont.querySelector('.nav-locations__lv'),
            },
        };
        this.translator = translator;

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.fetchLocation = this.fetchLocation.bind(this);

        for (let key in Object.keys(this.controls.togglers)) {
            this.controls.togglers[key].addEventListener('click', () => this.toggleDropdown(key));
        }
        for (let key in Object.keys(this.controls.languages)) {
            this.controls.languages[key].addEventListener('click', () => this.setLanguage(key));
        }
        for (let key in Object.keys(this.controls.locations)) {
            this.controls.locations[key].addEventListener('click', () => this.setLocation(key));
        }

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
            this.cont.setAttribute('data-menu', 'closed');
        } else {
            this.cont.setAttribute('data-menu', 'opened');
        }
    }

    toggleDropdown(dropdown = '') {
        this.cont.setAttribute(
            'data-opened',
            this.cont.getAttribute('data-opened') === dropdown ? '' : dropdown
        );
    }

    setLanguage(lang) {
        console.log('set lang ' + lang);
        this.cont.setAttribute('data-language', lang);
        setLanguageCookie(lang);
        this.translator && this.translator.changeLang(lang);
        this.toggleDropdown();
    }

    setLocation(location) {
        const loc = location.toLowerCase();
        console.log('set location ' + loc);
        this.cont.setAttribute('data-location', loc);
        setLocationCookie(loc);
        // this.translator && this.translator.changeLang();
        this.controls.togglers.locations.firstElementChild.textContent = this.translator
            ? (this.translator.getTranslation(['nav', 'location']) || 'Language')
            : 'Language';
        this.toggleDropdown();
    }
}

const header = new Header();