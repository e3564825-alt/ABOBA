<template>
  <v-app>
    <Navbar @toggle-drawer="drawer = !drawer" />
    <Sidebar v-model="drawer" />
    <v-main class="bg-grey-lighten-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/UI/Navbar.vue';
import Sidebar from './components/UI/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar,
  },
  data: () => ({
    drawer: localStorage.getItem('sidebarStatus') !== 'false',
  }),
  watch: {
    drawer(val) {
      localStorage.setItem('sidebarStatus', val);
    },
  },
};
</script>
