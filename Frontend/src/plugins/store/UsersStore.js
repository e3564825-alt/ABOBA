import UserService from '../api/services/UsersService.js';

const userModule = {
  namespaced: true,
  state: {
    currentUser: {},
  },
  getters: {
    currentUser: (state) => {
      return state.currentUser;
    },
  },
  mutations: {
    SET_CURRENT_USER(state, payload) {
      state.currentUser = payload;
      if (state.currentUser.lastName && state.currentUser.name) {
        state.currentUser.fullShortName =
          state.currentUser.lastName +
          ' ' +
          state.currentUser.name[0] +
          '.' +
          (state.currentUser.secondName?.[0] || '') +
          '.';
      }
    },
  },
  actions: {
    async INIT_CURRENT_USER({ commit }, userId) {
      await UserService.getUserById(userId)
        .then((response) => {
          commit('SET_CURRENT_USER', response);
        })
        .catch((error) => {
          console.error(error);
          alert('Ошибка авторизации');
        });
    },
    async INIT_AUTORIZATION({ commit, dispatch }, usersInfo) {
      await UserService.authorizationUser(usersInfo.login, usersInfo.password)
        .then((response) => {
          alert(response.message);
          localStorage.setItem('currentUser', JSON.stringify(response.user.id));
          dispatch('INIT_CURRENT_USER', response.user.id);
        })
        .catch((error) => {
          console.error(error);
          alert('Ошибка авторизации');
        });
    },
    async INIT_REGISTRATION({ commit }, payload) {
      await UserService.createUser(payload)
        .then((response) => {
          console.log(response);
          localStorage.setItem('currentUser', JSON.stringify(response.id));
          commit('SET_CURRENT_USER', response);
        })
        .catch((error) => {
          console.error(error);
          alert('Ошибка регистрации');
        });
    },
    async INIT_LOGOUT({ commit }) {
      localStorage.removeItem('currentUser');
      commit('SET_CURRENT_USER', {});
    },
  },
};

export default userModule;
