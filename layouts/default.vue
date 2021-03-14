<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top" sticky>
      <b-navbar-brand to="/">Book-Manager65</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text>六甲学院物理部蔵書管理システム</b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav class="mr-auto mx-3">
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/book">Book</b-nav-item>
          <b-nav-item v-if="this.$store.getters.isAuthenticated" to="/register"
            >Register</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav
          class="ml-auto"
          v-if="this.$store.getters.isAuthenticated"
        >
          <b-nav-item-dropdown right>
            <template #button-content>
              {{ $store.getters.user.email }}
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto" v-else>
          <b-nav-item to="/login">Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container my-3">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    signOut: function (err) {
      this.$store
        .dispatch("signOut")
        .then(() => {
          console.log("logout success");
          this.$router.push("/login");
        })
        .catch((err) => {
          alert(err.message);
        });
    },
  },
};
</script>

<style>
</style>
