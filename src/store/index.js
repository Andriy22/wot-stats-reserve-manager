import Vue from "vue";
import Vuex from "vuex";
import axios, { AxiosError } from "axios";
import {API} from "@/config";
import Router from "@/router/index"
import router from "@/router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    colors: {
      primary: "pink",
    },
    auth: {
      user: {
        access_token: "",
        refresh_token: "",
        user_id: "",
        email: "",
      },
      isAuthorized: false,
      isLoading: false,
    },
    connector: {
      icon: "mdi-close",
      text: "Oops, we couldn't detect your Wargaming account...",
      isLoading: false,
      isBackBTNActive: false,
      color: "pink",
      response: {
        access_token: "",
        account_id: "",
        nickname: "",
        status: "",
      }
    },
    clanReserves: {
      list: [],
      isLoading: false,
      currentClanId: 0,
      currentDay: 0,
      levels: [],
      timeZone: 0,
    },

    connectedAccounts: [],
  },
  getters: {},
  mutations: {
    AUTHORIZE(state, data) {
      state.auth.isAuthorized = true;
      state.auth.isLoading = false;

      const {userName, userId, token, refreshToken} = data;

      state.auth.user.email = userName;
      state.auth.user.user_id = userId;
      state.auth.user.access_token = token;
      state.auth.user.refresh_token = refreshToken;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      localStorage.setItem("auth", JSON.stringify(data));

      if (!data.isLS) {
        Router.push("/dashboard");
      }

    },

    START_AUTH_LOADING(state) {
      state.auth.isLoading = true;
    },

    STOP_AUTH_LOADING(state) {
      state.auth.isLoading = false;
    },

    LOGOUT(state) {
      state.auth.isAuthorized = false;
      state.auth.user = {};

      state.connectedAccounts = [];

      localStorage.removeItem("auth");

      Router.push("/login");
    },

    SAVE_CONNECTED_ACCOUNTS(state, data) {
      state.connectedAccounts = data;
    },

    SAVE_CLAN_SCHEDULE(state, data) {
      state.clanReserves.list = data;
    },

    SAVE_RESERVE_LEVELS(state, data) {
      state.clanReserves.levels = data;
    },

    SAVE_SCHEDULE_INFO(state, data) {
      state.clanReserves.currentClanId = data.clanId;
      state.clanReserves.currentDay = data.day;
    },

    SET_TIME_ZONE(state, data) {
      state.clanReserves.timeZone = data;
    },

    SAVE_CLAN_SCHEDULE_LOADING(state, data) {
      state.clanReserves.isLoading = data
    },

    CONNECT_WG_ACCOUNT_ERROR(state, data) {
      setTimeout(() => {
        state.connector.isLoading = false;
        state.connector.icon = "mdi-close";

        if (data) {
          state.connector.text = data;
        } else {
          state.connector.text = "OOps, something went wrong!";
        }

        state.connector.response = {};
        state.connector.color = state.colors.primary;
        state.connector.isBackBTNActive = true;
      }, 5000)
    },

    CONNECT_WG_ACCOUNT_SUCCESS(state) {
      setTimeout(() => {
        state.connector.isLoading = false;
        state.connector.icon = "mdi-check";

        state.connector.text = "Congratulations, we have successfully added your account!";

        state.connector.response = {};
        state.connector.color = "green";
        state.connector.isBackBTNActive = true;
      }, 5000)
    },

    CONNECT_WG_ACCOUNT(state, data) {
      state.connector.isBackBTNActive = false;

      if (data.status==="ok" && data.access_token) {
        state.connector.text= "We detect your Wargaming account! Please wait..."
        state.connector.isLoading = true;
        state.connector.response = data;
        state.connector.color = state.colors.primary;
        return;
      }

      if (data.status !== "ok") {
        state.connector.isLoading = false;
        state.connector.icon = "mdi-close";
        state.connector.text = "Something went wrong... WG OpenID returned an error!"
        state.connector.response = data;
        state.connector.color = state.colors.primary;
        state.connector.isBackBTNActive = true;
        return;
      }
    }
  },
  actions: {
    authorize(context, data) {
      context.commit("START_AUTH_LOADING");

      axios.post(`${API}/auth/authorize`, {email: data.email, password: data.password})
          .then((response) => response.data)
          .then((d) => {

            d.isLS = false;

            context.commit("AUTHORIZE", d)
          }).catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log(err);
          // todo
          // display message

          context.commit("STOP_AUTH_LOADING");
        } else {
          console.log("123");

          context.commit("STOP_AUTH_LOADING");
        }
      });
    },

    authorizeLS(context, data) {
      data.isLS = true;

      context.commit("AUTHORIZE", data)
    },

    logOut(context) {
      context.commit("LOGOUT");
    },

    connectWGAccount(context, data) {
      context.commit("CONNECT_WG_ACCOUNT",data);

      setTimeout(() => {
        axios.post(`${API}/reservemanager/connect-account`,
            {token: context.state.connector.response.access_token,
                  accountId: context.state.connector.response.account_id,
                  nickName: context.state.connector.response.nickname,
                  server: "CIS"
                 }, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.commit("CONNECT_WG_ACCOUNT_SUCCESS")
            }).catch((err) => {
              if (axios.isAxiosError(err)) {
                context.commit("CONNECT_WG_ACCOUNT_ERROR", err?.response?.data?.msg)
              }
        })
      }, );
    },

    addReserveSchedule(context, data) {
      setTimeout(() => {
        axios.post(`${API}/reservemanager/add-schedule-item`,
            {clanId: context.state.clanReserves.currentClanId,
                  day: context.state.clanReserves.currentDay,
                  reserveType: data.reserveType,
                  reserveLevel: data.reserveLevel,
                  activateAt: data.activateAt}, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.dispatch("getClanSchedule", {clanId: context.state.clanReserves.currentClanId, day: context.state.clanReserves.currentDay});
            }).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log(err);
          }
        })
      }, 0);
    },

    getConnectedAccounts(context){
      setTimeout(() =>{
      axios.get(`${API}/reservemanager/get-my-accounts`, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
          .then((response) => response.data)
          .then((data) => {
             context.commit("SAVE_CONNECTED_ACCOUNTS", data);
          }).catch((err) => {
        if (axios.isAxiosError(err)) {
            console.log(err);
        } else {
          console.log("123");
        }
      })
      }, 0)
    },

    getReserveLevels(context, data){
      setTimeout(() =>{
        axios.get(`${API}/reservemanager/get-reserve-levels/${data}`, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.commit("SAVE_RESERVE_LEVELS", data);
            }).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log(err);
          } else {
            console.log("123");
          }
        })
      }, 0)
    },

    getClanTimezone(context, data){
      setTimeout(() =>{
        axios.get(`${API}/reservemanager/get-clan-timezone/${data}`, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.commit("SET_TIME_ZONE", data);
            }).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log(err);
          } else {
            console.log("123");
          }
        })
      }, 0)
    },

    setClanTimezone(context, model){
      setTimeout(() =>{
        axios.get(`${API}/reservemanager/set-clan-timezone/${model.clanId}/${model.timezone}`, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.dispatch("getClanTimezone", model.clanId);
            }).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log(err);
          } else {
            console.log("123");
          }
        })
      }, 0)
    },

    getClanSchedule(context, data){
      context.commit("SAVE_CLAN_SCHEDULE_LOADING", true);
      context.commit("SAVE_SCHEDULE_INFO", data);
      setTimeout(() => {
        axios.get(`${API}/reservemanager/get-clan-schedule/${context.state.clanReserves.currentClanId}/${context.state.clanReserves.currentDay}`, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.commit("SAVE_CLAN_SCHEDULE", data);
              context.commit("SAVE_CLAN_SCHEDULE_LOADING", false);
            }).catch((err) => {
          if (axios.isAxiosError(err)) {
            router.push("/dashboard");
            context.commit("SAVE_CLAN_SCHEDULE_LOADING", false);
          } else {
            context.commit("SAVE_CLAN_SCHEDULE_LOADING", false);
          }
        });
      }, 0);
    },

    removeClanReserveItem(context, data) {
      setTimeout(() => {
        axios.get(`${API}/reservemanager/remove-schedule-item/${data.clanId}/${data.id}`, {headers: {Authorization: `Bearer ${context.state.auth.user.access_token}`}})
            .then((response) => response.data)
            .then((data) => {
              context.dispatch("getClanSchedule", {clanId: context.state.clanReserves.currentClanId, day: context.state.clanReserves.currentDay});
            }).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log(err);
          } else {
            console.log(err);
          }
        });
      }, 0);
    },
  },
  modules: {},
});
