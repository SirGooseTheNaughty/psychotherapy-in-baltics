const Stream = {
    data() {
        return {
            items: [],
            limit: null,
            filters: [],
            category: '',
            lang: translator.lang,
            loc: '',
            ids: streamIds,
            order: 'desc',
        }
    },
    async created() {
        this.items = await this.getItems();
        translator.subscribers.push(this);
    },
    watch: {
        lang: async function() {
            this.items = await this.getItems();
        },
    },
    computed: {
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
        },
    },
    methods: {
        getItems: async function() {
            let items = [];
            await fetch(this.fetchLink)
                .then(res => res.json())
                .then(res => items = res)
                .catch(console.log);
            return items;
        },
        setProperty: function(key, property) {
            this[key] = property;
        },
        getProperty: function(key) {
            return this[key];
        },
    }
}