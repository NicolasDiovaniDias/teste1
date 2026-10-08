import '@fontsource-variable/figtree'
import '@fontsource-variable/bricolage-grotesque'
import 'vue-sonner/style.css'
import './style.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // dados compartilhados entre as telas
app.use(router) // navegação entre as telas

app.mount('#app')
