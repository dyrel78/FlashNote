<template>
  <div class="container">

<!-- Navbar -->
<FlashnoteNavbar 
        :userExists="userExists" 
        :userObject="userObject" 
        @update:userExists="userExists = $event" 
        @update:userObject="userObject = $event" 
      />


    <h1>Sign in</h1>
    <p>Log in by entering your email address and password.</p>
    <form @submit.prevent="signInUser">
      <!-- Email -->
      <div class="form-group">
        <label for="email">Email address:</label><br />
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="email@address.com"
          required
        /><br /><br />
      </div>
      <!-- Password -->
      <div class="form-group">
        <label for="password">Password:</label><br />
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Password"
          required
        /><br />
      </div>
      <!-- Login Button -->
      <div class="form-group">
        <button type="submit">Sign in</button><br /><br />
      </div>
    </form>
    <!-- link to Create Account Page -->
    <div class="signup-link">
      <p>Don't have an account? <a href="create-account">Sign up here</a></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import FlashnoteNavbar from './Navbar.vue';

export default {
  name: "SignIn",
  components: {
    FlashnoteNavbar  // Register FlashnoteNavbar component here
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async signInUser() {
      try {
        const endpoint = "http://3.217.34.111:8080/api/users/login";
        const response = await axios.post(endpoint, {
          email: this.email,
          password: this.password,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "You have logged in successfully!",
          });
          console.log(response.data);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
          // Redirect to the home page
          this.$router.push("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Login failed. Please try again.",
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Incorrect Password",
            text: "The password you entered is incorrect.",
          });
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "User Not Found",
            text: "No account found with this email address.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred. Please try again. " + error.message,
          });
        }
      }
    },
    resetForm() {
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style>
@import url(../assets/flashnote-styles.css);
</style>
