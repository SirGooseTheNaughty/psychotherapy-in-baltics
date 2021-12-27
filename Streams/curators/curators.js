const svgNextBtn = `
    <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 30.5L44 30.5" stroke="#FF8552"/>
        <path d="M44 30.5C40.7708 30.3958 34.3125 28.75 34.3125 23" stroke="#FF8552"/>
        <path d="M44 30.5C40.7708 30.6042 34.3125 32.25 34.3125 38" stroke="#FF8552"/>
        <circle cx="29.5" cy="29.5" r="29" fill="white" fill-opacity="0.26" stroke="#FF8552"/>
    </svg>
`;

const Curators = {
    el: '#curators',
    data() {
        return {
            items: [],
            filters: ['curators'],
            category: 'curators',
            lang: localizator.locale || 'ru',
            loc: '',
            ids: streamIds,
            baseLink: '',
            shift: 0,
            transition: 0,
            touchX: 0,
            touchY: 0,
            order: 'asc',
        }
    },
    template: `
        <div id="curators">
            <div
                class="content"
                v-if="currentItems.length"
                v-on:touchmove="shiftMobile"
                v-on:touchstart="addListener"
                v-on:touchend="removeListener"
                v-on:touchcancel="removeListener"
            >
                <person v-for="(person, index) in currentItems" :data="person" :shift="shift" :transition="transition" key="index"></person>
            </div>
            <div v-if="!currentItems.length" class="nodata" v-html="noDataMsg"></div>
            <div class="controls">
                <div class="controls__tags">
                    <div
                        class="controls__tag controls__curators"
                        :class="{ active: filters.includes('curators') }"
                        v-on:click="() => setFilter('curators')"
                    >{{ curatorsText }}</div>
                    <div
                        class="controls__tag controls__experts"
                        :class="{ active: filters.includes('experts') }"
                        v-on:click="() => setFilter('experts')"
                    >{{ expertsText }}</div>
                </div>
                <div v-if="currentItems.length" :class="{ hidden: shift === 0 }" class="controls__btn controls__left" v-on:click="shiftLeft">${svgNextBtn}</div>
                <div v-if="currentItems.length" :class="{ hidden: shift === maxShift }" class="controls__btn controls__right" v-on:click="shiftRight">${svgNextBtn}</div>
            </div>
        </div>
    `,
    watch: {
        category: function() {
            this.shift = 0;
        },
        lang: async function() {
            this.getItems();
        },
    },
    async created() {
        this.getItems();
    },
    computed: {
        limit: function() {
            const dw = document.documentElement.clientWidth;
            if (dw > 980) {
                return 3;
            } else if (dw > 640) {
                return 2;
            }
            return 1;
        },
        curatorsText: function() {
            return localizator.getTranslation(['curators', 'curators']);
        },
        expertsText: function() {
            return localizator.getTranslation(['curators', 'experts']);
        },
        noDataMsg: function() {
            return localizator.getTranslation(['nodata', 'lang']);
        },
        maxShift: function() {
            return this.currentItems.length - this.limit;
        },
        currentItems: function() {
            let currentItems = [...this.items];
            const filters = [...this.filters];
            if (this.loc) {
                filters.push(this.loc);
            }
            if (this.lang) {
                filters.push(this.lang);
            }
            if (this.filters.length) {
                currentItems = currentItems.filter(item => {
                    for (let filter of filters) {
                        if (!item.categories.includes(filter)) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            return currentItems;
        },
        fetchLink: function() {
            const rootId = this.ids[this.category].root;
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
        }
    },
    methods: {
        getItems: async function() {
            // this.items = mockedCurators;
            await fetch(this.fetchLink)
                .then(res => res.json())
                .then(res => {
                    this.items = this.preformItems(res);
                })
                .catch(console.log);
        },
        preformItems: function(items) {
            return items.posts.map(post => {
                return {
                    name: post.title,
                    pic: post.image || null,
                    desc1: post.descr,
                    desc2: post.text,
                    categories: post.parts.split(','),
                };
            });
        },
        setFilter: function(filter) {
            this.filters = [filter];
        },
        shiftRight: function () {
            this.shift++;
            if (this.shift > this.maxShift) {
                this.shift = this.maxShift;
            }
        },
        shiftLeft: function () {
            this.shift--;
            if (this.shift < 0) {
                this.shift = 0;
            }
        },
        setProperty: function(key, property) {
            this[key] = property;
        },
        shiftMobile: function(e) {
            const diffX = e.targetTouches[0].screenX - this.touchX;
            const diffY = e.targetTouches[0].screenY - this.touchY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
                this.isDrag = true;
                this.transition = diffX;
            }
            this.touchX = e.targetTouches[0].screenX;
            this.touchY = e.targetTouches[0].screenY;
        },
        addListener: function(e) {
            if (e.targetTouches && e.targetTouches[0]) {
                this.touchX = e.targetTouches[0].screenX;
            }
        },
        removeListener: function(e) {
            if (this.isDrag) {
                if (this.transition < 0) {
                    this.shiftRight();
                } else {
                    this.shiftLeft();
                }
            }
            this.isDrag = false;
        },
    }
}

const Curator = {
    props: ['data', 'shift', 'transition'],
    template: `
        <div class="card" :style="shiftStyle">
            <img :src="data.pic" alt="curator" class="person">
            <div class="card__info">
                <h4 class="card__info-name">{{ data.name }}</h4>
                <div class="card__info-desc" :class="{ changable: !!data.desc2 }">
                    <p>{{ data.desc1 }}</p>
                    <p>{{ data.desc2 || '' }}</p>
                </div>
            </div>
        </div>
    `,
    computed: {
        shiftStyle: function() {
            return `transform: translateX(${-100 * this.shift}%)`;
        }
    }
};

Vue.component('person', Curator);
const curatorsApp = new Vue(Curators);