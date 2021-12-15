class Popup {
    constructor(id, openerSelector) {
        this.popup = document.querySelector(id);
        this.open = document.querySelector(openerSelector);
        this.close = this.popup.querySelector('.close');
        this.docBody = document.querySelector('body');
        this.modules = {
            desktop: this.popup.querySelector('.modules__desktop'),
            mobile: this.popup.querySelector('.modules__mobile'),
        };
        this.modulesTrigger = this.popup.querySelector('.module-trigger');
        this.blocksTriggers = {
            desktop: this.popup.querySelectorAll('.triggers.desktop .trigger'),
            mobile: this.popup.querySelectorAll('.trigger.mobile'),
        };

        this.modulesTrigger.addEventListener('click', this.toggleModules.bind(this));
        this.blocksTriggers.desktop.forEach((trigger, index) => {
            trigger.addEventListener('click', () => this.changeBlocks(index + 1));
        });
        this.blocksTriggers.mobile.forEach((trigger, index) => {
            trigger.addEventListener('click', () => this.changeBlocks(index + 1));
        });
        this.open.addEventListener('click', this.togglePopup.bind(this));
        this.close.addEventListener('click', this.togglePopup.bind(this));
    }

    togglePopup() {
        const opened = this.popup.classList.contains('opened');
        if (opened) {
            this.popup.classList.remove('opened');
            this.docBody.classList.remove('popup-opened');
        } else {
            this.popup.classList.add('opened');
            this.docBody.classList.add('popup-opened');
        }
    }

    toggleModules() {
        this.popup.setAttribute(
            'data-modules', 
            this.popup.getAttribute('data-modules') === 'opened' ? '' : 'opened'
        );
    }

    changeBlocks(index) {
        this.popup.setAttribute('data-block', index);
    }
};

const gestaltPopup = new Popup('#gestalt', '.open-popup');