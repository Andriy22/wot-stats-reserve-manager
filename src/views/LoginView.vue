<template>
  <v-main>
    <v-col class="d-flex justify-center align-center" >
        <v-form @submit="submitHandler" style="width: 600px" >
            <v-text-field
                v-model="email"
                :rules="emailRules"
                type="email"
                label="Email"
                placeholder="Email"
                prepend-inner-icon="mdi-account"
                required
                :color="$store.state.colors.primary"
            />
            <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="passwordShow?'text':'password'"
                label="Password"
                placeholder="Password"
                prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow"
                required
                :color="$store.state.colors.primary"
            />
          <v-card-actions class="justify-start">
            <v-btn :loading="$store.state.auth.isLoading" type="submit" :color="$store.state.colors.primary">
              <span class="white--text px-8">Login</span>
            </v-btn>
          </v-card-actions>
        </v-form>
    </v-col>
  </v-main>
</template>

<script>
import HelloWorld from "../components/HelloWorld";

export default {
  name: "LoginView",
  data: () => ({
    passwordShow:false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be 6  characters or more!',
    ],
  }),
  methods:{
    submitHandler(event){
      event.preventDefault()

      this.$store.dispatch("authorize", {email: this.email, password: this.password});
    }
  },

  components: {
    HelloWorld,
  },
};
</script>
