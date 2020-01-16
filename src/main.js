import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueRx from 'vue-rx';
import vuetify from './plugins/vuetify';

import { initDB, IndexedDBPlugin } from './services/database';
import { TodoServicePlugin } from './services/todo';
import { ArticleServicePlugin } from './services/article';
import http from './plugins/axios';
import './registerServiceWorker'

Vue.use(VueRx);

Vue.config.productionTip = false;

(async () => {
  const database = await initDB();

  Vue.use(IndexedDBPlugin, { database })
  Vue.use(TodoServicePlugin, { database, http })
  Vue.use(ArticleServicePlugin, { database, http })

  new Vue({
    router,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
})();
