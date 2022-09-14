<template>
  <v-app id="inspire">
    <v-navigation-drawer disable-resize-watcher app clipped v-model="drawer">
      <v-list dense>
        <router-link
            style="text-decoration: none; color: inherit"
            v-for="item in $store.state.connectedAccounts"
            :key="item.clan"
            :to="'/editor/'+item.id"

        >
          <v-list-item :key="item.id" link>
            <v-list-item-action>
              <v-icon>mdi-group</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.clan.split(' ')[0] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-divider></v-divider>

          <v-select
              label="Language"
              v-model="$i18n.locale"
              :item-color = "$store.state.colors.primary"
              :value="'EN'"
              :items="languages"
              :color="$store.state.colors.primary"
          ></v-select>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app clipped-left dense>
      <v-app-bar-nav-icon v-if="$store.state.auth.isAuthorized" @click="onNavIconClick"></v-app-bar-nav-icon>
      <v-toolbar-title style="cursor: pointer"> <router-link class="text-decoration-none black--text" v-bind:class="{'white--text': $vuetify.theme.dark}" to="/dashboard">WoT-STATS Reserve Manager</router-link> </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon
          color="white"
          dense
          style="cursor: pointer; margin-right: 15px"
          @click="$vuetify.theme.dark = false"
          v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
      <v-icon
          color="black"
          dense
          style="cursor: pointer; margin-right: 15px"
          @click="$vuetify.theme.dark = true"
          v-if="$vuetify.theme.dark === false">mdi-weather-night</v-icon>
      <v-icon
          dense
          style="cursor: pointer"
          @click="$store.dispatch('logOut')"
          v-if="$store.state.auth.isAuthorized">mdi-exit-to-app</v-icon>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    drawer: false,
    languages: ["EN", "UA"],
    themeCounter: 0,
  }),
  methods: {
    onNavIconClick() {
      if (this.$store.state.auth.isAuthorized) {
        this.drawer = !this.drawer
      }
    }
  },
  mounted() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      this.$store.dispatch("authorizeLS", auth);
    }
  },
};
</script>
