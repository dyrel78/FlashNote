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
          <input type="text" id="username" v-model="username" required />
        </div>
  
        <div class="form-group">
          <label for="first-name">First Name:</label>
          <input type="text" id="first-name" v-model="firstName" required />
        </div>
  
        <div class="form-group">
          <label for="last-name">Last Name:</label>
          <input type="text" id="last-name" v-model="lastName" required />
        </div>
  
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
  
        <div class="form-group">
          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  </template>

<script>
  import FlashnoteNavbar from './Navbar.vue';
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
    };
  },
  methods: {
    // Function to handle file change for profile picture
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = URL.createObjectURL(file);
      }
    },

    // Function to update the profile (Placeholder)
    updateProfile() {
      // send  data to backend to update the profile.
      alert("Profile updated successfully!");
      console.log({
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        profilePicture: this.profilePicture,
      });
    },
  },
};
</script>