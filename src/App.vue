<template>
  <v-app id="inspire">
    <v-navigation-drawer app clipped v-model="drawer"></v-navigation-drawer>
    <v-app-bar app clipped-left dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>WoT-STATS Reserve Manager</v-toolbar-title>
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
    drawer: true,
  }),
};
</script>
