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
          <!-- Right Column for Note Input/Display -->
          <div class="flashnote-right-column">
            <div class="flashnote-note-area">
              <!-- use sessions storage to access users name -->
              <div></div>
              <!-- <h2 >
              {{ userExists ? `Welcome, ${userObject.first_name}!` : "Welcome!" }}
            </h2> -->
              <div v-if="userExists">
                <h2>Welcome, {{ userObject.first_name }}!</h2>
              </div>
              <h2>FlashNote - Advanced AI Note Creation</h2>

              <p>Easily create concise notes from your lecture slides.</p>
              <div class="space"></div>
              <h3>Choose your preferred note format:</h3>
              <div class="space"></div>
              <div class="flashnote-tabs">
                <button @click="setTab('long')">Detailed</button>
                <button @click="setTab('medium')">Concise</button>
                <button @click="setTab('short')">Bullet-Points</button>
                <button @click="setTab('flashcards')">Flashcards</button>
              </div>
              <div
                class="flashnote-content"
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-evenly;
                  align-items: flex-start;
                  height: 100%;
                  flex-wrap: wrap;
                "
              >
                <div class="flashnote-note-input">
                  <textarea
                    v-model="inputText"
                    placeholder="Paste text"
                  ></textarea>
                  <input
                    class="choose-file-input"
                    type="file"
                    id="inpfile"
                    @change="handleFileUpload"
                  />
                  <button class="flashnote-upload-pdf" @click="uploadPDF">
                    Upload PDF
                  </button>

                  <div v-if="userExists">
                    <label for="folderSelect">Select Folder:</label>
                    <select
                      id="folderSelect"
                      @change="handleFolderChange"
                      v-model="selectedFolder"
                    >
                      <option value="" disabled>Select a folder</option>
                      <option
                        v-for="folder in folders"
                        :key="folder"
                        :value="folder"
                      >
                        {{ folder }}
                      </option>
                      <option value="new">Create New Folder</option>
                    </select>

                    <!-- Input for new folder name (only shown when "Create New Folder" is selected) -->
                    <div class="enterNewFolder" v-if="isNewFolder">
                      <input
                        type="text"
                        v-model="newFolderName"
                        placeholder="Enter new folder name"
                      />
                    </div>
                  </div>
                  <!--
<button
  id="startButton"
  class="flashnote-clear-button"
  @click="startVoiceInput"
>
  Start Voice Input
</button>
-->
                  <button
                    class="flashnote-create-note"
                    @click="createNote"
                    :disabled="isLoading"
                    style="margin-left: 10px"
                  >
                    Create Note
                  </button>
                  <button class="flashnote-clear-button" @click="clearInput">
                    Clear
                  </button>
                </div>

                <div class="flashnote-note-output">
                  <!-- <h3>{{ outputText }}</h3> -->
                  <!-- <pre> <>{{ outputText }}  </h3></pre> -->
                  <div class="outputText">
                    <pre class="preformatted">
                        <!-- {{ outputText }} -->
                        <p v-html="outputText"></p>
                      </pre>

                    <div v-if="isLoading" class="loading-spinner">
                      <i class="bx bx-loader-alt bx-spin"></i>
                    </div>
                  </div>
                  <!-- Placeholder for AI generated notes preview -->

                  <button
                    class="flashnote-clear-button"
                    v-if="userExists"
                    @click="clearOutput"
                  >
                    Clear
                  </button>
                  <button class="flashnote-copy-button" @click="copyText">
                    Copy
                  </button>
                </div>
              </div>

              <button
                v-if="userExists"
                class="flashnote-save-note"
                @click="saveNote"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- End of Flashnote Main Content -->
    </div>

    <!-- End of Container-->
  </body>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import FlashnoteNavbar from "./Navbar.vue";
import FormatNoteText from "../markdownScript.js";
import FormatFlashcards from "../flashcardScript.js";
import introJs from "intro.js";
import "intro.js/introjs.css";

export default {
  name: "HomePage",
  components: {
    FlashnoteNavbar, // Register FlashnoteNavbar component here
  },
  data() {
    return {
      notes: [
        { id: 1, title: "INFO202", date: "September 6, 2024" },
        { id: 2, title: "INFO310", date: "September 8, 2024" },
        { id: 3, title: "INFO301", date: "June 12, 2024" },
      ],
      folders: [],
      selectedFolder: "", // For selected folder
      newFolderName: "",
      inputText: "",
      outputText: "",
      selectedTab: "long",
      userExists: false,
      userObject: "",
      selectedFile: null,
      flashCardObjects: [],
      isLoading: false,
      recognition: null, // To hold the SpeechRecognition instance
      isListening: false,
      tempText: "",
      isNewFolder: false,
    };
  },

  mounted() {
    // Check if user is in session storage when the component mounts
    this.checkUserInSession();
    this.created();
    this.fetchFolders();
    this.sideBarMethods();
    // Check if user is logging in for the first time
    if (this.userExists && !localStorage.getItem("tourCompleted")) {
      // Show welcome alert using SweetAlert
      Swal.fire({
        title: "Welcome!",
        text: "Thanks for signing in. Would you like to take a quick tour?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Start Tour",
        cancelButtonText: "Skip",
      }).then((result) => {
        if (result.isConfirmed) {
          this.startTour(); // Trigger the walkthrough after clicking OK
        }
        localStorage.setItem("tourCompleted", "true"); // Set flag in localStorage
      });
    }
  },
  methods: {
    startTour() {
      introJs()
        .setOptions({
          steps: [
            {
              intro:
                "Welcome to FlashNote! Let's walk you through the features.",
            },
            {
              element: ".flashnote-note-input",
              intro: "Here you can input or upload your lecture notes.",
              position: "right",
            },
            {
              element: ".flashnote-tabs",
              intro: "Choose the type of summary you want to generate here.",
              position: "bottom",
            },
            {
              element: ".flashnote-save-note",
              intro: "Once done, you can save your generated notes.",
              position: "left",
            },
            {
              element: ".sidebar",
              intro:
                "This is where you can navigate between different folders and saved notes.",
              position: "right",
            },
          ],
          showStepNumbers: true,
          exitOnOverlayClick: true,
          showBullets: false,
          disableInteraction: true,
        })
        .start();
    },

    startVoiceInput() {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition;
      if (!SpeechRecognition) {
        Swal.fire({
          icon: "error",
          title: "Speech Recognition Not Supported",
          text: "Sorry, your browser does not support speech recognition.",
        });
        return;
      }

      if (!this.recognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = "en-US";
        this.recognition.continuous = true; // Keep listening until explicitly stopped
        this.recognition.interimResults = false; // Only process final results

        this.recognition.onstart = () => {
          this.isListening = true; // Update state
          this.tempText = ""; // Clear tempText on start
          document.getElementById("startButton").textContent = "Listening...";
        };

        this.recognition.onresult = (event) => {
          // Collect all final results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            this.inputText += event.results[i][0].transcript + " "; // Append final results to inputText
          }
        };

        this.recognition.onend = () => {
          this.isListening = false; // Update state

          document.getElementById("startButton").textContent =
            "Start Voice Input";
        };
      }

      if (this.isListening) {
        this.recognition.stop(); // Stop recognition if currently listening
      } else {
        this.recognition.start(); // Start recognition if not listening
      }
    },
    async created() {
      if (sessionStorage.getItem("user")) {
        console.log(
          "TESTING CREATEDUser exists in session storage:",
          this.user
        );
        this.userExists = true;
        this.userObject = JSON.parse(sessionStorage.getItem("user"));
      } else {
        console.log(
          "TESTING CREATEDUser does not exist in session storage:",
          this.user
        );
        this.userExists = false;
      }
    },

    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
    },
    async sideBarMethods() {
      let btn = document.querySelector("#btn");
      let sidebar = document.querySelector(".sidebar");

      btn.onclick = function () {
        sidebar.classList.toggle("active");
      };
    },
    handleSignInOut() {
      if (this.userExists) {
        // User is logged in, so sign out
        sessionStorage.removeItem("user");
        this.userExists = false;
        this.userObject = {};
        this.signInLabel = "Sign In"; // Update label to "Sign In"
      } else {
        // User is not logged in, so redirect to sign-in page
        window.location.href = "/sign-in";
      }
    },
    async checkUserInSession() {
      var user = sessionStorage.getItem("user");
      this.userExists = !!user; // Converts to a boolean: true if user exists, false otherwise
      console.log("User exists in session storage:", this.userExists);
      user = JSON.parse(user);
      console.log(user);
    },

    // Set the active tab for generating different types of notes
    setTab(tab) {
      this.selectedTab = tab;
      console.log("Selected tab:", this.selectedTab);
    },

    // copyText method
    copyText() {
      const textToCopy = this.outputText; // Get the text to copy
      const textArea = document.createElement("textarea");

      // Set the textarea's value to the plain text (use innerText for plain text)
      textArea.value = textToCopy.replace(/<\/?[^>]+(>|$)/g, ""); // Removes HTML tags

      // Append the textarea temporarily to the body
      document.body.appendChild(textArea);

      // Select the text and copy
      textArea.select();
      document.execCommand("copy");

      // Remove the textarea after copying
      document.body.removeChild(textArea);

      // Show a nice SweetAlert2 message
      Swal.fire({
        title: "Copied!",
        text: "Note content copied as plain text.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },

    async createNote() {
      try {
        this.isLoading = true;
        this.outputText = "";
        const endpointMap = {
          short: "http://localhost:8080/api/llm/short",
          medium: "http://localhost:8080/api/llm/medium",
          long: "http://localhost:8080/api/llm/long",
          flashcards: "http://localhost:8080/api/llm/flashcards",
        };
        const endpoint = endpointMap[this.selectedTab];
        const response = await axios.get(endpoint, {
          params: {
            inputText: this.inputText,
          },
        });

        this.outputText = FormatNoteText(response.data);
        if (this.selectedTab === "flashcards") {
          this.flashCardObjects = FormatFlashcards(this.outputText);
          this.outputText = "";

          // THIS FLASHCARD OBJECTS IS IMPORTANT WHEN SAVING THE FLASHCARDS

          this.flashCardObjects.forEach((flashcard) => {
            this.outputText +=
              flashcard.question + " " + flashcard.answer + "\n";
          });
        }
      } catch (error) {
        console.error("Error creating note:", error);
        this.outputText = "Error creating note. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Input Size Too Big",
          text: "The input size is too big. Please reduce the size of your input and try again.",
          confirmButtonText: "OK",
        });
      } finally {
        this.isLoading = false;
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

    async handleFolderChange() {
      // Toggle the visibility of the new folder input based on selection
      this.isNewFolder = this.selectedFolder === "new";
    },
    async clearOutput() {
      this.outputText = "";
    },
    async clearInput() {
      this.inputText = ""; // Clear the input text
      this.selectedFile = null; // Clear the selected file
      const fileInput = document.getElementById("inpfile");
      if (fileInput) {
        fileInput.value = ""; // Reset the file input value
      }
    },

    async saveNote() {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        let folderName = this.selectedFolder;

        // Use the new folder name if the user has selected to create a new one
        if (this.isNewFolder) {
          folderName = this.newFolderName;
          if (!this.folders.includes(folderName)) {
            this.folders.push(folderName);
            this.isNewFolder = false; // Reset the new folder input
            this.selectedFolder = folderName; // Select the new folder
            this.newFolderName = ""; // Clear the new folder name
          }
        }

        if (!folderName) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please select or create a folder.",
          });
          return;
        }

        // const noteName = window.prompt(
        //   "Enter a name for your note:",
        //   `Note_${new Date().toISOString()}`
        // );
        const { value: noteName } = await Swal.fire({
          title: "Enter a name for your note",
          input: "text",
          inputValue: `Note_${new Date().toISOString()}`,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return "You need to write something!";
            }
          },
        });

        if (!noteName) {
          // Error alert for missing note name
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Note name is required.",
          });
          return;
        }

        if (this.selectedTab === "flashcards") {
          // let counter = 1; // Initialize counter

          for (const flashCard of this.flashCardObjects) {
            if (flashCard.question.startsWith("\n")) {
              flashCard.question = flashCard.question.substring(1);
            }
            if (flashCard.question.startsWith("\n")) {
              flashCard.question = flashCard.question.substring(1);
            }
            if (flashCard.question.trim() === "") {
              // Skip flashcards with invalid questions
              continue;
            }
            console.log(flashCard.question);
            console.log(flashCard.answer);
            let formatedNoteName = flashCard.question;

            // formatedNoteName = formatedNoteName.substring(
            //   "<strong>Question:</strong>".length);
            const questionRegex = /^<strong>Question:<\/strong>\s*/;

            // Regex pattern to remove "<strong>Answer:</strong>" from the beginning of the string
            const answerRegex = /^<strong>Answer:<\/strong>\s*/;
            formatedNoteName = formatedNoteName.replace(questionRegex, "");
            formatedNoteName = formatedNoteName.replace(answerRegex, "");

            let flashCardAnswer = flashCard.answer;
            let flashCardQuestion = flashCard.question;

            // Regex pattern to remove "<strong>Answer:</strong>" from the beginning of the string
            flashCardAnswer = flashCardAnswer.replace(answerRegex, "");
            flashCardQuestion = flashCardQuestion.replace(questionRegex, "");

            const newFlashcard = {
              // note_name: `${noteName}_${counter}`, // Append counter to note_name
              note_name: formatedNoteName,
              note_format: "flashcards",
              folder: folderName,
              flashcard_set_name: noteName + "_set",
              user: user,
              // question: flashCard.question,
              // answer: flashCard.answer,
              question: flashCardQuestion,
              answer: flashCardAnswer,
              status: flashCard.status,
            };

            const response = await axios.post(
              "http://localhost:8080/api/notes/",
              newFlashcard
            );
            console.log("Flashcard saved successfully:", response.data);

            // counter++; // Increment counter
          }

          // Success alert for flashcards saving
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Flashcards saved successfully!",
          });
        } else {
          const newNote = {
            note_name: noteName,
            note_content: this.outputText,
            note_format: this.selectedTab,
            folder: folderName,
            user: user,
          };

          const response = await axios.post(
            "http://localhost:8080/api/notes/",
            newNote
          );
          console.log("Note saved successfully:", response.data);
          await this.fetchFolders();

          // Success alert for note saving
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Note saved successfully!",
          });
        }
      } catch (error) {
        console.error("Error saving note:", error);
        // Error alert for note saving
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error saving the note.",
        });
      }
    },
    // Placeholder for showing a PDF upload popup
    uploadPDF() {
      if (this.selectedFile == null) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please select a PDF file to upload.",
        });
        return;
      }
      if (this.selectedFile) {
        console.log("uploading pdf");
        const formData = new FormData();
        formData.append("pdfFile", this.selectedFile);
        axios
          .post("http://localhost:8080/api/pdf/extract_text", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000,
          })
          .then((response) => {
            console.log(response);
            this.inputText = response.data;
          })
          .catch((error) => {
            console.error("Error uploading PDF:", error);
          });
      } else {
        console.log("No file selected");
      }
    },
  },
};
</script>

<style>
@import url(../assets/flashnote-styles.css);
@import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
</style>
