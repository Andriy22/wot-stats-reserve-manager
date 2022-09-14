<template>
  <v-card
      max-width="80%"

      class="mx-auto ma-5"
  >
    <v-toolbar
        color="pink"
        dark
    >

      <v-toolbar-title>My clans</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon :disabled = "$store.state.connectedAccounts.length >= 3">
        <a class="text-decoration-none white--text" href="https://api.worldoftanks.ru/wot/auth/login/?application_id=d99a192537b0fad85704e195a4f6beb0&redirect_uri=https://reserves.wot-stats.fun/connect"><v-icon>mdi-plus</v-icon></a>
      </v-btn>

      <v-btn icon :loading="!canRefresh" @click="onRefresh">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list
        subheader
        two-line
    >
      <v-subheader inset>Connected</v-subheader>

      <v-list-item
          v-for="item in $store.state.connectedAccounts"
          :key="item?.clan"
      >
        <v-list-item-avatar>
          <v-img
              :src="item.icon"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <a :href="'https://ru.wargaming.net/clans/wot/' + item.id">


          <v-list-item-title  v-text="item?.clan"></v-list-item-title>
          </a>
          <v-list-item-subtitle v-text="item?.nick"></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon>
            <router-link class="text-decoration-none" :to="'/editor/' + item.id">
              <v-icon color="pink lighten-1">mdi-pencil</v-icon>
            </router-link>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "DashboardView",
  data: () => ({
    canRefresh: true,
  }),
  methods: {
    onRefresh() {
      this.$store.dispatch("getConnectedAccounts");

      this.canRefresh = false;

      setTimeout(() => {
        this.canRefresh = true;
      }, 5000)
    }
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("getConnectedAccounts");
    }, 0)

  }
}
</script>

<style scoped>

</style>
