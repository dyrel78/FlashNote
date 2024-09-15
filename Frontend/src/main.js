import { createApp } from 'vue'
import App from './App.vue'
import HomePage from './components/HomePage.vue'
import CreateAccount from './components/CreateAccount.vue'
import SignIn from './components/SignIn.vue'
import ViewNotesPreview from './components/ViewNotesPreview.vue'
import { createRouter, createWebHistory } from 'vue-router'

// import "/css/flashnote-styles.css"
// import "./assets/flashnote-styles.css"
import "./assets/noteable-styles.css"
import "./assets/will-style.css"
// import "./assets/zara-style.css"

const routes = [
    {pathe: '/', component: HomePage},
    { path: '/home', component: HomePage },
    { path: '/create-account', component: CreateAccount },
    {path:'/sign-in', component: SignIn},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
const app = createApp(App)
app.use(router)
app.mount('#app')
// createApp(App).mount('#app')


