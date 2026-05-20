<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>

    <v-icon icon="mdi-bullhorn" class="ml-2 mr-2"></v-icon>

    <v-app-bar-title
      class="text-h6 font-weight-bold"
      style="min-width: max-content"
    >
      Новости
    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-text-field
      density="compact"
      variant="outlined"
      label="Поиск документа"
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      class="custom-search mr-4"
      style="max-width: 400px"
    ></v-text-field>

    <!-- Если авторизован - показываем имя, если нет - кнопку Войти -->
    <div
      v-if="isLoggedIn"
      class="mr-2 text-body-2 font-weight-medium"
      style="min-width: max-content"
    >
      {{ userName }}
    </div>
    <v-btn v-else variant="text" @click="openLoginDialog" class="mr-2">
      Войти
    </v-btn>

    <v-btn icon="mdi-menu-down" variant="text" size="small"></v-btn>

    <LoginDialog ref="loginDialog" @login-success="onLoginSuccess" />
  </v-app-bar>
</template>

<script>
import LoginDialog from './LoginDialog.vue';

export default {
  name: 'Navbar',
  components: { LoginDialog },
  inject: ['userService'],
  emits: ['toggle-drawer'],
  data() {
    return {
      isLoggedIn: false,
      userName: 'Гладышева К.Н.', // Значение по умолчанию
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    openLoginDialog() {
      this.$refs.loginDialog.open();
    },
    onLoginSuccess() {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userName') || 'Гладышева К.Н.';
    },
    logout() {
      sessionStorage.removeItem('userRecordId');
      sessionStorage.removeItem('userName');
      this.isLoggedIn = false;
      this.userName = 'Гладышева К.Н.';
    },
    async checkAuth() {
      const recordId = sessionStorage.getItem('userRecordId');
      if (recordId) {
        const storedName = sessionStorage.getItem('userName');
        if (storedName) {
          this.isLoggedIn = true;
          this.userName = storedName;
        } else {
          try {
            const userData = await this.userService.getCurrentUser(recordId);
            const fields = userData.fields;
            const fullName = `${fields.Surname || ''} ${fields.Name || ''} ${
              fields.Patronymic || ''
            }`.trim();
            sessionStorage.setItem('userName', fullName);
            this.userName = fullName;
            this.isLoggedIn = true;
          } catch (err) {
            sessionStorage.removeItem('userRecordId');
            console.error(err);
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.custom-search :deep(.v-field) {
  background-color: #1976d2 !important;
  border: 1px solid white !important;
  border-radius: 4px;
}
.custom-search :deep(.v-field__input) {
  color: white !important;
}
.custom-search :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}
.custom-search :deep(.v-icon) {
  color: white !important;
}
</style>
