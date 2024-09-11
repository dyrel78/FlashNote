<template>
  <div>
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
export default {
  name: "CreateAccount",
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
        alert("Passwords do not match");
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
          alert(`Error: ${errorData.message || "Failed to create account"}`);
        } else {
          alert("Account created successfully");
          // Optionally, you can clear the form or redirect to a login page
          this.resetForm();
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
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
@import '../assets/brooke-style.css';
</style>

<!-- PREVIOUS CSS
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

</style> -->
