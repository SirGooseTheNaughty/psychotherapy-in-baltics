const searchIcon = `
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8291 9.16457C16.8291 13.3976 13.3976 16.8291 9.16457 16.8291C4.93154 16.8291 1.5 13.3976 1.5 9.16457C1.5 4.93154 4.93154 1.5 9.16457 1.5C13.3976 1.5 16.8291 4.93154 16.8291 9.16457ZM15.093 16.1536C13.4948 17.5105 11.4253 18.3291 9.16457 18.3291C4.10312 18.3291 0 14.226 0 9.16457C0 4.10312 4.10312 0 9.16457 0C14.226 0 18.3291 4.10312 18.3291 9.16457C18.3291 11.4253 17.5105 13.4948 16.1536 15.093L22.0318 20.9711L22.5621 21.5015L21.5015 22.5621L20.9712 22.0318L15.093 16.1536Z" fill="#F2F2F2"/>
    </svg>
`;
const deleteIcon = `
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1.35355" y1="0.646447" x2="16.3536" y2="15.6464" stroke="#F0F0F0"/>
        <line x1="0.646447" y1="15.6464" x2="15.6464" y2="0.646447" stroke="#F0F0F0"/>
    </svg>
`;

const Feed = {
    el: '#feed',
    data() {
        return {
            items: [],
            limit: 6,
            filters: [],
            category: 'events',
            lang: translator.lang,
            loc: '',
            ids: streamIds,
            order: 'desc',
            isFocused: false,
            unfocusTimeout: null,
            search: '',
            currentSearch: '',
        }
    },
    template: `
        <div id="feed">
            <div class="content">
                <post v-for="post in slicedItems" :data="post" :key="post.data"></post>
            </div>
            <div v-if="!currentItems.length" class="nodata" v-html="noDataMsg"></div>
            <div v-if="currentItems.length > limit" class="more" v-on:click="showMore">смотреть еще</div>
            <div class="controls">
                <div class="controls__tags">
                    <div
                        class="controls__tag"
                        :class="{ active: category === 'events' }"
                        v-on:click="() => setProperty('category', 'events')"
                    >Ближайшие мероприятия</div>
                    <div
                        class="controls__tag"
                        :class="{ active: category === 'news' }"
                        v-on:click="() => setProperty('category', 'news')"
                    >События</div>
                </div>
            </div>
            <div class="search">
                <input
                    placeholder="Введите свой запрос, например, семинар"
                    v-model="search"
                    v-on:focus="focus"
                    v-on:blur="unfocus"
                    v-on:keydown="setSearch"
                ></input>
                <div v-if="!currentSearch" v-on:click="setSearch" class="search__icon">${searchIcon}</div>
                <div v-if="currentSearch" v-on:click="clearSearch" class="search__icon">${deleteIcon}</div>
                <div class="search__results" v-if="isFocused">
                    <div class="search__result not-enough-letters" v-if="search.length < 3">Начните печатать для поиска</div>
                    <div class="search__result not-found" v-if="search.length >= 3 && relevantPosts.length === 0">По данному запросу не найдено публикаций</div>
                    <a v-for="(post, index) of relevantPosts" :href="post.link"><div class="search__result">{{ post.title }}</div></a>
                </div>
            </div>
        </div>
    `,
    watch: {
        category: async function() {
            this.getItems();
        },
    },
    async created() {
        translator.subscribers.push(this);
        this.getItems();
    },
    computed: {
        noDataMsg: function() {
            return translator.getTranslation(['common', 'nodata', 'lang'], this.lang);
        },
        maxShift: function() {
            return Math.floor((this.currentItems.length - 1) / 3);
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
            if (filters.length) {
                currentItems = currentItems.filter(item => {
                    for (let filter of filters) {
                        if (!item.categories.includes(filter)) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            if (this.currentSearch) {
                currentItems = this.getRelevantPosts(this.currentSearch, currentItems)
            }
            return currentItems;
        },
        slicedItems: function () {
            return this.currentItems.slice(0, this.limit);
        },
        fetchLink: function() {
            const rootId = this.ids[this.category].root;
            // const langId = this.ids[this.category][this.lang];
            // return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}-${langId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
        },
        relevantPosts: function() {
            return this.getRelevantPosts(this.search);
        },
    },
    methods: {
        getRelevantPosts: function(search, items = this.items) {
            if (search.length > 2) {
                return items.filter(post => {
                    const isInTitle = post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                    const isInDesc = post.description.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                    const isInText = post.content.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                    return isInTitle || isInDesc || isInText;
                });
            }
            return [];
        },
        getItems: async function() {
            // return this.items = this.category === 'events' ? mockedEvents : mockedNews;
            await fetch(this.fetchLink)
                .then(res => res.json())
                .then(res => {
                    this.items = this.preformItems(res);
                })
                .catch(console.log);
        },
        preformItems: function(items) {
            return items.posts.map(post => {
                const [ date, time ] = post.date.split(' ');
                const [ year, month, day ] = date.split('-');
                return {
                    title: post.title,
                    description: post.descr,
                    categories: post.parts.split(','),
                    date,
                    year,
                    month,
                    day,
                    time,
                    link: post.url,
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
        showMore: function() {
            this.limit += 6;
        },
        focus: function() {
            clearTimeout(this.unfocusTimeout);
            this.isFocused = true;
        },
        unfocus: function() { this.unfocusTimeout = setTimeout(() => this.isFocused = false, 250); },
        setSearch: function(e) {
            if (e.key === 'Enter' || e.type === 'click') {
                if (this.search.length >= 3) {
                    this.currentSearch = this.search;
                }
            } else {
                this.currentSearch = '';
            }
        },
        clearSearch: function() {
            this.currentSearch = '';
            this.search = '';
        }
    }
}

const Post = {
    props: ['data'],
    template: `
        <a :href="data.link">
            <div class="post">
                <div class="post__datetime">
                    <p class="date">{{ date }}</p>
                    <p class="time">{{ data.time === '00:00' ? '' : data.time }}</p>
                </div>
                <div class="post__content">
                    <h3 class="title">{{ data.title }}</h3>
                    <p class="description" v-html="data.description"></p>
                </div>
                <div class="post__seemore">
                    <a :href="data.link">Подробнее</a>
                    <svg width="23" height="12" viewBox="0 0 23 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 6L22 6" stroke="#F0EFEC"/>
                        <path d="M22 6C19.632 5.92361 14.8959 4.71667 14.8959 0.5" stroke="#F0EFEC"/>
                        <path d="M22 6C19.632 6.07639 14.8959 7.28333 14.8959 11.5" stroke="#F0EFEC"/>
                    </svg>
                </div>
            </div>
        </a>
    `,
    computed: {
        date: function() {
            try {
                const day = this.data.day[0] === '0' ? this.data.day[1] : this.data.day;
                const month = translator.getTranslation(['common', 'months', this.data.month]);
                return month ? `${day} ${month}, ${this.data.year}` : this.data.date;
            } catch(e) {
                console.warn(e);
                return this.data.date;
            }
        }
    }
};

Vue.component('post', Post);
const feedApp = new Vue(Feed);