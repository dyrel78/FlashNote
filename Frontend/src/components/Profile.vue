<template>
    <div class="profile-container">

       <!-- Navbar -->
       <FlashnoteNavbar 
        :userExists="userExists" 
        :userObject="userObject" 
        @update:userExists="userExists = $event" 
        @update:userObject="userObject = $event" 
      />
      <h1>My Profile</h1>
      <br>
  
      <!-- Profile Picture Section -->
      <div class="profile-picture-section">
        <div class="profile-picture">
          <img :src="profilePicture" alt="Profile Picture" />
        </div>
        <label for="profile-picture">Profile Picture:</label>
        <input type="file" id="profile-picture" accept="image/*" @change="onFileChange" />
      </div>
  
      <!-- Profile Information Form -->
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" :placeholder="username" required />
        </div>
  
        <div class="form-group">
          <label for="first-name">First Name:</label>
          <input type="text" id="first-name" v-model="firstName" :placeholder="firstName" required />
        </div>
  
        <div class="form-group">
          <label for="last-name">Last Name:</label>
          <input type="text" id="last-name" v-model="lastName" :placeholder="lastName" required />
        </div>
  
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="this.email" :placeholder="this.email" required />
        </div>
  
        <div class="form-group">
          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  </template>

<script>
  import FlashnoteNavbar from './Navbar.vue';
  import axios from "axios";
  import Swal from "sweetalert2";
export default {
  name: "ProfilePage",
  components: {
    FlashnoteNavbar  // Register FlashnoteNavbar component here
  },
  data() {
    return {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "https://via.placeholder.com/150",
      userObject: "",
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    // Function to handle file change for profile picture
    async getUser() {
      try {
        this.userObject = JSON.parse(sessionStorage.getItem("user"));
        this.username = this.userObject.username;
        this.firstName = this.userObject.first_name;
        this.lastName = this.userObject.last_name;
        this.email = this.userObject.email;
        // this.profilePicture = this.userObject.profilePicture;
      } catch (error) {
        console.error(error);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = URL.createObjectURL(file);
      }
    },

    // Function to update the profile (Placeholder)
   async updateProfile() {
      // send  data to backend to update the profile.
      try {
        const response = await axios.put(`http://localhost:8080/api/users/username/${this.username}`, {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,

        });
        console.log(response.data);
        //Overwrite session storage with new user object
        sessionStorage.setItem("user", JSON.stringify(response.data));

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Profile updated successfully",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong!",
        });
      }
    },
  },
};
</script>

<style>
@import url(../assets/flashnote-styles.css);
</style>