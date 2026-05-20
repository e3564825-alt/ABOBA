import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';

import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import LoginService from './src/plugins/api/services/LoginService.js';
import UserService from './src/plugins/api/services/UserService.js';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);

app.provide('loginService', LoginService);
app.provide('userService', UserService);

app.use(vuetify);
app.use(router);
app.mount('#app');
