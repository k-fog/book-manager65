<template>
  <div>
    <b-card title="Login" style="max-width: 25rem" class="mx-auto">
      <b-form @submit="login">
        <b-form-group label="EMail">
          <b-form-input
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password">
          <b-form-input
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            required
          ></b-form-input>
        </b-form-group>

        <b-alert :show="!this.valid" variant="danger"
          >MailAddress or Password is incorrect.</b-alert
        >

        <b-button class="float-right" type="submit" variant="primary"
          >Login</b-button
        >
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
  data: function () {
    return {
      form: {
        email: "",
        password: "",
      },
      valid: true,
    };
  },
  methods: {
    login: function (event) {
      event.preventDefault();
      this.valid = true;
      this.$store
        .dispatch("signIn", {
          email: this.form.email,
          password: this.form.password,
        })
        .then((user) => {
          console.log("login success!");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("login failed:" + error);
          this.valid = false;
        });
    },
  },
};
</script>

<style>
</style>