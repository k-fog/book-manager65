<template>
  <section class="container">
    <h1 class="h1">Hello</h1>
    <p>welcome to book-manager65!</p>
    <b-button
      :disabled="!this.$store.getters.isAuthenticated"
      variant="primary"
      to="/register"
      >Register</b-button
    >
    <b-button
      :disabled="!this.$store.getters.isAuthenticated"
      variant="primary"
      @click="signOut"
      >Sign Out</b-button
    >

    <p class="my-3">
      number of registered books : {{ this.$store.getters.booklistLength }}
    </p>
  </section>
</template>

<script>
import { booklist } from "~/plugins/firebase.js";
export default {
  methods: {
    signOut: function (err) {
      this.$store
        .dispatch("signOut")
        .then(() => {
          console.log("logout success");
          this.$router.push("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    },
  },
  asyncData: async function ({ store }) {
    store.dispatch("getBooklistLength");
  },
};
</script>

<style lang="scss">
</style>
