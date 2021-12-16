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
            limit: 3,
            filters: ['curators'],
            category: 'curators',
            lang: translator.lang,
            loc: '',
            ids: streamIds,
            baseLink: '',
            shift: 0,
            transition: 0,
            touchX: 0,
        }
    },
    template: `
        <div id="curators">
            <div
                class="content"
                v-on:touchmove="shiftMobile"
                v-on:touchstart="addListener"
                v-on:touchend="removeListener"
                v-on:touchcancel="removeListener"
            >
                <person v-for="(person, index) in currentItems" :data="person" :shift="shift" :transition="transition" key="index"></person>
            </div>
            <div class="controls">
                <div class="controls__tags">
                    <div
                        class="controls__tag controls__curators"
                        :class="{ active: filters.includes('curators') }"
                        v-on:click="() => setFilter('curators')"
                    >Кураторы программ</div>
                    <div
                        class="controls__tag controls__experts"
                        :class="{ active: filters.includes('experts') }"
                        v-on:click="() => setFilter('experts')"
                    >Эксперты-консультанты</div>
                </div>
                <div :class="{ hidden: shift === 0 }" class="controls__btn controls__left" v-on:click="shiftLeft">${svgNextBtn}</div>
                <div :class="{ hidden: shift === maxShift }" class="controls__btn controls__right" v-on:click="shiftRight">${svgNextBtn}</div>
            </div>
        </div>
    `,
    watch: {
        category: function() {
            this.shift = 0;
        },
        lang: async function() {
            await this.getItems();
        },
    },
    async created() {
        await this.getItems();
        translator.subscribers.push(this);
    },
    computed: {
        maxShift: function() {
            return this.currentItems.length - this.limit;
        },
        maxShiftPx: function() {
            const docWidth = document.documentElement.offsetWidth;
            let itemWidth, gap;
            if (docWidth > 480) {
                const cellWidth = gridSizes[3].h;
                itemWidth = cellWidth * 3;
                gap = (docWidth / 2) - (2 * cellWidth);
            } else {
                const cellWidth = gridSizes[4].h;
                itemWidth = cellWidth * 2;
                gap = (docWidth / 2) - cellWidth;
            }
            return (this.currentItems.length - 1) * itemWidth - gap;
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
            // const langId = this.ids[this.category][this.lang];
            // return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}-${langId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
        }
    },
    methods: {
        getItems: async function() {
            // return mockedCurators;
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
            if (this.isDrag) {
                e.preventDefault();
                const diffX = e.targetTouches[0].screenX - this.touchX;
                let newX = this.transition + diffX;
                if (newX > 0) {
                    newX = 0;
                } else if (Math.abs(newX) > this.maxShiftPx) {
                    newX = -this.maxShiftPx;
                }
                this.touchX = e.targetTouches[0].screenX;
                this.transition = newX;
                console.log(this.transition);
            }
        },
        addListener: function(e) {
            this.isDrag = true;
            if (e.targetTouches && e.targetTouches[0]) {
                this.touchX = e.targetTouches[0].screenX;
            }
        },
        removeListener: function() {
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
            return this.transition
                ? `transition: 0s; transform: translateX(${this.transition}px)`
                : `transform: translateX(${-100 * this.shift}%)`;
        }
    }
};

Vue.component('person', Curator);
const curatorsApp = new Vue(Curators);