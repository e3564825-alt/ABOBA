<template>
  <v-dialog v-model="dialog" max-width="450" persistent>
    <v-card>
      <v-tabs v-model="tab" color="primary" density="compact" centered>
        <v-tab value="login">Войти</v-tab>
        <v-tab value="register">Зарегистрироваться</v-tab>
      </v-tabs>

      <v-card-text class="mt-4">
        <div v-if="tab === 'login'">
          <v-text-field
            v-model="loginEmail"
            label="Email"
            type="email"
            variant="outlined"
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model="loginPassword"
            label="Пароль"
            type="password"
            variant="outlined"
            hide-details="auto"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Отмена</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
          :loading="loading"
        >
          {{ tab === 'login' ? 'Войти' : 'Зарегистрироваться' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  inject: ['loginService', 'userService'],
  data() {
    return {
      dialog: false,
      tab: 'login',
      loading: false,
      loginEmail: '',
      loginPassword: '',
    };
  },
  methods: {
    open() {
      this.dialog = true;
      this.resetForms();
    },
    close() {
      this.dialog = false;
      this.resetForms();
    },
    resetForms() {
      this.tab = 'login';
      this.loginEmail = '';
      this.loginPassword = '';
    },
    async submit() {
      if (this.tab === 'login') {
        await this.handleLogin();
      }
    },
    async handleLogin() {
      if (!this.loginEmail || !this.loginPassword) {
        alert('Заполните email и пароль');
        return;
      }

      this.loading = true;
      try {
        const authRes = await this.loginService.authorizationUser(
          this.loginEmail,
          this.loginPassword
        );

        // Сохранение recordId пользователя в sessionStorage
        sessionStorage.setItem('userRecordId', authRes.userId);

        // Получение данных текущего пользователя
        const userData = await this.userService.getCurrentUser(authRes.userId);
        const fields = userData.fields;
        const fullName = `${fields.Surname || ''} ${fields.Name || ''} ${
          fields.Patronymic || ''
        }`.trim();

        sessionStorage.setItem('userName', fullName);
        this.$emit('login-success', { userName: fullName });
        this.close();
      } catch (error) {
        console.error(error);
        alert('Неверный email или пароль');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
