<template>
  <body id="app">
    <!-- Sidebar -->
    <div class="container">
      <div style= "position:fixed" class="sidebar">
        <div class="top">
          <div class="logo">
            <i class="bx bx-edit"></i>
            <span v-if="userExists">All Notes</span>
            <span v-else>Sign in to view notes</span>
          </div>
          <i class="bx bx-menu" id="btn"></i>
        </div>

        <!-- Dynamic folder list -->
        <ul v-if="userExists">
          <li v-for="folder in folders" :key="folder">
            <router-link :to="{ name: 'FolderPage', params: { id: folder } }">
              <i class="bx bx-folder"></i>
              <span class="nav-item">{{ folder }}</span>
            </router-link>
            <span class="tooltip">{{ folder }}</span>
          </li>
        </ul>
      </div>

      <!--NavBar-->
      <div class="flashnote-container main-content">
        <FlashnoteNavbar
          :userExists="userExists"
          :userObject="userObject"
          @update:userExists="userExists = $event"
          @update:userObject="userObject = $event"
        />
        <div class="help-container">
          <!--Main Content-->
          <h1>How to Use FlashNote</h1>

          <section class="introduction">
            <h2>Introduction</h2>
            <p>
              Welcome to FlashNote! This guide will help you get started with
              using our application to efficiently create and manage your notes
              and flashcards.
            </p>
          </section>

          <section class="steps">
            <h2>Getting Started</h2>
            <ol>
              <li>
                <h3>Create an Account</h3>
                <p>
                  Sign up for a new account by clicking the "Sign Up" button on
                  the homepage. Fill in your details and submit the form.
                </p>
              </li>
              <li>
                <h3>Log In</h3>
                <p>Log in to your account using your email and password.</p>
              </li>
              <li>
                <h3>Create a New Note</h3>
                <p>
                  On the homepage, you can create a new note by either copying
                  and pasting your content or uploading a document by clicking
                  "Upload PDF." Then, select the format for your note and click
                  the "Create Note" button to generate it.
                </p>
              </li>
              <li>
                <h3>Save Notes</h3>
                <p>
                  Once you're satisfied with your note, click the "Save Note"
                  button to save it. You can also organize your notes by
                  selecting a folder to store them in.
                </p>
              </li>
              <li>
                <h3>View Notes</h3>
                <p>
                  To view your notes, click on the desired folder. You can
                  access either your set of flashcards, which you can practice
                  using our interactive flashcard display system, or the full
                  note, with options to view, edit, or delete them.
                </p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import FlashnoteNavbar from "./Navbar.vue";
import axios from "axios";

export default {
  name: "helpPage",
  components: {
    FlashnoteNavbar, // Register FlashnoteNavbar component here
  },

  data() {
    return {
      userExists: false,
      userObject: null,
      folders: [], // This was missing in your code
    };
  },
  mounted() {
    this.sideBarMethods(); // Ensure sidebar functionality works
    this.checkUserInSession();
    this.fetchFolders(); // Ensure folders are fetched like on Home page
  },

  methods: {
    sideBarMethods() {
      let btn = document.querySelector("#btn");
      let sidebar = document.querySelector(".sidebar");
      btn.onclick = function () {
        sidebar.classList.toggle("active");
      };
    },

    checkUserInSession() {
      const user = sessionStorage.getItem("user");
      if (user) {
        this.userExists = true;
        this.userObject = JSON.parse(user);
      }
    },

    async fetchFolders() {
      if (!this.userExists) return;
      try {
        const user = this.userObject;
        const response = await axios.get(`http://3.217.34.111:8080/api/notes/folders/${user._id}`);
        this.folders = response.data;
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    },
  },
};
</script>
<style>
@import url(../assets/flashnote-styles.css);
</style>


<style scoped>
.help-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  color: #333;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

h1 {
  text-align: center;
  color: #6798c0;
  font-size: 32px;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 1px;
  margin-bottom: 25px;
  font-weight: 700;
}

h2 {
  color: #fdd85d;
  font-size: 26px;
  margin-bottom: 20px;
  font-weight: 600;
}

h3 {
  font-size: 22px;
  color: #444;
  text-align: center; /* Center the h3 */
  margin: 30px 0 15px; /* Ensure there's space above and below */
  font-weight: 500;
}

p {
  font-size: 17px;
  line-height: 1.75;
  color: #555;
  margin-bottom: 20px;
}

ol {
  list-style-type: none; /* Removes the numbers */
  padding-left: 0; /* Optional: remove padding if you want the list to align with the rest of the text */
}

li {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.8;
}

li::marker {
  color: #6798c0;
}

li::before {
  content: "";
  color: #6798c0;
  font-size: 18px;
  margin-right: 0px;
}

.introduction, .steps {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 25px;
  border: 1px solid #ddd;
}

li:hover {
  background-color: #f0f8ff;
  transition: background-color 0.3s ease;
}

</style>