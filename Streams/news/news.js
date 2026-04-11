const Feed = {
    el: '#feed',
    data() {
        return {
            items: [],
            limit: 6,
            filters: [],
            category: 'events',
            lang: localizator.locale || 'ru',
            loc: '',
            ids: streamIds,
            order: 'asc',
        }
    },
    template: `
        <div id="feed">
            <div class="content">
                <post v-for="post in currentItems" :data="post" :key="post.data"></post>
            </div>
        </div>
    `,
    watch: {
        lang: async function() {
            await this.getItems();
        },
    },
    async created() {
        this.getItems();
    },
    computed: {
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
            if (this.limit) {
                currentItems = currentItems.slice(0, this.limit);
            }
            return currentItems;
        },
    },
    methods: {
        fetchLink: function(slice = 1) {
            const rootId = this.ids[this.category].root;
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}&size=100&slice=${slice}&sort%5Bdate%5D=${this.order}`;
        },
        getItems: async function() {
            // this.items = mockedEvents;
            try {
                let allPosts = [];
                let slice = 1;
                let total = Infinity;
                while (allPosts.length < total) {
                    const res = await fetch(this.fetchLink(slice)).then(r => r.json());
                    allPosts = allPosts.concat(this.preformItems(res));
                    total = res.total;
                    if (!res.nextslice || allPosts.length >= total) break;
                    slice = res.nextslice;
                }
                this.items = allPosts;
            } catch (e) {
                console.log(e);
            }
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
    }
}

const Post = {
    props: ['data'],
    // <a :href="data.link"></a>
    template: `
        <div class="post">
            <div class="post__datetime">
                <p class="date">{{ date }}</p>
                <p class="time">{{ data.time === '00:00' ? '' : data.time }}</p>
            </div>
            <div class="post__content">
                <h3 class="title" v-html="data.title"></h3>
                <p class="description" v-html="data.description"></p>
            </div>
            <div class="post__seemore">
                <a :href="data.link">{{ localizator.getTranslation(['more']) }}</a>
                <svg width="23" height="12" viewBox="0 0 23 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6L22 6" stroke="#F0EFEC"/>
                    <path d="M22 6C19.632 5.92361 14.8959 4.71667 14.8959 0.5" stroke="#F0EFEC"/>
                    <path d="M22 6C19.632 6.07639 14.8959 7.28333 14.8959 11.5" stroke="#F0EFEC"/>
                </svg>
            </div>
        </div>
    `,
    computed: {
        date: function() {
            try {
                const { day, month, year } = this.data;
                if (this.lang === 'en') {
                    return `${month}.${day}.${year}`;
                }
                return `${day}.${month}.${year}`;
            } catch(e) {
                console.warn(e);
                return this.data.date;
            }
        },
    }
};

Vue.component('post', Post);
const feedApp = new Vue(Feed);