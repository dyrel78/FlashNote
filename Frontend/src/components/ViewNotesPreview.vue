<template>
  <div v-if="userExists">
    <!--body id="view-notes-preview"-->
    <div id="view-notes-preview">
      <!-- Sidebar -->
      <div class="container">
        <div class="sidebar">
          <div class="top">
            <div class="logo">
              <i class="bx bx-edit"></i>
              <span>All Notes</span>
            </div>
            <i class="bx bx-menu" id="btn"></i>
          </div>

          <ul>
            <li v-for="folder in folders" :key="folder">
              <a href="#">
                <i class="bx bx-folder"></i>
                <span class="nav-item">{{ folder }}</span>
              </a>
              <span class="tooltip">{{ folder }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="flashnote-container main-content">
        <!-- Navbar -->
        <FlashnoteNavbar
          :userExists="userExists"
          :userObject="userObject"
          @update:userExists="userExists = $event"
          @update:userObject="userObject = $event"
        />

        <!-- Main content -->
        <div class="flashnote-main-content">
          <!-- Right Column for Expanded Note Output -->
          <div class="flashnote-right-column">
            <div class="flashnote-note-area">
              <h1>View Notes Preview</h1>
              <!-- Page title added -->
              <p>Your expanded notes are shown below.</p>

              <div id="flashnote-content" class="flashnote-content">
                <div id="flashnote-note-output" class="flashnote-note-output">
                  <div
                    style="
                      white-space: pre-wrap;
                      word-wrap: break-word;
                      max-width: 100%;
                      overflow-x: auto;
                    "
                  >
                    <pre class="preformatted">{{ outputText }}</pre>
                  </div>
                </div>
                <div id="copy-btn-viewnotespreview">
                  <button class="flashnote-copy-button">Copy</button>
                </div>
                <div id="save-btn-viewnotespreview">
                <button
                  v-if="userExists"
                  class="flashnote-save-note"
                  @click="saveNote"
                >
                  Save
                </button>
                </div>
              </div>

              <!-- Save Button at the bottom -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Redirecting to login...</p>
  </div>
</template>

<script>
import axios from "axios";
import FlashnoteNavbar from './Navbar.vue';
// import { get } from "core-js/core/dict";

export default {
  name: "ViewNotesPreview",
  components: {
    FlashnoteNavbar, // Make sure the Navbar is registered
  },
  props: ["id"],
  watch: {
    id: {
      immediate: true,
      handler(newId) {
        {
          if (newId) {
            this.fetchNote(newId);
          }
        }
      },
    },
  },
  data() {
    return {
      notes: null,
      folders: [],
      outputText: "", // Assume this is passed from the previous page or loaded dynamically
      userExists: false,
      userObject: {},
    };
  },
  mounted() {
    this.checkUserInSession();
    this.getFolders();
    this.getAllNotes();
    // Add the sidebar toggle functionality
    let btn = document.querySelector("#btn");
    let sidebar = document.querySelector(".sidebar");

    btn.onclick = function () {
      sidebar.classList.toggle("active");
    };
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
        const response = await axios.get(
          "//localhost:8080/api/notes/folders/" + this.userObject._id
        );
        this.folders = response.data;
        console.log("Folders retrieved successfully:", this.folders);
      } catch (error) {
        console.error("Error retrieving folders:", error);
        alert("An error occurred while retrieving folders.");
      }
    },
    async getAllNotes() {
      try {
        const response2 = await axios.get(
          "//localhost:8080/api/notes/user/" + this.userObject._id
        );
        this.notes = response2.data;
        console.log("Notes retrieved successfully:", this.notes);
      } catch (error) {
        console.error("Error retrieving notes:", error);
        console.log("User ID:", this.userObject.id);
        alert("An error occurred while retrieving notes.");
      }
    },
    async fetchNote(noteId = null) {
      try {
        const idToFetch = noteId || this.id;
        if (idToFetch) {
          const response = await axios.get(
            `//localhost:8080/api/notes/${idToFetch}`
          );
          this.note = response.data;
          this.outputText = this.note.note_content;
          console.log("Notes retrieved successfully:", this.note);
        } else {
          this.outputText = "Please select a note to view";
        }
      } catch (error) {
        console.error("Error retrieving notes:", error);
        // console.log("User ID:", this.userObject.id);
        alert("An error occurred while retrieving notes.");
      }
    },
    navigateToNote(noteID) {
      this.$router.push({ name: "ViewNotesPreview", params: { id: noteID } });
      this.fetchNote(noteID);
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
/* trial*/

/* Align Save Button to Right of Text Area */
.save-btn-viewnotespreview .copy-btn-viewnotespreview{
  background-color: #6798c0;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  position: left;
  right: 0; /* Align to the right */
  top: 50%; /* Align vertically to the middle */
  transform: translateY(-50%); /* Center it vertically */
}


/* Adjust Save Button Hover Effect */
.save-btn-viewnotespreview:hover .copy-btn-viewnotespreview{
  background-color: #5a7ba5;
}

</style>

<style>
  .preformatted {
    white-space: pre-wrap; /* Preserves line breaks and wraps text */
    word-wrap: break-word; /* Breaks long words to avoid overflow */
    max-width: 100%; /* Ensures it doesn’t exceed the container width */
    overflow-x: auto; /* Adds horizontal scroll if content overflows */
  }
  
  button{
    background-color: #6798c0; /* Button background color (dark blue) */
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 1rem;
    border-radius: 4px;
    padding: 0.5rem 1rem;
  }
  body,
  html {
    margin: 0px;
    padding: 0px;
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



<!-- Dyrels addition -->
<style>
.flashnote-content {
  display: flex;
  flex-direction: column; /* Stack child divs vertically */
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  height: 100%; /* Ensure it takes up full height of the container */
}

.flashnote-note-output,
.flashnote-save-note {
  width: 100%; /* Adjust this as necessary for the desired width */
  max-width: 600px; /* Optional: Limit max width of note output */
  margin-bottom: 1rem; /* Adds space between stacked elements */
}

button.flashnote-save-note {
  /* display: inline-block; */
}

</style>