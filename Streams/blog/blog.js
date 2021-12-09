const timeConsumationIcon = `
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line y1="0.5" x2="13" y2="0.5" stroke="#F2F2F2"/>
        <line y1="3.5" x2="6" y2="3.5" stroke="#F2F2F2"/>
        <line y1="6.5" x2="13" y2="6.5" stroke="#F2F2F2"/>
        <line y1="9.5" x2="9" y2="9.5" stroke="#F2F2F2"/>
    </svg>
`;

const shiftFiltersIcon = `
    <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L8 8.5L1 16" stroke="#F2F2F2" stroke-width="1.5"/>
    </svg>
`;

const searchIcon = `
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8291 9.16457C16.8291 13.3976 13.3976 16.8291 9.16457 16.8291C4.93154 16.8291 1.5 13.3976 1.5 9.16457C1.5 4.93154 4.93154 1.5 9.16457 1.5C13.3976 1.5 16.8291 4.93154 16.8291 9.16457ZM15.093 16.1536C13.4948 17.5105 11.4253 18.3291 9.16457 18.3291C4.10312 18.3291 0 14.226 0 9.16457C0 4.10312 4.10312 0 9.16457 0C14.226 0 18.3291 4.10312 18.3291 9.16457C18.3291 11.4253 17.5105 13.4948 16.1536 15.093L22.0318 20.9711L22.5621 21.5015L21.5015 22.5621L20.9712 22.0318L15.093 16.1536Z" fill="#F2F2F2"/>
    </svg>
`;

const Blog = {
    el: '#blog',
    data() {
        return {
            items: [],
            limit: 6,
            filters: [],
            type: 'все категории',
            filter: 'все',
            search: '',
            category: 'blog',
            lang: translator.lang,
            loc: '',
            ids: streamIds,
            types: ['интервью', 'посты', 'видео', 'статьи', 'книги'],
            languages: ['ru', 'en', 'lv', 'lv'],
        }
    },
    template: `
        <div id="blog">
            <controls :type="type" :types="types" :filter="filter" :filters="filters" :set-property="setProperty" :get-relevant-posts="getRelevantPosts"></controls>
            <div class="content">
                <post v-for="(post, index) in slicedItems" :data="post" key="index"></post>
            </div>
            <div v-if="currentItems.length > limit" class="more" v-on:click="showMore">смотреть еще</div>
            <div v-if="currentItems.length === 0" class="posts-not-found">По таким параметрам не найдено публикаций</div>
        </div>
    `,
    watch: {
        lang: async function() {
            this.getItems();
        },
    },
    async created() {
        this.getItems();
        translator.subscribers.push(this);
    },
    computed: {
        currentItems: function() {
            let currentItems = [...this.items];
            const filters = [this.type, this.filter];
            if (this.loc) {
                filters.push(this.loc);
            }
            currentItems = currentItems.filter(item => {
                for (let filter of filters) {
                    if (filter !== 'все' && filter !== 'все категории' && !item.categories.includes(filter)) {
                        return false;
                    }
                }
                return true;
            });
            if (this.search) {
                currentItems = this.getRelevantPosts(this.search, currentItems)
            }
            return currentItems;
        },
        slicedItems: function () {
            return this.currentItems.slice(0, this.limit);
        },
        fetchLink: function() {
            const rootId = this.ids[this.category].root;
            const langId = this.ids[this.category][this.lang];
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}-${langId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
        }
    },
    methods: {
        getItems: async function() {
            // this.items = mockedPosts.reverse();
            // this.filters = mockedFilters;
            await fetch(this.fetchLink)
                .then(res => res.json())
                .then(res => {
                    const { posts, filters } = this.preformItems(res);
                    this.items = posts;
                    this.filters = filters;
                })
                .catch(console.log);
        },
        preformItems: function(data) {
            let posts = [], filters = [];
            posts = data.posts.map(post => {
                let postCategory = '';
                const categories = post.parts.split(',');
                categories.forEach(category => {
                    if (!this.types.includes(category) && !this.languages.includes(category)) {
                        if (!postCategory) {
                            postCategory = category;
                        }
                        if (!filters.includes(category)) {
                            filters.push(category);
                        }
                    }
                });
                return {
                    title: post.title,
                    img: post.image || null,
                    date: post.date.split(' ')[0],
                    time: post.descr,
                    content: post.text,
                    categories: categories,
                    link: post.url,
                    category: postCategory,
                };
            });
            return { posts, filters };
        },
        setFilter: function(filter) {
            this.filter = filter;
        },
        setProperty: function(key, property) {
            this[key] = property;
        },
        showMore: function() {
            this.limit += 6;
        },
        getRelevantPosts: function(search, items = this.items) {
            if (search.length > 2) {
                return items.filter(post => {
                    const isInTitle = post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                    const isInText = post.content.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                    return isInTitle || isInText;
                });
            }
            return [];
        },
    }
}

const Post = {
    props: ['data'],
    template: `
        <a :href="data.link">
            <div class="card">
                <div class="card__category">{{ data.category || '' }}</div>
                <img :src="data.img" alt="post cover" class="card__image">
                <div class="card__info">
                    <h4 class="card__info-title">{{ data.title }}</h4>
                    <div class="card__info-desc">
                        <p class="card__info-desc__date">{{ data.date }}</p>
                        <p class="card__info-desc__time"><span>${timeConsumationIcon}</span><span>{{ data.time }}</span></p>
                    </div>
                </div>
            </div>
        </a>
    `,
};

const Controls = {
    props: ['type', 'types', 'filter', 'filters', 'set-property', 'get-relevant-posts'],
    data() {
        return {
            isSelectionOpened: false,
            shift: 0,
            search: '',
            isFocused: false,
            unfocusTimeout: null,
        }
    },
    template: `
        <div class="controls-panel">
            <div class="controls">
                <div class="selection" :class="{ opened: isSelectionOpened }">
                    <div class="selection__icon">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L6.29289 6.29289C6.68342 6.68342 7.31658 6.68342 7.70711 6.29289L12 2" stroke="#7F95D1" stroke-width="2" stroke-linecap="square"/>
                        </svg>
                    </div>
                    <div class="selection__result" v-on:click="toggleSelection">{{ type }}</div>
                    <div class="selection__options">
                        <div class="selection__option" v-if="type !== 'все категории'" v-on:click="setType('все категории')">все категории</div>
                        <div class="selection__option" v-for="option in types" v-if="type !== option" v-on:click="setType(option)">{{ option }}</div>
                    </div>
                </div>
                <div class="tab tabs__all" :class="{ selected: filter === 'все' }" v-on:click="setFilter('все')">все темы</div>
                <div class="tabs">
                    <div class="tab" v-for="tab in filters" :class="{ selected: filter === tab }" v-on:click="setFilter(tab)" :style="shiftedStyle">{{ tab }}</div>
                    <div v-if="shift !== 0" v-on:click="shiftRight" class="tabs__shift-icon left">${shiftFiltersIcon}</div>
                    <div v-if="shift < maxShift" v-on:click="shiftLeft" class="tabs__shift-icon right">${shiftFiltersIcon}</div>
                </div>
            </div>
            <div class="search">
                <input
                    placeholder="Введите свой запрос, например, гештальт"
                    v-model="search"
                    v-on:focus="focus"
                    v-on:blur="unfocus"
                    v-on:keydown="setSearch"
                ></input>
                ${searchIcon}
                <div class="search__results" v-if="isFocused">
                    <div class="search__result not-enough-letters" v-if="search.length < 3">Начните печатать для поиска</div>
                    <div class="search__result not-found" v-if="search.length >= 3 && relevantPosts.length === 0">По данному запросу не найдено публикаций</div>
                    <a v-for="(post, index) of relevantPosts" :href="post.link"><div class="search__result">{{ post.title }}</div></a>
                </div>
            </div>
        </div>
    `,
    computed: {
        maxShift: function() { return this.filters.length - 4; },
        shiftedStyle: function() { return `transform: translateX(${- this.shift * 100}%)` },
        relevantPosts: function() {
            return this.getRelevantPosts(this.search);
        },
        notFound: function() { return this.search.length >= 3 && this.relevantPosts.length === 0 },
    },
    methods: {
        toggleSelection: function() { this.isSelectionOpened = !this.isSelectionOpened; },
        setType: function(type) {
            this.setProperty('type', type);
            this.toggleSelection();
        },
        setFilter: function(filter) { this.setProperty('filter', filter); },
        shiftLeft: function() { this.shift = this.shift < this.maxShift - 1 ? this.shift + 1 : this.maxShift; },
        shiftRight: function() { this.shift = this.shift > 1 ? this.shift - 1 : 0; },
        focus: function() {
            clearTimeout(this.unfocusTimeout);
            this.isFocused = true;
        },
        unfocus: function() { this.unfocusTimeout = setTimeout(() => this.isFocused = false, 50); },
        setSearch: function(e) {
            if (e.key === 'Enter') {
                if (this.search.length >= 3) {
                    this.setProperty('search', this.search);
                }
            } else {
                this.setProperty('search', '');
            }
        },
    }
}

Vue.component('post', Post);
Vue.component('controls', Controls);
const blogApp = new Vue(Blog);