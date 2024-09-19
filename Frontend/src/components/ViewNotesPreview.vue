<template>
    <div v-if="userExists">
      <body id="view-notes-preview">
        <div class="flashnote-container">
          <!-- Navbar -->
          <nav class="flashnote-navbar">
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="#">Notes Folders</a></li>
              <li><a href="/view-notes-preview">Notes</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="#">Sign Out</a></li>
              <li v-if="userExists">
                <a @click="handleSignInOut">Sign Out</a>
              </li>
            </ul>
          </nav>
  
          <!-- Main content -->
          <div class="flashnote-main-content">
            <!-- Left Column for Folders -->
            <div class="flashnote-left-column">
              <div class="flashnote-folders">
                <h2>My Notes</h2>
                <ul>
                  <li v-for="folderTitle in folders" :key="folderTitle.note_name">
                    <a href="#">{{ folderTitle }}</a>
                    <!-- <span class="flashnote-date">{{ note.date }}</span> -->
                  </li>
                </ul>
              </div>
            </div>
  
            <!-- Right Column for Expanded Note Output -->
            <div class="flashnote-right-column">
              <div class="flashnote-note-area">
                <h1>View Notes Preview</h1> <!-- Page title added -->
                <h2>Note Output</h2>
                <p>Your expanded notes are shown below.</p>
  
                <div class="flashnote-content">
                  <div class="flashnote-note-output">
                    <div style="white-space: pre-wrap; word-wrap: break-word; max-width: 100%; overflow-x: auto;">
                      <pre class="preformatted">{{ outputText }}</pre>
                    </div>
                  </div>
                </div>
  
                <!-- Save Button at the bottom -->
                <button v-if="userExists" class="flashnote-save-note" @click="saveNote">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
    <div v-else>
      <p>Redirecting to login...</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
// import { get } from "core-js/core/dict";
  
  export default {
    name: "ViewNotesPreview",
    data() {
      return {
        notes: [ ],
        folders: [],
        outputText: "", // Assume this is passed from the previous page or loaded dynamically
        userExists: false,
        userObject: {},

      };
    },
    mounted() {
      this.checkUserInSession();
      this.getFolders();  
      this.getNotes();
    },
    methods: {
      async checkUserInSession() {
        const user = sessionStorage.getItem("user");
        if (!user) {
          // If the user does not exist, redirect to sign-in page
          window.location.href = "/sign-in";
        } else {
          this.userExists = true;
          this.userObject = JSON.parse(user);
          console.log("User exists in session storage:", this.userObject);
        }
      },
      handleSignInOut() {
        if (this.userExists) {
          sessionStorage.removeItem("user");
          this.userExists = false;
          window.location.href = "/sign-in"; // Redirect to login after sign out
        }
      },
      async getFolders() {
        try {
          const response = await axios.get("//localhost:8080/api/notes/folders/" + this.userObject._id);
          this.folders = response.data;
        } catch (error) {
          console.error("Error retrieving folders:", error);
          alert("An error occurred while retrieving folders.");
        }
      },
      async getNotes() {
        try {
          console.log("ID:",this.userObject._id);

          const response = await axios.get("//localhost:8080/api/notes/user/" + this.userObject._id);
          this.notes = response.data;
          console.log("Notes retrieved successfully:", this.notes);
        } catch (error) {
          console.error("Error retrieving notes:", error);
          console.log("User ID:", this.userObject.id);
          alert("An error occurred while retrieving notes.");
        }
      },
      async saveNote() {
        try {
          const user = JSON.parse(sessionStorage.getItem("user"));
          const newNote = {
            note_name: `Note_${new Date().toISOString()}`,
            note_content: this.outputText,
            note_format: "expanded",
            folder: "default",
            user: user.id,
          };
  
          const response = await axios.post("localhost:8080/api/notes/", newNote);
        console.log("Note saved successfully:", response.data);
        alert("Note saved successfully!");
      } catch (error) {
        console.error("Error saving note:", error);
        alert("An error occurred while saving the note.");
      }
      },
    },
  };
  </script>
  
  <style>
  .preformatted {
    white-space: pre-wrap; /* Preserves line breaks and wraps text */
    word-wrap: break-word; /* Breaks long words to avoid overflow */
    max-width: 100%; /* Ensures it doesn’t exceed the container width */
    overflow-x: auto; /* Adds horizontal scroll if content overflows */
  }
  
  body,
  html {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #fffdf7; /* Background color from your palette */
  }
  
  .flashnote-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .flashnote-navbar {
    background-color: #6798c0; /* Navbar background color */
    color: white;
    padding: 1rem;
  }
  
  .flashnote-navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-around;
  }
  
  .flashnote-navbar ul li {
    display: inline;
  }
  
  .flashnote-navbar ul li a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
  }
  
  .flashnote-main-content {
    display: flex;
    flex: 1;
  }
  
  .flashnote-left-column {
    width: 20%;
    background-color: #99d6eb; /* Left column background color */
    padding: 1rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .flashnote-right-column {
    flex: 1;
    background-color: white;
    padding: 2rem;
    border-left: 1px solid #fdd85d; /* Light border to separate the columns */
  }
  
  .flashnote-note-area {
    display: flex;
    flex-direction: column;
  }
  
  .flashnote-note-output {
    margin-bottom: 1rem;
    border: 0.5px solid #9c9393; /* Border color */
    padding: 1rem;
    background-color: #f0f0f0; /* Very light grey background for input/output areas */
    border-radius: 4px;
  }
  
  .flashnote-save-note {
    padding: 0.5rem 1rem;
    background-color: #6798c0; /* Button background color (dark blue) */
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 1rem;
    border-radius: 4px;
  }
  
  .flashnote-save-note:hover {
    background-color: #5a7ba5; /* Hover effect for buttons, slightly darker blue */
  }
  </style>
  