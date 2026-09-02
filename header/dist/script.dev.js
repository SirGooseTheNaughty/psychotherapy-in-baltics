"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Header =
/*#__PURE__*/
function () {
  function Header() {
    var _this = this;

    _classCallCheck(this, Header);

    this.cont = document.querySelector('.balt-nav');
    this.controls = {
      togglers: {
        languages: this.cont.querySelector('.nav-language'),
        menu: this.cont.querySelector('.nav-menu')
      },
      languages: {
        ru: this.cont.querySelector('.nav-languages__ru'),
        en: this.cont.querySelector('.nav-languages__en'),
        lv: this.cont.querySelector('.nav-languages__lv'),
        et: this.cont.querySelector('.nav-languages__et'),
        lt: this.cont.querySelector('.nav-languages__lt')
      },
      mobile: {
        languages: this.cont.querySelector('.mobile-select')
      }
    };
    this.menu = {
      desktop: document.querySelector('#rec392236590'),
      mobile: document.querySelector('#rec392236647'),
      links: []
    };
    this.body = document.querySelector('body');
    this.localizator = localizator;
    this.toggleLanguages = this.toggleLanguages.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.goToLink = this.goToLink.bind(this);
    this.menu.desktop.classList.add('my-menu');
    this.menu.mobile.classList.add('my-menu');
    setTimeout(function () {
      _this.menu.desktop.classList.add('my-menu-transition');

      _this.menu.mobile.classList.add('my-menu-transition');
    }, 10);
    this.menu.links = [].concat(_toConsumableArray(this.menu.desktop.querySelectorAll('a')), _toConsumableArray(this.menu.mobile.querySelectorAll('a')), _toConsumableArray(this.cont.querySelectorAll('a')));
    this.controls.togglers.languages.addEventListener('click', this.toggleLanguages);
    this.controls.mobile.languages.addEventListener('change', function (e) {
      return _this.changeLanguage(e.target.value);
    });
    this.controls.togglers.menu.addEventListener('click', this.toggleMenu);

    var _loop = function _loop(key) {
      if (_this.controls.languages[key]) {
        _this.controls.languages[key].addEventListener('click', function () {
          return _this.changeLanguage(key);
        });
      }
    };

    for (var key in this.controls.languages) {
      _loop(key);
    }

    this.menu.links.forEach(function (link) {
      return link.addEventListener('click', _this.goToLink);
    });
    var lang = this.localizator.locale || 'ru';
    this.setLanguage(lang, false);
  }

  _createClass(Header, [{
    key: "isLangPageWithoutSlash",
    value: function isLangPageWithoutSlash(loc) {
      var locEndIndex = loc.length;

      if (loc[locEndIndex - 1] === '/') {
        return false;
      }

      var lang = loc.slice(locEndIndex - 2, locEndIndex);
      var langs = ['en', 'lv', 'lt', 'et'];
      return langs.includes(lang);
    }
  }, {
    key: "goToLink",
    value: function goToLink(e) {
      if (e.currentTarget.getAttribute('href').startsWith('#')) {
        return;
      }

      e.preventDefault();
      var loc = window.location.toString();

      if (loc.includes('?')) {
        loc = loc.split('?')[0];
      }

      if (loc.includes('#')) {
        loc = loc.split('#')[0];
      }

      if (this.isLangPageWithoutSlash(loc)) {
        loc += '/';
      }

      window.location = "".concat(loc, "/..").concat(e.currentTarget.getAttribute('href'));
    }
  }, {
    key: "toggleMenu",
    value: function toggleMenu() {
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
  }, {
    key: "toggleLanguages",
    value: function toggleLanguages() {
      this.cont.setAttribute('data-languages', this.cont.getAttribute('data-languages') === 'opened' ? '' : 'opened');
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(lang) {
      var isToggler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      console.log('set lang ' + lang);
      this.cont.setAttribute('data-language', lang);
      this.controls.mobile.languages.value = lang;
      isToggler && this.toggleLanguages(); // if (this.localizator && this.localizator.locale !== lang) {
      //     this.localizator.changeLanguage(lang);
      // }
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lang) {
      var isToggler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.setLanguage(lang, isToggler = true);
      setLanguageCookie(lang);
      this.localizator && this.localizator.changeLanguage(lang);
    }
  }]);

  return Header;
}();

var header = new Header();