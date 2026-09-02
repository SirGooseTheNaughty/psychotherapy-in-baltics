"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var timeConsumationIcon = "\n    <svg width=\"13\" height=\"10\" viewBox=\"0 0 13 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <line y1=\"0.5\" x2=\"13\" y2=\"0.5\" stroke=\"#F2F2F2\"/>\n        <line y1=\"3.5\" x2=\"6\" y2=\"3.5\" stroke=\"#F2F2F2\"/>\n        <line y1=\"6.5\" x2=\"13\" y2=\"6.5\" stroke=\"#F2F2F2\"/>\n        <line y1=\"9.5\" x2=\"9\" y2=\"9.5\" stroke=\"#F2F2F2\"/>\n    </svg>\n";
var shiftFiltersIcon = "\n    <svg width=\"10\" height=\"17\" viewBox=\"0 0 10 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <path d=\"M1 1L8 8.5L1 16\" stroke=\"#F2F2F2\" stroke-width=\"1.5\"/>\n    </svg>\n";
var searchIcon = "\n    <svg width=\"23\" height=\"23\" viewBox=\"0 0 23 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.8291 9.16457C16.8291 13.3976 13.3976 16.8291 9.16457 16.8291C4.93154 16.8291 1.5 13.3976 1.5 9.16457C1.5 4.93154 4.93154 1.5 9.16457 1.5C13.3976 1.5 16.8291 4.93154 16.8291 9.16457ZM15.093 16.1536C13.4948 17.5105 11.4253 18.3291 9.16457 18.3291C4.10312 18.3291 0 14.226 0 9.16457C0 4.10312 4.10312 0 9.16457 0C14.226 0 18.3291 4.10312 18.3291 9.16457C18.3291 11.4253 17.5105 13.4948 16.1536 15.093L22.0318 20.9711L22.5621 21.5015L21.5015 22.5621L20.9712 22.0318L15.093 16.1536Z\" fill=\"#F2F2F2\"/>\n    </svg>\n";
var deleteIcon = "\n    <svg width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <line x1=\"1.35355\" y1=\"0.646447\" x2=\"16.3536\" y2=\"15.6464\" stroke=\"#F0F0F0\"/>\n        <line x1=\"0.646447\" y1=\"15.6464\" x2=\"15.6464\" y2=\"0.646447\" stroke=\"#F0F0F0\"/>\n    </svg>\n";
var Blog = {
  el: '#blog',
  data: function data() {
    return {
      items: [],
      limit: 6,
      prefilledFilters: {
        ru: ['методы и подходы', 'исследования', 'профессия', 'семья', 'дети', 'клиника', 'отзывы', 'истории успеха'],
        en: ['methods and approaches', 'research', 'profession', 'family', 'children', 'clinique', 'feedback', 'success stories'],
        lv: ['metodika un pieejas', 'pētījumi', 'profesija', 'ģimene', 'bērni', 'klīnika', 'atsauksmes', 'veiksmes stāsti'],
        et: ['meetodid ja lähenemisviisid', 'uuringud', 'elukutse', 'perekond', 'lapsed', 'kliinik', 'tagasisidet', 'edulood']
      },
      typeLocales: {
        ru: 'все форматы',
        en: 'all formats',
        lv: 'visi formāti',
        et: 'kõik vormingud'
      },
      filterLocales: {
        ru: 'все темы',
        en: 'all topics',
        lv: 'visas tēmas',
        et: 'kõik teemad'
      },
      filters: [],
      type: 'все форматы',
      filter: 'все темы',
      search: '',
      category: 'blog',
      lang: localizator.locale || 'ru',
      loc: '',
      ids: streamIds,
      typesLocales: {
        ru: ['интервью', 'посты', 'видео', 'статьи', 'книги'],
        en: ['interviews', 'posts', 'videos', 'articles', 'books'],
        lv: ['intervijas', 'ziņas', 'video', 'raksti', 'grāmatas'],
        et: ['intervjuud', 'postitused', 'videod', 'artiklid', 'raamatud']
      },
      languages: ['ru', 'en', 'lv', 'et']
    };
  },
  template: "\n        <div id=\"blog\" class=\"appearing\" ref=\"container\">\n            <controls\n                :type=\"type\"\n                :types=\"types\"\n                :filter=\"filter\"\n                :filters=\"filters\"\n                :set-property=\"setProperty\"\n                :get-relevant-posts=\"getRelevantPosts\"\n                :current-search=\"search\"\n                :defaultType=\"defaultType\"\n                :defaultFilter=\"defaultFilter\"\n            ></controls>\n            <div class=\"content\">\n                <post v-for=\"(post, index) in slicedItems\" :data=\"post\" key=\"index\"></post>\n            </div>\n            <div v-if=\"currentItems.length > limit\" class=\"more\" v-on:click=\"showMore\">{{ localizator.getTranslation(['seemore']) }}</div>\n            <div v-if=\"currentItems.length === 0\" class=\"posts-not-found\">{{ localizator.getTranslation(['blog', 'noPosts']) }}</div>\n        </div>\n    ",
  watch: {
    lang: function lang() {
      return regeneratorRuntime.async(function lang$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.getItems();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  },
  created: function created() {
    return regeneratorRuntime.async(function created$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.getItems();

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, null, this);
  },
  mounted: function mounted() {
    this.$refs.container.classList.add('appear');
    this.type = this.defaultType;
    this.filter = this.defaultFilter;
  },
  computed: {
    types: function types() {
      return this.typesLocales[this.lang];
    },
    defaultType: function defaultType() {
      return this.typeLocales[this.lang];
    },
    defaultFilter: function defaultFilter() {
      return this.filterLocales[this.lang];
    },
    noDataMsg: function noDataMsg() {
      return localizator.getTranslation(['nodata', 'lang']);
    },
    currentItems: function currentItems() {
      var _this = this;

      var currentItems = _toConsumableArray(this.items);

      var filters = [this.type, this.filter];

      if (this.loc) {
        filters.push(this.loc);
      }

      if (this.lang) {
        filters.push(this.lang);
      }

      currentItems = currentItems.filter(function (item) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var filter = _step.value;

            if (filter !== _this.defaultFilter && filter !== _this.defaultType && !item.categories.includes(filter)) {
              return false;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return true;
      });

      if (this.search) {
        currentItems = this.getRelevantPosts(this.search, currentItems);
      }

      return currentItems;
    },
    slicedItems: function slicedItems() {
      return this.currentItems.slice(0, this.limit);
    }
  },
  methods: {
    fetchLink: function fetchLink() {
      var slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var rootId = this.ids[this.category].root;
      return "https://feeds.tildacdn.com/api/getfeed/?feeduid=".concat(rootId, "&size=100&slice=").concat(slice, "&sort%5Bdate%5D=").concat(this.order);
    },
    getItems: function getItems() {
      var allPosts, filters, slice, total, res, _this$preformItems, posts, f;

      return regeneratorRuntime.async(function getItems$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              allPosts = [];
              filters = [];
              slice = 1;
              total = Infinity;

            case 5:
              if (!(allPosts.length < total)) {
                _context3.next = 18;
                break;
              }

              _context3.next = 8;
              return regeneratorRuntime.awrap(fetch(this.fetchLink(slice)).then(function (r) {
                return r.json();
              }));

            case 8:
              res = _context3.sent;
              _this$preformItems = this.preformItems(res), posts = _this$preformItems.posts, f = _this$preformItems.filters;
              allPosts = allPosts.concat(posts);
              filters = f;
              total = res.total;

              if (!(!res.nextslice || allPosts.length >= total)) {
                _context3.next = 15;
                break;
              }

              return _context3.abrupt("break", 18);

            case 15:
              slice = res.nextslice;
              _context3.next = 5;
              break;

            case 18:
              this.items = allPosts;
              this.filters = filters;
              _context3.next = 25;
              break;

            case 22:
              _context3.prev = 22;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 22]]);
    },
    preformItems: function preformItems(data) {
      var _this2 = this;

      var posts = [],
          filters = _toConsumableArray(this.prefilledFilters[this.lang]);

      posts = data.posts.map(function (post) {
        var postCategory = '';
        var categories = post.parts.split(',');
        categories.forEach(function (category) {
          if (category && !_this2.types.includes(category) && !_this2.languages.includes(category)) {
            if (!postCategory) {
              postCategory = category;
            } // if (!filters.includes(category)) {   // иначе закидывает русские темы во все языки, можно покумекать и поправить
            //     filters.push(category);
            // }

          }
        });
        var date = post.date.split(' ')[0];

        var _date$split = date.split('-'),
            _date$split2 = _slicedToArray(_date$split, 3),
            year = _date$split2[0],
            month = _date$split2[1],
            day = _date$split2[2];

        return {
          title: post.title,
          img: post.image || null,
          date: date,
          year: year,
          month: month,
          day: day,
          time: post.descr,
          content: post.text,
          categories: categories,
          link: post.url,
          category: postCategory
        };
      });
      return {
        posts: posts,
        filters: filters
      };
    },
    setFilter: function setFilter(filter) {
      this.filter = filter;
    },
    setProperty: function setProperty(key, property) {
      this[key] = property;
    },
    showMore: function showMore() {
      this.limit += 6;
    },
    getRelevantPosts: function getRelevantPosts(search) {
      var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.items;

      if (search.length > 2) {
        return items.filter(function (post) {
          var isInTitle = post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          var isInText = post.content.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          return isInTitle || isInText;
        });
      }

      return [];
    }
  }
};
var Post = {
  props: ['data'],
  template: "\n        <a :href=\"data.link\">\n            <div class=\"card\">\n                <div :style=\"bgImage\" class=\"card__image\"></div>\n                <div class=\"card__info\">\n                    <div class=\"card__category\">{{ data.category || '' }}</div>\n                    <h4 class=\"card__info-title\">{{ data.title }}</h4>\n                    <div class=\"card__info-desc\">\n                        <p class=\"card__info-desc__date\">{{ date }}</p>\n                        <p v-if=\"data.time\" class=\"card__info-desc__time\"><span>".concat(timeConsumationIcon, "</span><span>{{ data.time }}</span></p>\n                    </div>\n                </div>\n                <div class=\"card__read-more\">\u0447\u0438\u0442\u0430\u0442\u044C</div>\n            </div>\n        </a>\n    "),
  computed: {
    bgImage: function bgImage() {
      return "background-image: url(".concat(this.data.img, ")");
    },
    isMobile: function isMobile() {
      return document.documentElement.offsetWidth < 1200;
    },
    date: function date() {
      try {
        var _this$data = this.data,
            day = _this$data.day,
            month = _this$data.month,
            year = _this$data.year;

        if (this.lang === 'en') {
          return "".concat(month, ".").concat(day, ".").concat(year);
        }

        return "".concat(day, ".").concat(month, ".").concat(year);
      } catch (e) {
        console.warn(e);
        return this.data.date;
      }
    }
  }
};
var Controls = {
  props: ['type', 'types', 'filter', 'filters', 'set-property', 'get-relevant-posts', 'current-search', 'defaultType', 'defaultFilter'],
  data: function data() {
    return {
      isSelectionOpened: false,
      isFiltersOpened: false,
      shift: 0,
      search: '',
      isFocused: false,
      unfocusTimeout: null
    };
  },
  template: "\n        <div class=\"controls-panel\">\n            <div class=\"controls\">\n                <div class=\"selection categories\" :class=\"{ opened: isSelectionOpened }\">\n                    <div class=\"selection__icon\">\n                        <svg width=\"14\" height=\"8\" viewBox=\"0 0 14 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <path d=\"M2 2L6.29289 6.29289C6.68342 6.68342 7.31658 6.68342 7.70711 6.29289L12 2\" stroke=\"#7F95D1\" stroke-width=\"2\" stroke-linecap=\"square\"/>\n                        </svg>\n                    </div>\n                    <div class=\"selection__result\" v-on:click=\"toggleSelection\">{{ type }}</div>\n                    <div class=\"selection__options\">\n                        <div class=\"selection__option\" v-if=\"type !== defaultType\" v-on:click=\"setType(defaultType)\">{{ defaultType }}</div>\n                        <div class=\"selection__option\" v-for=\"option in types\" v-if=\"type !== option\" v-on:click=\"setType(option)\">{{ option }}</div>\n                    </div>\n                </div>\n                <div class=\"tab tabs__all\" :class=\"{ selected: filter === defaultFilter }\" v-on:click=\"setFilter(defaultFilter)\">{{ defaultFilter }}</div>\n                <div class=\"tabs\">\n                    <div class=\"tab\" v-for=\"tab in filters\" :class=\"{ selected: filter === tab }\" v-on:click=\"setFilter(tab)\" :style=\"shiftedStyle\">{{ tab }}</div>\n                    <div v-if=\"shift !== 0\" v-on:click=\"shiftRight\" class=\"tabs__shift-icon left\">".concat(shiftFiltersIcon, "</div>\n                    <div v-if=\"shift < maxShift\" v-on:click=\"shiftLeft\" class=\"tabs__shift-icon right\">").concat(shiftFiltersIcon, "</div>\n                </div>\n                <div class=\"selection filters\" :class=\"{ opened: isFiltersOpened }\">\n                    <div class=\"selection__icon\">\n                        <svg width=\"14\" height=\"8\" viewBox=\"0 0 14 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <path d=\"M2 2L6.29289 6.29289C6.68342 6.68342 7.31658 6.68342 7.70711 6.29289L12 2\" stroke=\"#7F95D1\" stroke-width=\"2\" stroke-linecap=\"square\"/>\n                        </svg>\n                    </div>\n                    <div class=\"selection__result\" v-on:click=\"toggleFilters\">{{ filter }}</div>\n                    <div class=\"selection__options\">\n                        <div class=\"selection__option\" v-if=\"filter !== defaultFilter\" v-on:click=\"setFilter(defaultFilter)\">{{ defaultFilter }}</div>\n                        <div class=\"selection__option\" v-for=\"option in filters\" v-if=\"filter !== option\" v-on:click=\"setFilter(option)\">{{ option }}</div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"search\">\n                <input\n                    :placeholder=\"enterYourQuery\"\n                    v-model=\"search\"\n                    v-on:focus=\"focus\"\n                    v-on:blur=\"unfocus\"\n                    v-on:keydown=\"setSearch\"\n                ></input>\n                <div v-if=\"!currentSearch\" v-on:click=\"setSearch\" class=\"search__icon\">").concat(searchIcon, "</div>\n                <div v-if=\"currentSearch\" v-on:click=\"clearSearch\" class=\"search__icon\">").concat(deleteIcon, "</div>\n                <div class=\"search__results\" v-if=\"isFocused\">\n                    <div class=\"search__result not-enough-letters\" v-if=\"search.length < 3\">{{ localizator.getTranslation(['startTyping']) }}</div>\n                    <div class=\"search__result not-found\" v-if=\"search.length >= 3 && relevantPosts.length === 0\">{{ localizator.getTranslation(['noPostsSearch']) }}</div>\n                    <a v-for=\"(post, index) of relevantPosts\" :href=\"post.link\"><div class=\"search__result\">{{ post.title }}</div></a>\n                </div>\n            </div>\n        </div>\n    "),
  computed: {
    maxShift: function maxShift() {
      return this.filters.length - 4;
    },
    shiftedStyle: function shiftedStyle() {
      return "transform: translateX(".concat(-this.shift * 100, "%)");
    },
    relevantPosts: function relevantPosts() {
      return this.getRelevantPosts(this.search);
    },
    notFound: function notFound() {
      return this.search.length >= 3 && this.relevantPosts.length === 0;
    },
    enterYourQuery: function enterYourQuery() {
      return localizator.getTranslation(['enterYourQuery']);
    }
  },
  methods: {
    toggleSelection: function toggleSelection() {
      this.isSelectionOpened = !this.isSelectionOpened;

      if (this.isSelectionOpened && this.isFiltersOpened) {
        this.isFiltersOpened = false;
      }
    },
    toggleFilters: function toggleFilters() {
      this.isFiltersOpened = !this.isFiltersOpened;

      if (this.isFiltersOpened && this.isSelectionOpened) {
        this.isSelectionOpened = false;
      }
    },
    setType: function setType(type) {
      this.setProperty('type', type);
      this.toggleSelection();
    },
    setFilter: function setFilter(filter) {
      this.setProperty('filter', filter);
      this.toggleFilters();
    },
    shiftLeft: function shiftLeft() {
      this.shift = this.shift < this.maxShift - 1 ? this.shift + 1 : this.maxShift;
    },
    shiftRight: function shiftRight() {
      this.shift = this.shift > 1 ? this.shift - 1 : 0;
    },
    focus: function focus() {
      clearTimeout(this.unfocusTimeout);
      this.isFocused = true;
    },
    unfocus: function unfocus() {
      var _this3 = this;

      this.unfocusTimeout = setTimeout(function () {
        return _this3.isFocused = false;
      }, 250);
    },
    setSearch: function setSearch(e) {
      if (e.key === 'Enter' || e.type === 'click') {
        if (this.search.length >= 3) {
          this.setProperty('search', this.search);
        }
      } else {
        this.setProperty('search', '');
      }
    },
    clearSearch: function clearSearch() {
      this.setProperty('search', '');
      this.search = '';
    }
  }
};
Vue.component('post', Post);
Vue.component('controls', Controls);
var blogApp = new Vue(Blog);