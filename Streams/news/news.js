const Feed = {
    el: '#feed',
    data() {
        return {
            items: [],
            limit: 3,
            filters: [],
            category: 'events',
            lang: localizator.locale || 'ru',
            loc: '',
            ids: streamIds,
            order: 'desc',
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
        fetchLink: function() {
            const rootId = this.ids[this.category].root;
            return `https://feeds.tildacdn.com/api/getfeed/?feeduid=${rootId}&size=&slice=1&sort%5Bdate%5D=${this.order}`;
        }
    },
    methods: {
        getItems: async function() {
            // this.items = mockedEvents;
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
                    <h3 class="title" v-html="data.title"></h3>
                    <p class="description" v-html="data.description"></p>
                </div>
                <div class="post__seemore">
                    <a :href="data.link">{{ seeMoreText }}</a>
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
                const month = localizator.getTranslation(['months', this.data.month]);
                return month ? `${day} ${month}, ${this.data.year}` : this.data.date;
            } catch(e) {
                console.warn(e);
                return this.data.date;
            }
        },
        seeMoreText: function() {
            return localizator.getTranslation(['more']);
        }
    }
};

Vue.component('post', Post);
const feedApp = new Vue(Feed);