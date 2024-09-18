<template>
    <div id="app">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="top">
          <div class="logo">
            <i class="bx bx-edit"></i>
            <span>All Notes</span>
          </div>
          <i class="bx bx-menu" id="btn"></i>
        </div>
  
        <div class="user">
          <!-- User info to be added-->
        </div>
  
        <ul>
          <li>
            <a href="#">
              <i class="bx bx-folder"></i>
              <span class="nav-item"> INFO301</span>
            </a>
            <span class="tooltip">INFO301</span>
          </li>
          <li>
            <a href="#">
              <i class="bx bx-folder"></i>
              <span class="nav-item"> INFO302</span>
            </a>
            <span class="tooltip">INFO302</span>
          </li>
          <li>
            <a href="#">
              <i class="bx bx-folder"></i>
              <span class="nav-item"> COMP244</span>
            </a>
            <span class="tooltip">COMP244</span>
          </li>
        </ul>
      </div>
  
      <!-- Main content -->
      <div class="flashnote-container main-content">
        <!-- Navbar -->
        <nav class="flashnote-navbar">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Notes Folders</a></li>
            <li><a href="/view-notes-preview">Notes</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="/create-account">Create Account</a></li>
            <li v-if="userExists">
              <a @click="handleSignInOut">Sign Out</a>
            </li>
            <li v-else>
              <a href="/sign-in">Sign In</a>
            </li>
          </ul>
        </nav>
  
        <!-- Right Column for Note Input/Display -->
        <div class="flashnote-right-column">
          <div class="flashnote-note-area">
            <div v-if="userExists">
              <h2>Welcome, {{ userObject.first_name }}!</h2>
            </div>
            <h2>Advanced AI Note Creation</h2>
            <p>
              Welcome to FlashNote! Easily create concise notes from your lecture
              slides.
            </p>
            <div class="flashnote-tabs">
              <button @click="setTab('long')">Long</button>
              <button @click="setTab('medium')">Medium</button>
              <button @click="setTab('short')">Short</button>
              <button @click="setTab('flashcards')">Flashcards</button>
            </div>
            <div class="flashnote-content">
              <div class="flashnote-note-input">
                <textarea v-model="inputText" placeholder="Paste text"></textarea>
                <button class="flashnote-upload-pdf" @click="uploadPDF">Upload PDF</button>
                <button class="flashnote-create-note" @click="createNote">Create</button>
              </div>
              <div class="flashnote-note-output">
                <div style="white-space: pre-wrap; word-wrap: break-word; max-width: 100%; overflow-x: auto;">
                  <pre class="preformatted">{{ outputText }}</pre>
                </div>
              </div>
            </div>
            <button v-if="userExists" class="flashnote-save-note" @click="saveNote">Save</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "HomePage",
    data() {
      return {
        notes: [
          { id: 1, title: "INFO202", date: "September 6, 2024" },
          { id: 2, title: "INFO310", date: "September 8, 2024" },
          { id: 3, title: "INFO301", date: "June 12, 2024" },
        ],
        inputText: "",
        outputText: "",
        selectedTab: "long",
        userExists: false,
        userObject: "",
      };
    },
    mounted() {
      this.checkUserInSession();
      this.created();
    },
    methods: {
      async created() {
        if (sessionStorage.getItem("user")) {
          this.userExists = true;
          this.userObject = JSON.parse(sessionStorage.getItem("user"));
        } else {
          this.userExists = false;
        }
      },
      handleSignInOut() {
        if (this.userExists) {
          sessionStorage.removeItem("user");
          this.userExists = false;
          this.userObject = {};
        } else {
          window.location.href = "/sign-in";
        }
      },
      async checkUserInSession() {
        var user = sessionStorage.getItem("user");
        this.userExists = !!user;
        user = JSON.parse(user);
      },
      addFolder() {
        const newId = this.notes.length + 1;
        const newNote = {
          id: newId,
          title: `New Folder ${newId}`,
          date: new Date().toLocaleDateString(),
        };
        this.notes.push(newNote);
      },
      setTab(tab) {
        this.selectedTab = tab;
      },
      async createNote() {
        try {
          const endpointMap = {
            short: "/api/llm/short",
            medium: "/api/llm/medium",
            long: "/api/llm/long",
          };
          const endpoint = endpointMap[this.selectedTab];
          const response = await axios.get(endpoint, {
            params: {
              inputText: this.inputText,
            },
          });
          this.outputText = response.data;
        } catch (error) {
          this.outputText = "An error occurred while generating the note.";
        }
      },
      async saveNote() {
        try {
          const user = JSON.parse(sessionStorage.getItem("user"));
          const newNote = {
            note_name: `Note_${new Date().toISOString()}`,
            note_content: this.outputText,
            note_format: this.selectedTab,
            folder: "default",
            user: user.id,
          };
          await axios.post("localhost:8080/api/notes/", newNote);
          alert("Note saved successfully!");
        } catch (error) {
          alert("An error occurred while saving the note.");
        }
      },
      uploadPDF() {
        alert("PDF Upload Popup (Functionality not yet implemented)");
      },
    },
  };
  </script>
  
  <style scoped>
  @import url("Frontend/src/assets/will-style.css");
  </style>
  