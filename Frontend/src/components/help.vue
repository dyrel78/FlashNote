<template>
  <body id="app">
    <!-- Sidebar -->
    <div class="container">
      <div class="sidebar">
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
