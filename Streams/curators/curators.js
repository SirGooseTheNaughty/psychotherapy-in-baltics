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
        }
    },
    template: `
        <div id="curators">
            <div class="content">
                <person v-for="(person, index) in currentItems" :data="person" :shift="shift" key="index"></person>
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
            this.items = await this.getItems();
        },
    },
    async created() {
        this.items = await this.getItems();
        translator.subscribers.push(this);
    },
    computed: {
        maxShift: function() {
            return Math.floor((this.currentItems.length - 1) / 3);
        },
        currentItems: function() {
            let currentItems = [...this.items];
            if (this.loc) {
                this.filters.push(this.loc);
            }
            if (this.filters.length) {
                currentItems = currentItems.filter(item => {
                    for (let filter of this.filters) {
                        if (!item.categories.includes(filter)) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            if (this.limit) {
                currentItems = currentItems.slice(0, this.limit);
            }
            return currentItems;
        },
        fetchLink: function() {
            const rootId = this.ids[this.category].root;
            const langId = this.ids[this.category][this.lang];
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}-${langId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
        }
    },
    methods: {
        getItems: async function() {
            let items = [];
            await fetch(this.fetchLink)
                .then(res => res.json())
                .then(res => items = res)
                .catch(console.log);
            return this.preformItems(items);
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
    }
}

const Curator = {
    props: ['data', 'shift'],
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
            return `transform: translateX(${-300 * this.shift}%)`;
        }
    }
};

Vue.component('person', Curator);
const curatorsApp = new Vue(Curators);