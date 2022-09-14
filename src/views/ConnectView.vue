<template>
    <div class="d-flex justify-center  fill-height" style="position: relative;">

      <p class="vertical-text">{{$store.state.connector.text}}</p>
      <v-btn @click="$router.push('/dashboard')" class="vertical-redirect-text" v-if="$store.state.connector.isBackBTNActive">Back to dashboard</v-btn>
      <v-avatar
          :color="$store.state.connector.color"
          size="128"
          class="vertical-loader"
          v-if="!$store.state.connector.isLoading"
      >
      <v-icon size="90">{{$store.state.connector.icon}}</v-icon>
      </v-avatar>

      <v-progress-circular
          :size="128"
          :width="7"
          :color="$store.state.colors.primary"
          indeterminate
          class="vertical-loader"
          v-if="$store.state.connector.isLoading"
      ></v-progress-circular>
    </div>
</template>

<script>
export default {
  name: "ConnectView.vue",
  mounted() {
    this.$store.dispatch("getConnectedAccounts");

    var uri = new URL(window.location.href);

    const status = uri.searchParams.get("status");
    const access_token = uri.searchParams.get("access_token");
    const nickname = uri.searchParams.get("nickname");
    const account_id = uri.searchParams.get("account_id");

    this.$store.dispatch("connectWGAccount", {status,access_token,nickname,account_id});

  }
}
</script>

<style scoped>
.vertical-loader {
  margin: 0;
  position: absolute;
  top: 40%;
  -ms-transform: translateY(-40%);
  transform: translateY(-40%);
}
.vertical-text {
  margin: 0;
  position: absolute;
  top: 55%;
  -ms-transform: translateY(-55%);
  transform: translateY(-55%);
  font-size: 20px;
}

.vertical-redirect-text {
  margin: 0;
  position: absolute;
  top: 61%;
  -ms-transform: translateY(-61%);
  transform: translateY(-61%);
}
</style>
