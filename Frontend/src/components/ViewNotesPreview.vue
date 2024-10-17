<template>
  <body id="view-notes-preview">
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
            <!-- Expanded Note Output -->
            <div class="flashnote-right-column">
              <div class="flashnote-note-area">
                <h1>View Notes Preview</h1>
                <!-- Page title added -->
                <p>Your expanded notes are shown below.</p>

                <div id="flashnote-content" class="flashnote-content">
                  <div 
                  style= 
                  "
                  width: calc(100% - 40rem);
                  "
                  class = "editor-container">
                  <div v-if="note.note_format === 'flashcards'">
                        <h3>Question</h3>
                        <div  id="flashnote-question-editor">
                          <div v-html="outputTextQuestion"></div>
                        </div>

                        <h3>Answer</h3>
                        <div id="flashnote-answer-editor">
                          <div  v-html="outputTextQuestion"></div>
                        </div>
                      </div>


                    <div v-else>
                      <!-- <h3>Note Content</h3> -->
                    <div style="
                        white-space: normal;
                        word-wrap: break-word;
                        max-width: 100%;
                        overflow-x: auto;
                      " id="editor">
                      </div>
                      </div>  


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
    </div>
  </body>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import Quill from "quill";
// const { Delta } = Quill.import('delta');
// import Delta from "quill-delta";

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
            console.log("note id is " + newId);
          }
        }
      },
    },
      outputText: {
    handler(newOutputText) {
      // Update the Quill editor when outputText changes
      if (this.quill && newOutputText) {
        this.quill.setContents([]); // Clear the existing content
        this.quill.clipboard.dangerouslyPasteHTML(0, newOutputText); // Paste the updated content
      }
    },
    immediate: false // Update immediately if outputText is already available
  },  
  },
  data() {
    return {
      notes: null,
      folders: [],
      outputText: "", // Assume this is passed from the previous page or loaded dynamically
      outputTextQuestion: "",
      outputTextAnswer: "",
      note: {},
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
     
    this.quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
        ],
      },
    });

    // Set the initial Quill content if outputText is already available
    this.setQuillContent();

    // Listen for changes in Quill editor
    // this.quill.on("text-change", () => {
    //   // Update outputText with Quill editor's content
    //   this.outputText = this.quill.root.innerHTML;
    // });
  }
  ,
    // setQuillContent() {
    //   // if (this.quill && this.outputText) {
    //   //   this.quill.setText(''); // Clear existing content
    //   //   this.quill.clipboard.dangerouslyPasteHTML(0, this.outputText);
    //   // }

    //   if (this.quill && this.outputText) {
    //     this.quill.setText(""); // Clear existing content
    //     const lines = this.outputText.split("\n");
    //     const delta = lines.reduce((delta, line, index) => {
    //       if (index > 0) {
    //         delta.insert("\n");
    //       }
    //       return delta.insert(line);
    //     }, new Delta());
    //     this.quill.updateContents(delta);
    //   }
    // },
    setQuillContent() {
    // if (this.quill && this.outputText) {
    //   // this.quill.root.innerHTML = this.outputText; // Set content in Quill editor
    //   this.quill.setContents([]); // Clear existing content
    //   this.quill.clipboard.dangerouslyPasteHTML(0, this.outputText);

    // }

  },


    updateOutputText(event) {
      this.outputText = event.target.innerHTML;
      // this.outputText = this.quill.root.innerHTML;
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
          "//3.217.34.111:8080/api/notes/folders/" + this.userObject._id
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
          "//3.217.34.111:8080/api/notes/user/" + this.userObject._id
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
            `//3.217.34.111:8080/api/notes/${idToFetch}`
          );
          this.note = response.data;
          if (this.note.note_format === "flashcards") {
            // this.outputText = this.note.question + "\n" + this.note.answer;
            this.outputTextQuestion = this.note.question;
            this.outputTextAnswer = this.note.answer;
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
     this.outputText = this.quill.root.innerHTML;

      try {
        const response = await axios.put(
          `http://3.217.34.111:8080/api/notes/${this.id}`,
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
          `http://3.217.34.111:8080/api/notes/folders/${user._id}`
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
          `http://3.217.34.111:8080/api/notes/${this.id}`
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
@import url(../assets/flashnote-styles.css);
@import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");

@import url("https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css");

.ql-editor {
  /* padding: 12px 0; */
  font-size: 18px;
}
</style>
