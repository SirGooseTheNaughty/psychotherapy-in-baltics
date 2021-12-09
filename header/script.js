class Header {
    constructor() {
        this.cont = document.querySelector('.balt-nav');
        this.controls = {
            togglers: {
                language: this.cont.querySelector('.nav-language'),
                location: this.cont.querySelector('.nav-location'),
                menu: this.cont.querySelector('.nav-menu'),
            },
            languages: {
                ru: this.cont.querySelector('.nav-languages__ru'),
                est: this.cont.querySelector('.nav-languages__es'),
                lv: this.cont.querySelector('.nav-languages__lv'),
                en: this.cont.querySelector('.nav-languages__en'),
            },
            locations: {
                lithuania: this.cont.querySelector('.nav-locations__lt'),
                estonia: this.cont.querySelector('.nav-locations__es'),
                latvia: this.cont.querySelector('.nav-locations__lv'),
            },
        };
        this.translator = translator;

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.fetchLocation = this.fetchLocation.bind(this);

        this.controls.togglers.language.addEventListener('click', () => this.toggleDropdown('languages'));
        this.controls.togglers.location.addEventListener('click', () => this.toggleDropdown('locations'));
        this.controls.togglers.menu.addEventListener('click', () => this.toggleMenu());
        this.controls.languages.ru.addEventListener('click', () => this.setLanguage('ru'));
        this.controls.languages.est.addEventListener('click', () => this.setLanguage('est'));
        this.controls.languages.lv.addEventListener('click', () => this.setLanguage('lv'));
        this.controls.languages.en.addEventListener('click', () => this.setLanguage('en'));
        this.controls.locations.lithuania.addEventListener('click', () => this.setLocation('LT'));
        this.controls.locations.estonia.addEventListener('click', () => this.setLocation('ET'));
        this.controls.locations.latvia.addEventListener('click', () => this.setLocation('LV'));

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

    toggleDropdown(dropdown) {
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
    }

    setLocation(location) {
        const loc = location.toLowerCase();
        console.log('set location ' + loc);
        this.cont.setAttribute('data-location', loc);
        setLocationCookie(loc);
        this.translator && this.translator.changeLang();
    }
}

const header = new Header();