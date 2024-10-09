<template>
    <div class="container">
      <!-- Sidebar remains unchanged -->
      <div class="sidebar">
        <!-- ... (sidebar content remains the same) ... -->
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
        <FlashnoteNavbar
          :userExists="userExists"
          :userObject="userObject"
          @update:userExists="userExists = $event"
          @update:userObject="userObject = $event"
        />
        <div class="content">
          <h1>Flashcard Set: {{ folderName }}</h1>
  
          <div class="two-pane-container">
            <!-- Left pane: Notes list -->
            <div class="notes-list-pane">
              <h2 style= "padding-bottom: 10px;"  >Flashcards in: {{ flashcard_set_name }}</h2>
              <div v-if="flashcards.length > 0">
                <div style= "padding-bottom: 10px;" class="mass-action-controls">
                  <button @click="toggleSelectAll" class="action-btn">
                    {{ allSelected ? 'Deselect All' : 'Select All' }}
                  </button>
                  <button @click="deleteSelected" class="action-btn delete-btn" :disabled="!hasSelection">
                    Delete Selected
                  </button>
                </div>
                <ul class="notes-list">
                  <li v-for="flashcard in this.flashcards" :key="flashcard._id">
                    <div class="note-item">
                      <input type="checkbox" :value="flashcard._id" v-model="selectedNotes">
                      <!-- v-html turns the html styling into someting that is readable -->
                      <button v-html="flashcard.note_name" class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: flashcard._id } })">
                      </button>
                      <!-- <p> {{ flashcard.note_name }}</p> -->
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else>
                <p>No notes available in this folder.</p>
              </div>
            </div>
  
            <!-- Right pane: Content area -->
            <div class="right-content-pane">
              <h2>Flashcard</h2>
              <div class="flashcard-container" v-if="selectedFlashcard">
                <div class="flashcard-maincontainer" @click="flipCard">
                  <div :class="['flashcard-thecard', { 'flashcard-flip': isFlipped }]">
                    <div class="flashcard-thefront">{{ selectedFlashcard.question }}</div>
                    <div class="flashcard-theback">{{ selectedFlashcard.answer }}</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>Select a flashcard to display</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FlashnoteNavbar from "./Navbar.vue";
  import axios from "axios";
  
  export default {
    name: "FCPage",
    components: {
      FlashnoteNavbar,
    },
    props: ["flashnote-set-name"],
    data() {
      return {
        folderName: this.$route.params.id,
        flashcard_set_name: this.$route.params.id,
        notes: [],
        folders: [],
        userExists: false,
        userObject: {},
        selectedNotes: [],
        flashcards:[],
        // these 2 below are new
        selectedFlashcard: null,
        isFlipped: false,
      };
    },
    computed: {
  
      allSelected() {
        return this.notes.length > 0 && this.selectedNotes.length === this.notes.length;
      },
      hasSelection() {
        return this.selectedNotes.length > 0;
      }
    },
    watch: {
      '$route'(to) {
        this.folderName = to.params.id;
        this.fetchFlashcards();
      },
    },
    mounted() {
      this.checkUserInSession();
      this.fetchFlashcards();
      this.fetchFolders();
      this.sideBarMethods();
    },
    methods: {
      async fetchFlashcards() {
        try {
          const user = JSON.parse(sessionStorage.getItem("user"));
          const userId = user._id;
          console.log(this.flashcard_set_name)
          console.log(userId)
          const response = await axios.get(
            `http://localhost:8080/api/notes/${userId}/${this.flashcard_set_name}`
          );
          // console.log(response.data)
          // These lines below are bnew
          this.flashcards = response.data.map(flashcard => ({
          ...flashcard,
          question: flashcard.note_name,
          answer: flashcard.note_content
        }));          console.log(this.flashcards);
          // return onlyNotes
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      },

      checkUserInSession() {
        const user = sessionStorage.getItem("user");
        if (!user) {
          window.location.href = "/sign-in";
        } else {
          this.userExists = true;
          this.userObject = JSON.parse(user);
        }
      },
      sideBarMethods() {
        let btn = document.querySelector("#btn");
        let sidebar = document.querySelector(".sidebar");
        btn.onclick = function () {
          sidebar.classList.toggle("active");
        };
      },
      async fetchFolders() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        try {
          const response = await axios.get(
            `http://localhost:8080/api/notes/folders/${user._id}`
          );
          this.folders = response.data;
        } catch (error) {
          console.error("Error fetching folders:", error);
          this.folders = [];
        }
      },
      toggleSelectAll() {
        if (this.allSelected) {
          this.selectedNotes = [];
        } else {
          this.selectedNotes = this.notes.map(note => note._id);
        }
      },
      async deleteSelected() {
        if (this.selectedNotes.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${this.selectedNotes.length} selected note(s)?`)) {
          try {
            // const user = JSON.parse(sessionStorage.getItem("user"));
            // const userId = user._id;
            
            // Assuming your API supports bulk delete
            for( const noteId of this.selectedNotes) {
              await axios.delete(`http://localhost:8080/api/notes/${noteId}`);
            }
            
            // Remove deleted notes from the local array
            this.notes = this.notes.filter(note => !this.selectedNotes.includes(note._id));
            this.selectedNotes = []; // Clear selections
            
            alert('Selected notes have been deleted successfully.');
          } catch (error) {
            console.error("Error deleting notes:", error);
            alert('An error occurred while deleting notes. Please try again.');
          }
        }
        // These two functions are new
      },      selectFlashcard(flashcard) {
        this.selectedFlashcard = flashcard;
        this.isFlipped = false;
      },
      flipCard() {
        this.isFlipped = !this.isFlipped;
      },
    },
  };
  </script>
  
  <style>
  @import url(../assets/flashnote-styles.css);
  @import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
  </style>
  
  
  <style scoped>
  /* Make sure the button has the same style as other buttons across the application */
  
  .mass-action-controls {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
  
  .action-btn {
    padding: 8px 15px;
    background-color: #6798c0;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .action-btn:hover {
    background-color: #5a7ba5;
  }
  
  .action-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .delete-btn {
    background-color: #d9534f;
  }
  
  .delete-btn:hover {
    background-color: #c9302c;
  }
  
  .note-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .note-item input[type="checkbox"] {
    margin-right: 10px;
  }
  
  /* Adjust existing note-btn style */
  .note-btn {
    flex-grow: 1;
    text-align: left;
  }
  
  .note-btn {
    background-color: #6798c0; /* Your button background color */
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px 20px; /* Consistent padding */
    border-radius: 5px; /* Make the shape consistent with other buttons */
    font-size: 16px;
    transition: background-color 0.3s ease; /* Smooth transition */
  }
  
  /* Hover effect to make the button interactive */
  .note-btn:hover {
    background-color: #5a7ba5; /* Slightly darker color for hover */
  }
  
  /* Ensure the button takes up the correct width if needed */
  .note-btn {
    display: inline-block;
    width: auto;
    text-align: center;
  }
  
  
  
  /* Content area styles */
  .content {
    flex-grow: 1;
    padding: 20px;
    background-color: #fff;
    height: 100vh; /* Ensures content area is full height */
    overflow-y: auto; /* Allows scrolling if content exceeds view height */
  }
  
  /* Notes list styles */
  .notes-list {
    list-style-type: none;
    padding: 0;
  }
  
  .notes-list li {
    padding: 10px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .notes-list li:hover {
    background-color: #ddd;
  }
  
  h1 {
    margin-bottom: 20px;
    color: #333;
  }
  
  p {
    color: #666;
  }
  
  

  .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
  }
  .two-pane-container {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
  }
  .notes-list-pane {
      width: 400px;
      overflow-y: auto;
      border-right: 1px solid #ccc;
      padding: 20px;
  }
  .right-content-pane {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
  }
          /* .notes-list {
              list-style-type: none;
              padding: 0;
          } */
          /* .note-btn {
              width: 100%;
              text-align: left;
              padding: 10px;
              margin-bottom: 5px;
              background-color: #fff;
              border: 1px solid #ddd;
              cursor: pointer;
          } */
  
  /* FLASHCARDS
  These are new
  */
  
  .two-pane-container {
    display: flex;
    justify-content: space-between;
  }
  
  .notes-list-pane, .right-content-pane {
    width: 48%;
  }
  
  .flashcard-container {
    width: 100%;
    height: 300px;
    perspective: 1000px;
  }
  
  .flashcard-maincontainer {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flashcard-thecard {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flashcard-thefront, .flashcard-theback {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .flashcard-thefront {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .flashcard-theback {
    background-color: #e0e0e0;
    color: #333;
    transform: rotateY(180deg);
  }
  
  .flashcard-flip {
    transform: rotateY(180deg);
  }
  
  </style>
  