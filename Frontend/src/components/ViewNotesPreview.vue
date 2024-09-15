<template>
    <body id="app">
      <div class="flashnote-container">
        <!-- Navbar -->
        <nav class="flashnote-navbar">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">History</a></li>
            <li><a href="#">Notes</a></li>
            <li><a href="/create-account">Create Account</a></li>
            <li v-if="userExists">
              <a @click="handleSignInOut">Sign Out</a>
            </li>
            <li v-else>
              <a href="/sign-in">Sign In</a>
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
  
            <div v-if="userExists">
              <h2>Welcome, {{ userObject.first_name }}!</h2>
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
      // Check if user is in session storage when the component mounts
      this.checkUserInSession();
      this.loadNote(); // Load the output text when page mounts
    },
    methods: {
      async loadNote() {
        // Example logic to fetch a note from the database or API
        const noteId = 1; // Replace with actual logic to get the note ID
        try {
          const response = await axios.get(`localhost:8080/api/notes/${noteId}`);
          this.outputText = response.data.note_content;
        } catch (error) {
          console.error("Error fetching note:", error);
        }
      },
      handleSignInOut() {
        if (this.userExists) {
          // User is logged in, so sign out
          sessionStorage.removeItem("user");
          this.userExists = false;
          this.userObject = {};
        } else {
          // User is not logged in, so redirect to sign-in page
          window.location.href = "/sign-in";
        }
      },
      async checkUserInSession() {
        var user = sessionStorage.getItem("user");
        this.userExists = !!user; // Converts to a boolean: true if user exists, false otherwise
        this.userObject = JSON.parse(user);
      },
      async saveNote() {
        try {
          const user = JSON.parse(sessionStorage.getItem("user"));
          const noteToSave = {
            note_name: `Note_${new Date().toISOString()}`, // Example note name
            note_content: this.outputText,
            note_format: "expanded",
            folder: "default", // Example folder name
            user: user.id, // Replace with actual user ID
          };
  
          const response = await axios.post("localhost:8080/api/notes", noteToSave);
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
  