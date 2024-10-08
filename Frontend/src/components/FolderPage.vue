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
        <h1>Folder: {{ folderName }}</h1>

        <div class="two-pane-container">
          <!-- Left pane: Notes list -->
          <div class="notes-list-pane">
            <h2 style= "padding-bottom: 10px;"  >Folder: {{ folderName }}</h2>
            <div v-if="notes.length > 0">
              <div style= "padding-bottom: 10px;" class="mass-action-controls">
                <button @click="toggleSelectAll" class="action-btn">
                  {{ allSelected ? 'Deselect All' : 'Select All' }}
                </button>
                <button @click="deleteSelected" class="action-btn delete-btn" :disabled="!hasSelection">
                  Delete Selected
                </button>
              </div>
              <ul class="notes-list">
                <li v-for="note in notes" :key="note._id">
                  <div class="note-item">
                    <input type="checkbox" :value="note._id" v-model="selectedNotes">
                    <button class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: note._id } })">
                      {{ note.note_name }}
                    </button>
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
            <h2>Flashcard sets</h2>
            <div v-if="flashcardNotes.length > 0">
              <ul class="notes-list">
                <!-- <li v-for="note in notes" :key="note._id">
                              
                                <button class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: note._id } })">
                                    {{ note.note_name }}
                                </button>
                            </li> -->
                <li v-for="note in flashcardNotes" :key="note._id">
                  <button class="note-btn" @click="$router.push({ name: 'FCPage', params: { id: note.flashcard_set_name } })">
                    {{ note.flashcard_set_name  }}
                  </button>


                </li>
              </ul>
            </div>
            <div v-else>
              <p>No flashcard sets available in this folder.</p>
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
  name: "FolderPage",
  components: {
    FlashnoteNavbar,
  },
  props: ["id"],
  data() {
    return {
      folderName: this.$route.params.id,
      notes: [],
      folders: [],
      userExists: false,
      userObject: {},
      selectedNotes: [],
      flashcards:[],
    };
  },
  computed: {
    flashcardNotes() {
      
      const uniqueSets = new Map();
      
      this.flashcards.forEach(note => {
        if (note.flashcard_set_name && !uniqueSets.has(note.flashcard_set_name)) {
          uniqueSets.set(note.flashcard_set_name, note);
        }
      });
      
      return Array.from(uniqueSets.values());
    },
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
      this.fetchNotes();
    },
  },
  mounted() {
    this.checkUserInSession();
    this.fetchNotes();
    this.fetchFolders();
    this.sideBarMethods();
  },
  methods: {
    async fetchNotes() {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user._id;
        const response = await axios.get(
          `http://localhost:8080/api/notes/${userId}/folder/${this.folderName}`
        );
        let onlyNotes = response.data;
        this.flashcards= onlyNotes.filter(note => note.note_format === 'flashcards' );
        onlyNotes= onlyNotes.filter(note => note.note_format !== 'flashcards' );
        this.notes = onlyNotes
        this.selectedNotes = []; // Reset selections when fetching new notes
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
            width: 300px;
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





</style>
