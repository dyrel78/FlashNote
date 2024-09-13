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
        </ul>
      </nav>

      <!-- Main content -->
      <div class="flashnote-main-content">
        <!-- Left Column for Folders -->
        <div class="flashnote-left-column">
          <div class="flashnote-folders">
            <h2>My Notes</h2>
            <button class="flashnote-add-folder" @click="addFolder">+</button>
            <ul>
              <li v-for="note in notes" :key="note.id">
                <a href="#">{{ note.title }}</a
                ><span class="flashnote-date">{{ note.date }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right Column for Note Input/Display -->
        <div class="flashnote-right-column">
          <div class="flashnote-note-area">
            <h2>Advanced AI Note Creation</h2>
            <p>
              Welcome to FlashNote! Easily create concise notes from your
              lecture slides.
            </p>
            <div class="flashnote-tabs">
              <button @click="setTab('long')">Long</button>
              <button @click="setTab('medium')">Medium</button>
              <button @click="setTab('short')">Short</button>
              <button @click="setTab('flashcards')">Flashcards</button>
            </div>
            <div class="flashnote-content">
              <div class="flashnote-note-input">
                <textarea
                  v-model="inputText"
                  placeholder="Paste text"
                ></textarea>
                <button class="flashnote-upload-pdf">Upload PDF</button>
                <button class="flashnote-create-note" @click="createNote">
                  Create
                </button>
              </div>
              <div class="flashnote-note-output">
                <!-- <h3>{{ outputText }}</h3> -->
                <!-- <pre> <>{{ outputText }}  </h3></pre> -->
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
                <!-- Placeholder for AI generated notes preview -->
              </div>
            </div>
            <button
              class="flashnote-save-note"
              @click="saveNote"
              :disabled="!userExists"
            >
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
    };
  },
  mounted() {
    // Check if user is in session storage when the component mounts
    this.checkUserInSession();
  },
  methods: {
    checkUserInSession() {
      var user = sessionStorage.getItem("user");
      this.userExists = !!user; // Converts to a boolean: true if user exists, false otherwise
      console.log("User exists in session storage:", this.userExists);
      user = JSON.parse(user);
      console.log(user);
    },
    // Placeholder for adding a new folder to the database
    addFolder() {
      const newId = this.notes.length + 1;
      const newNote = {
        id: newId,
        title: `New Folder ${newId}`,
        date: new Date().toLocaleDateString(),
      };

      // Placeholder for database interaction - this would be an API call
      console.log("Creating new folder in the database:", newNote);

      this.notes.push(newNote);
    },

    // Set the active tab for generating different types of notes
    setTab(tab) {
      this.selectedTab = tab;
      console.log("Selected tab:", this.selectedTab);
    },

    // Placeholder function to interact with LLM
    // createNote() {
    //     let prompt = '';

    //     // Generate different prompts based on the selected tab
    //     if (this.selectedTab === 'short') {
    //         prompt = `${this.inputText} + "Generate notes on key points, 4 bullet points per heading, less than 15 words per bullet point."`;
    //     } else if (this.selectedTab === 'medium') {
    //         prompt = `${this.inputText} + "Generate notes on key points, 5 bullet points, less than 40 words per bullet point."`;
    //     } else if (this.selectedTab === 'long') {
    //         prompt = `${this.inputText} + "Generate full paragraphs on key concepts."`;
    //     }

    //     // Placeholder for LLM API call
    //     console.log('Sending prompt to LLM:', prompt);

    //     // Simulated response from LLM
    //     this.outputText = `Generated Note for ${this.selectedTab} tab: (LLM Response Placeholder) ${prompt}`;
    // }
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
        console.error("Error creating note:", error);
        this.outputText = "An error occurred while generating the note.";
      }
    },
    // Placeholder for saving the generated note to the database
    // saveNote() {
    //     console.log('Saving note to the database:', this.outputText);
    //     alert('Note saved successfully!');
    //     // Placeholder for actual database saving logic
    // },
    async saveNote() {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const newNote = {
          note_name: `Note_${new Date().toISOString()}`, // Example note name, customize as needed
          note_content: this.outputText,
          note_format: this.selectedTab,
          folder: "default", // Example folder name, customize as needed
          user: user.id, // Replace with actual user ID
        };

        const response = await axios.post("/api/notes", newNote);
        console.log("Note saved successfully:", response.data);
        alert("Note saved successfully!");
      } catch (error) {
        console.error("Error saving note:", error);
        alert("An error occurred while saving the note.");
      }
    },
    // Placeholder for showing a PDF upload popup
    uploadPDF() {
      console.log("Triggered PDF upload popup");
      // Placeholder for actual PDF upload and text scraping functionality
      alert("PDF Upload Popup (Functionality not yet implemented)");
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

.flashnote-folders h2 {
  font-size: 1.5rem;
  color: #6798c0; /* Text color for folder heading */
}

.flashnote-add-folder {
  background-color: #6798c0; /* Button background color (dark blue) */
  color: white;
  border: none;
  padding: 0.5rem;
  margin: 1rem 0;
  cursor: pointer;
  width: 100%;
  border-radius: 4px;
}

.flashnote-folders ul {
  list-style-type: none;
  padding: 0;
}

.flashnote-folders ul li {
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  color: black; /* Class text color set to black */
}

.flashnote-folders ul li a {
  text-decoration: none;
  color: black; /* Link color set to black */
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

.flashnote-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.flashnote-tabs button {
  flex: 1;
  padding: 0.5rem;
  background-color: #fdd85d; /* Tabs background color (yellow) */
  border: 1px solid #fdc920; /* Border color */
  cursor: pointer;
  color: #333;
  border-radius: 4px;
}

.flashnote-tabs button:hover {
  background-color: #fdc920; /* Hover effect on tabs */
  color: white;
}

.flashnote-content {
  display: flex;
  justify-content: space-between;
}

.flashnote-note-input,
.flashnote-note-output {
  width: 48%;
  margin-bottom: 1rem;
  border: 0.5px solid #9c9393; /* Border color */
  padding: 1rem;
  background-color: #f0f0f0; /* Very light grey background for input/output areas */
  border-radius: 4px;
}

.flashnote-note-input textarea {
  width: 100%;
  height: 200px;
  border: none;
  padding: 1rem;
  resize: none;
  background-color: #f0f0f0; /* Very light grey background color for textarea */
  color: #333; /* Text color */
  border-radius: 4px;
}

.flashnote-upload-pdf,
.flashnote-create-note,
.flashnote-save-note {
  padding: 0.5rem 1rem;
  background-color: #6798c0; /* Button background color (dark blue) */
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 4px;
}

.flashnote-save-note {
  align-self: flex-end;
}

.flashnote-upload-pdf:hover,
.flashnote-create-note:hover,
.flashnote-save-note:hover {
  background-color: #5a7ba5; /* Hover effect for buttons, slightly darker blue */
}
</style>
