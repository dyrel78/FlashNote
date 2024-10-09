<template>
  <!--body id="view-notes-preview"-->
  <div id="app">
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
            <router-link :to="{ name: 'FolderPage', params: { id: folder } }">
              <i class="bx bx-folder"></i>
              <span class="nav-item">{{ folder }}</span>
            </router-link>
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
                  <pre
                    contenteditable="true"
                    @input="updateOutputText"
                    v-html="outputText"
                    class="preformatted"
                  ></pre> 
                  <div class="preformatted" id="editor">
                    <h3>{{  outputText }}</h3>

                  </div>
                  </div>

                  <p>{{ outputText }}</p>
                </div>



              <div class="flashnote-button-group">
                <!--Copy Button-->
                <button class="flashnote-copy-button" @click="copyText">
                  Copy
                </button>

                <!--Save Button-->
                <button
                  v-if="userExists"
                  class="flashnote-save-note"
                  @click="updateNote"
                >
                  Save
                </button>

                <!--Delete Button-->
                <button
                  v-if="userExists"
                  class="flashnote-delete-note"
                  @click="deleteNote"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import Quill from "quill";
// const { Delta } = Quill.import('delta');
import Delta from 'quill-delta'; 

import FlashnoteNavbar from "./Navbar.vue";
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
            console.log('note id is '+newId);
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
    // this.getFolders();
    this.fetchFolders();
    this.getAllNotes();
    // Add the sidebar toggle functionality
    // let btn = document.querySelector("#btn");
    // let sidebar = document.querySelector(".sidebar");

    // btn.onclick = function () {
    //   sidebar.classList.toggle("active");
    // };
    this.sideBarMethods();
    this.setQuillContent();
    this.initQuillEditor();


  },

  methods: {
    initQuillEditor() {
      this.quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });
      this.setQuillContent();
    },
    setQuillContent() {
      // if (this.quill && this.outputText) {
      //   this.quill.setText(''); // Clear existing content
      //   this.quill.clipboard.dangerouslyPasteHTML(0, this.outputText);
      // }

      if (this.quill && this.outputText) {
        this.quill.setText(''); // Clear existing content
        const lines = this.outputText.split('\n');
        const delta = lines.reduce((delta, line, index) => {
          if (index > 0) {
            delta.insert('\n');
          }
          return delta.insert(line);
        }, new Delta());
        this.quill.updateContents(delta);
      }
    },
    updateOutputText(event) {
      this.outputText = event.target.innerHTML;
      this.outputText = this.quill.root.innerHTML;

    },
  
    // Copy functionality
    copyText() {
      const textToCopy = this.outputText; // Grab the note content to copy
      const textArea = document.createElement("textarea");

      textArea.value = textToCopy.replace(/<\/?[^>]+(>|$)/g, ""); // This ensures we remove HTML tags; // Set the content to the textarea
      document.body.appendChild(textArea); // Temporarily add the textarea to the body

      textArea.select(); // Select the content
      document.execCommand("copy"); // Execute the copy command

      document.body.removeChild(textArea); // Remove the temporary textarea
      // Show a nice SweetAlert2 message
      Swal.fire({
        title: "Copied!",
        text: "Note content copied as plain text.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },

    //side bar
    async sideBarMethods() {
      let btn = document.querySelector("#btn");
      let sidebar = document.querySelector(".sidebar");

      btn.onclick = function () {
        sidebar.classList.toggle("active");
      };
    },
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
          if (this.note.note_format === "flashcards") {
            this.outputText = this.note.question + "\n" + this.note.answer;
          } else {
            this.outputText = this.note.note_content;
          }
          this.setQuillContent();
          console.log("Notes retrieved successfully:", this.note);
        } else {
          this.outputText = "Please select a note to view";
          this.setQuillContent();
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
    async updateNote() {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/notes/${this.id}`,
          {
            note_name: this.note.note_name,
            note_format: this.note.note_format,
            folder: this.note.folder,
            user: this.note.user,
            _id: this.note._id,
            note_content: this.outputText,
          }
        );
        console.log("Note Updates successfully:", response.data);
        this.fetchNote(this.id);
        Swal.fire({
          title: "Note Updated",
          text: "Your note has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        // this.fetchNote(this.id);
      } catch (error) {
        console.error("Error saving note:", error);
        alert("An error occurred while saving the note.");
      }
    },
    async fetchFolders() {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) {
        console.error("No user found in session.");
        this.folders = []; // Ensure folders is at least an empty array if no user is found
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/notes/folders/${user._id}`
        );
        this.folders = response.data;
      } catch (error) {
        console.error("Error fetching folders:", error);
        this.folders = []; // Ensure folders is at least an empty array if an error occurs
      }
    },

    async deleteNote() {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/notes/${this.id}`
        );
        console.log("Note deleted successfully:", response.data);
        Swal.fire({
          title: "Note Deleted",
          text: "Your note has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        // Pause 0.2 seconds
        // Go back a page
        this.$router.go(-1);

        // await new Promise((resolve) => setTimeout(resolve, 400));
        // window.location.href = "/home";
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("An error occurred while deleting the note.");
      }
    },
  },
};
</script>

<style>
@import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");

@import url("https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css");
</style>

<style scoped>
/* Add styles for the button group container */
.flashnote-button-group {
  display: flex;
  justify-content: flex-start; /* Align buttons to the left (or use flex-end for right alignment) */
  gap: 20px; /* Space between buttons */
  margin-top: 1rem;
}

/* Style the buttons */
button.flashnote-save-note,
button.flashnote-copy-button,
button.flashnote-delete-note {
  background-color: #6798c0; /* Button background color */
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  width: 100px; /* Make all buttons the same width */
  text-align: center; /* Center the text in the buttons */
}

/* Optional hover effect */
button.flashnote-save-note:hover,
button.flashnote-copy-button:hover,
button.flashnote-delete-note:hover {
  background-color: #5a7ba5; /* Darker blue on hover */
}

.preformatted {
  white-space: pre-wrap; /* Preserves line breaks and wraps text */
  word-wrap: break-word; /* Breaks long words to avoid overflow */
  max-width: 100%; /* Ensures it doesn’t exceed the container width */
  overflow-x: auto; /* Adds horizontal scroll if content overflows */
}

button {
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

/* Updated .flashnote-note-output to make it scrollable */
.flashnote-note-output {
  margin-bottom: 1rem;
  border: 0.5px solid #9c9393; /* Border color */
  padding: 1rem;
  background-color: #f0f0f0; /* Very light grey background for input/output areas */
  border-radius: 4px;
  max-height: 300px; /* Maximum height for the scroll box */
  overflow-y: scroll; /* Enables vertical scrolling */
  overflow-x: hidden; /* Ensures no horizontal scroll */
}

/* Optional: Customize the scrollbar */
.flashnote-note-output::-webkit-scrollbar {
  width: 8px;
}

.flashnote-note-output::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.flashnote-note-output::-webkit-scrollbar-thumb {
  background-color: #6798c0; /* Blue scrollbar */
  border-radius: 10px;
  border: 2px solid #f1f1f1;
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
