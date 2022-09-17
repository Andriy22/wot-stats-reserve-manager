/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueI18n from 'vue-i18n'
import {messages} from "@/i18n/messages";
import setupInterceptors from "@/services/setupInterceptors";

Vue.config.productionTip = false;

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'EN',
  messages: messages
})

setupInterceptors(store);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
