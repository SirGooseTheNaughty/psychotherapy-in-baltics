"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var searchIcon = "\n    <svg width=\"23\" height=\"23\" viewBox=\"0 0 23 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.8291 9.16457C16.8291 13.3976 13.3976 16.8291 9.16457 16.8291C4.93154 16.8291 1.5 13.3976 1.5 9.16457C1.5 4.93154 4.93154 1.5 9.16457 1.5C13.3976 1.5 16.8291 4.93154 16.8291 9.16457ZM15.093 16.1536C13.4948 17.5105 11.4253 18.3291 9.16457 18.3291C4.10312 18.3291 0 14.226 0 9.16457C0 4.10312 4.10312 0 9.16457 0C14.226 0 18.3291 4.10312 18.3291 9.16457C18.3291 11.4253 17.5105 13.4948 16.1536 15.093L22.0318 20.9711L22.5621 21.5015L21.5015 22.5621L20.9712 22.0318L15.093 16.1536Z\" fill=\"#F2F2F2\"/>\n    </svg>\n";
var deleteIcon = "\n    <svg width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <line x1=\"1.35355\" y1=\"0.646447\" x2=\"16.3536\" y2=\"15.6464\" stroke=\"#F0F0F0\"/>\n        <line x1=\"0.646447\" y1=\"15.6464\" x2=\"15.6464\" y2=\"0.646447\" stroke=\"#F0F0F0\"/>\n    </svg>\n";
var Feed = {
  el: '#feed',
  data: function data() {
    return {
      items: [],
      limit: 6,
      filters: [],
      category: 'events',
      lang: localizator.locale || 'ru',
      loc: '',
      ids: streamIds,
      isFocused: false,
      unfocusTimeout: null,
      search: '',
      currentSearch: ''
    };
  },
  template: "\n        <div id=\"feed\" class=\"appearing\" ref=\"container\">\n            <div class=\"content\">\n                <post v-for=\"post in slicedItems\" :data=\"post\" :key=\"post.data\"></post>\n            </div>\n            <div v-if=\"!currentItems.length\" class=\"nodata\" v-html=\"noDataMsg\"></div>\n            <div v-if=\"currentItems.length > limit\" class=\"more\" v-on:click=\"showMore\">{{ localizator.getTranslation(['seemore']) }}</div>\n            <div class=\"controls\">\n                <div class=\"controls__tags\">\n                    <div\n                        class=\"controls__tag\"\n                        :class=\"{ active: category === 'events' }\"\n                        v-on:click=\"() => setProperty('category', 'events')\"\n                    >{{ localizator.getTranslation(['news', 'news']) }}</div>\n                    <div\n                        class=\"controls__tag\"\n                        :class=\"{ active: category === 'news' }\"\n                        v-on:click=\"() => setProperty('category', 'news')\"\n                    >{{ localizator.getTranslation(['news', 'events']) }}</div>\n                </div>\n            </div>\n            <div class=\"search\">\n                <input\n                    :placeholder=\"enterYourQuery\"\n                    v-model=\"search\"\n                    v-on:focus=\"focus\"\n                    v-on:blur=\"unfocus\"\n                    v-on:keydown=\"setSearch\"\n                ></input>\n                <div v-if=\"!currentSearch\" v-on:click=\"setSearch\" class=\"search__icon\">".concat(searchIcon, "</div>\n                <div v-if=\"currentSearch\" v-on:click=\"clearSearch\" class=\"search__icon\">").concat(deleteIcon, "</div>\n                <div class=\"search__results\" v-if=\"isFocused\">\n                    <div class=\"search__result not-enough-letters\" v-if=\"search.length < 3\">{{ localizator.getTranslation(['startTyping']) }}</div>\n                    <div class=\"search__result not-found\" v-if=\"search.length >= 3 && relevantPosts.length === 0\">{{ localizator.getTranslation(['noPostsSearch']) }}</div>\n                    <a v-for=\"(post, index) of relevantPosts\" :href=\"post.link\"><div class=\"search__result\">{{ post.title }}</div></a>\n                </div>\n            </div>\n        </div>\n    "),
  watch: {
    category: function category() {
      return regeneratorRuntime.async(function category$(_context) {
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
  },
  computed: {
    order: function order() {
      return this.category === 'events' ? 'asc' : 'desc';
    },
    noDataMsg: function noDataMsg() {
      return localizator.getTranslation(['nodata', 'lang']);
    },
    maxShift: function maxShift() {
      return Math.floor((this.currentItems.length - 1) / 3);
    },
    currentItems: function currentItems() {
      var currentItems = _toConsumableArray(this.items);

      var filters = _toConsumableArray(this.filters);

      if (this.loc) {
        filters.push(this.loc);
      }

      if (this.lang) {
        filters.push(this.lang);
      }

      if (filters.length) {
        currentItems = currentItems.filter(function (item) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var filter = _step.value;

              if (!item.categories.includes(filter)) {
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
      }

      if (this.currentSearch) {
        currentItems = this.getRelevantPosts(this.currentSearch, currentItems);
      }

      return currentItems;
    },
    slicedItems: function slicedItems() {
      return this.currentItems.slice(0, this.limit);
    },
    relevantPosts: function relevantPosts() {
      return this.getRelevantPosts(this.search);
    },
    enterYourQuery: function enterYourQuery() {
      return localizator.getTranslation(['enterYourQuery']);
    }
  },
  methods: {
    getRelevantPosts: function getRelevantPosts(search) {
      var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.items;

      if (search.length > 2) {
        return items.filter(function (post) {
          var isInTitle = post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          var isInDesc = post.description.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          var isInText = post.content.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          return isInTitle || isInDesc || isInText;
        });
      }

      return [];
    },
    fetchLink: function fetchLink() {
      var slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var rootId = this.ids[this.category].root;
      return "https://feeds.tildacdn.com/api/getfeed/?feeduid=".concat(rootId, "&size=100&slice=").concat(slice, "&sort%5Bdate%5D=").concat(this.order);
    },
    getItems: function getItems() {
      var allPosts, slice, total, res;
      return regeneratorRuntime.async(function getItems$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              allPosts = [];
              slice = 1;
              total = Infinity;

            case 4:
              if (!(allPosts.length < total)) {
                _context3.next = 15;
                break;
              }

              _context3.next = 7;
              return regeneratorRuntime.awrap(fetch(this.fetchLink(slice)).then(function (r) {
                return r.json();
              }));

            case 7:
              res = _context3.sent;
              allPosts = allPosts.concat(this.preformItems(res));
              total = res.total;

              if (!(!res.nextslice || allPosts.length >= total)) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt("break", 15);

            case 12:
              slice = res.nextslice;
              _context3.next = 4;
              break;

            case 15:
              this.items = allPosts;
              _context3.next = 21;
              break;

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 18]]);
    },
    preformItems: function preformItems(items) {
      return items.posts.map(function (post) {
        var _post$date$split = post.date.split(' '),
            _post$date$split2 = _slicedToArray(_post$date$split, 2),
            date = _post$date$split2[0],
            time = _post$date$split2[1];

        var _date$split = date.split('-'),
            _date$split2 = _slicedToArray(_date$split, 3),
            year = _date$split2[0],
            month = _date$split2[1],
            day = _date$split2[2];

        return {
          title: post.title,
          description: post.descr,
          categories: post.parts.split(','),
          date: date,
          year: year,
          month: month,
          day: day,
          time: time,
          link: post.url
        };
      });
    },
    setFilter: function setFilter(filter) {
      this.filters = [filter];
    },
    shiftRight: function shiftRight() {
      this.shift++;

      if (this.shift > this.maxShift) {
        this.shift = this.maxShift;
      }
    },
    shiftLeft: function shiftLeft() {
      this.shift--;

      if (this.shift < 0) {
        this.shift = 0;
      }
    },
    setProperty: function setProperty(key, property) {
      this[key] = property;
    },
    showMore: function showMore() {
      this.limit += 6;
    },
    focus: function focus() {
      clearTimeout(this.unfocusTimeout);
      this.isFocused = true;
    },
    unfocus: function unfocus() {
      var _this = this;

      this.unfocusTimeout = setTimeout(function () {
        return _this.isFocused = false;
      }, 250);
    },
    setSearch: function setSearch(e) {
      if (e.key === 'Enter' || e.type === 'click') {
        if (this.search.length >= 3) {
          this.currentSearch = this.search;
        }
      } else {
        this.currentSearch = '';
      }
    },
    clearSearch: function clearSearch() {
      this.currentSearch = '';
      this.search = '';
    }
  }
};
var Post = {
  props: ['data'],
  template: "\n        <a :href=\"data.link\">\n            <div class=\"post\">\n                <div class=\"post__datetime\">\n                    <p class=\"date\">{{ date }}</p>\n                    <p class=\"time\">{{ data.time === '00:00' ? '' : data.time }}</p>\n                </div>\n                <div class=\"post__content\">\n                    <h3 class=\"title\" v-html=\"data.title\"></h3>\n                    <p class=\"description\" v-html=\"data.description\"></p>\n                </div>\n                <div class=\"post__seemore\">\n                    <a :href=\"data.link\">{{ localizator.getTranslation(['more']) }}</a>\n                    <svg width=\"23\" height=\"12\" viewBox=\"0 0 23 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M0 6L22 6\" stroke=\"#F0EFEC\"/>\n                        <path d=\"M22 6C19.632 5.92361 14.8959 4.71667 14.8959 0.5\" stroke=\"#F0EFEC\"/>\n                        <path d=\"M22 6C19.632 6.07639 14.8959 7.28333 14.8959 11.5\" stroke=\"#F0EFEC\"/>\n                    </svg>\n                </div>\n            </div>\n        </a>\n    ",
  computed: {
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
Vue.component('post', Post);
var feedApp = new Vue(Feed);