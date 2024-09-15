<template>
    <div v-if="userExists">
      <body id="app">
        <div class="flashnote-container">
          <!-- Navbar -->
          <nav class="flashnote-navbar">
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">History</a></li>
              <li><a href="#">Notes</a></li>
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
                  <li v-for="note in notes" :key="note.id">
                    <a href="#">{{ note.title }}</a>
                    <span class="flashnote-date">{{ note.date }}</span>
                  </li>
                </ul>
              </div>
            </div>
  
            <!-- Right Column for Expanded Note Output -->
            <div class="flashnote-right-column">
              <div class="flashnote-note-area">
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
  
  export default {
    name: "ExpandedNotes",
    data() {
      return {
        notes: [
          { id: 1, title: "INFO202", date: "September 6, 2024" },
          { id: 2, title: "INFO310", date: "September 8, 2024" },
          { id: 3, title: "INFO301", date: "June 12, 2024" },
        ],
        outputText: "", // Assume this is passed from the previous page or loaded dynamically
        userExists: false,
        userObject: {},
      };
    },
    mounted() {
      this.checkUserInSession();
    },
    methods: {
      checkUserInSession() {
        const user = sessionStorage.getItem("user");
        if (!user) {
          // If the user does not exist, redirect to sign-in page
          window.location.href = "/sign-in";
        } else {
          this.userExists = true;
          this.userObject = JSON.parse(user);
        }
      },
      handleSignInOut() {
        if (this.userExists) {
          sessionStorage.removeItem("user");
          this.userExists = false;
          window.location.href = "/sign-in"; // Redirect to login after sign out
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
  
          const response = await axios.post("http://localhost:8080/api/notes", newNote);
          alert("Note saved successfully!");
        } catch (error) {
          alert("Error saving note: " + error.message);
        }
      },
    },
  };
  </script>
  