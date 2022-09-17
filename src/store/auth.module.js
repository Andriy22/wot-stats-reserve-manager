import AuthService from '../services/auth.service';
import router from "@/router";

const user = JSON.parse(localStorage.getItem('auth'));

const initialState = user
    ? { status: { loggedIn: true, isLoading: false, }, user }
    : { status: { loggedIn: false, isLoading: false, }, user: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit, dispatch }, data) {
            commit('startLoading');
            return AuthService.login(data).then(
                user => {
                    commit('loginSuccess', user);
                    commit('stopLoading');
                    return Promise.resolve(user);
                },
                error => {
                    dispatch("error/displayError", {text: (error)?.response?.data['msg']}, {root:true});
                    commit('loginFailure');
                    commit('stopLoading');
                    return Promise.reject(error);
                }
            );
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },
        refreshToken({ commit }, user) {
            commit('refreshToken', user);
        }
    },
    mutations: {
        loginSuccess(state, user ) {
            state.status.loggedIn = true;
            state.user = user;
            router.push("/dashboard");
        },

        startLoading(state) {
            state.status.isLoading = true;
        },

        stopLoading(state) {
            state.status.isLoading = false;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
            router.push("/login");
        },
        refreshToken(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        }
    }
};
