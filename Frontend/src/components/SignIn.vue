<template>
  <div class="container">
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
        <a href="#">Forgot password?</a><br /><br />
      </div>
      <!-- Login Button -->
      <div class="form-group">
        <button type="submit">Log in</button><br /><br />
      </div>
      <div class="form-group">
        <input type="checkbox" id="remember" name="remember" />
        <label for="remember">Remember me</label><br /><br />
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

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async signInUser() {
      try {
        const endpoint = "http://localhost:8080/api/users/login";
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
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.noteable-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.noteable-navbar {
  background-color: #333;
  color: white;
  padding: 1rem;
}

.noteable-navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
}

.noteable-navbar ul li {
  display: inline;
}

.noteable-navbar ul li a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.noteable-main-content {
  display: flex;
  flex: 1;
}

.noteable-left-column {
  width: 20%;
  background-color: #e8e8e8;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.noteable-folders h2 {
  font-size: 1.5rem;
}

.noteable-add-folder {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem;
  margin: 1rem 0;
  cursor: pointer;
  width: 100%;
}

.noteable-folders ul {
  list-style-type: none;
  padding: 0;
}

.noteable-folders ul li {
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.noteable-folders ul li a {
  text-decoration: none;
  color: #333;
}

.noteable-right-column {
  flex: 1;
  background-color: white;
  padding: 2rem;
}

.noteable-note-area {
  display: flex;
  flex-direction: column;
}

.noteable-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.noteable-tabs button {
  flex: 1;
  padding: 0.5rem;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  cursor: pointer;
}

.noteable-note-input,
.noteable-note-output {
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
  background-color: #f8f8f8;
}

.noteable-note-input textarea {
  width: 100%;
  height: 100px;
  border: none;
  padding: 1rem;
  resize: none;
}

.noteable-upload-pdf,
.noteable-create-note,
.noteable-save-note {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

.noteable-save-note {
  align-self: flex-end;
}
</style>
