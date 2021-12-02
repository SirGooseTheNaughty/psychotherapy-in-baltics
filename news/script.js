async function fetchEvents() {
    let posts = [];
    await fetch("https://feeds.tildacdn.com/api/getfeed/?feeduid=763632368591&size=&slice=1&sort%5Bdate%5D=desc&filters%5Bdate%5D=&getparts=true")
        .then(res => res.json())
        .then(res => {
            posts = res.posts.map(post => {
                const [ date, time ] = post.date.split(' ');
                return {
                    title: post.title,
                    description: post.descr,
                    date,
                    time,
                    link: post.url,
                };
            });
            return res;
        })
        .catch(console.log);
    return posts;
}

const Feed = {
    data() {
        return {
            posts: [],
            amount: 3,
            filters: [],
        }
    },
    template: `
        <post v-for="post in posts" :data="post" :key="post.data"></post>
    `,
    async created() {
        this.posts = await this.getPosts();
    },
    methods: {
        getPosts: async function() {
            const posts = await fetchEvents();
            return posts.length ? posts : mockedPosts;
        }
    }
};

const Post = {
    props: ['data'],
    template: `
        <div class="post">
            <div class="datetime">
                <p class="date">{{ data.date }}</p>
                <p class="time">{{ data.time === '00:00' ? '' : data.time }}</p>
            </div>
            <div class="content">
                <h3 class="title">{{ data.title }}</h3>
                <p class="description">{{ data.description }}</p>
            </div>
            <div class="seemore">
                <a :href="data.link">Подробнее</a>
                <svg width="23" height="12" viewBox="0 0 23 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6L22 6" stroke="#F0EFEC"/>
                    <path d="M22 6C19.632 5.92361 14.8959 4.71667 14.8959 0.5" stroke="#F0EFEC"/>
                    <path d="M22 6C19.632 6.07639 14.8959 7.28333 14.8959 11.5" stroke="#F0EFEC"/>
                </svg>
            </div>
        </div>
    `,
};

const app = Vue.createApp(Feed);
app.component('post', Post);
app.mount('#feed');