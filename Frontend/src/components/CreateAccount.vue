<template>
  <div>
     <!-- Navbar -->
     <FlashnoteNavbar 
        :userExists="userExists" 
        :userObject="userObject" 
        @update:userExists="userExists = $event" 
        @update:userObject="userObject = $event" 
      />
    <h1>Create Account</h1>

    <!-- Form Container -->
    <form @submit.prevent="createAccount">
      <div>
        <!-- Username -->
        <label for="user-name">Username:</label>
        <input type="text" id="user-name" v-model="username" required />
      </div>
      <div>
        <!-- First Name -->
        <label for="first-name">First Name:</label>
        <input type="text" id="first-name" v-model="first_name" required />
      </div>
      <div>
        <!-- Last Name -->
        <label for="last-name">Last Name:</label>
        <input type="text" id="last-name" v-model="last_name" required />
      </div>
      <div>
        <!-- Email -->
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <!-- Password -->
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <!-- Confirm Password -->
        <label for="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirm_password"
          required
        />
      </div>
      <div>
        <!-- Create Account Button -->
        <button type="submit">Create Account</button>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from "sweetalert2"; // Import SweetAlert
import FlashnoteNavbar from './Navbar.vue';

export default {
  name: "CreateAccount",
  components: {
    
    FlashnoteNavbar  // Register FlashnoteNavbar component here
  },
  data() {
    return {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    };
  },
  methods: {
    async createAccount() {
      // Validate if passwords match
      if (this.password !== this.confirm_password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match",
        });
        return;
      }

      // Prepare user data object
      const userData = {
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
      };

      try {
        // Send POST request to register the user
        const response = await fetch(
          "http://localhost:8080/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        console.log("Response:", response);
        // Handle the response
        if (!response.ok) {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorData.message || "Failed to create account",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Account created successfully",
          });
          // Optionally, you can clear the form or redirect to a login page
          this.resetForm();
          this.$router.push("/sign-in");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    },
    resetForm() {
      this.username = "";
      this.first_name = "";
      this.last_name = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
    },
  },
};
</script>

<style>
@import "../assets/brooke-style.css";
</style>
