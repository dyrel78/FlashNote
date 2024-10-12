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
        <h1>{{ folderName }}</h1>

        <div class="two-pane-container">
          <!-- Left pane: Notes list -->
          <div class="notes-list-pane">
            <h2 style="padding-bottom: 10px">{{ folderName }} Notes</h2>
            <div v-if="notes.length > 0">
              <div style="padding-bottom: 10px" class="mass-action-controls">
                <button @click="toggleSelectAll" class="action-btn">
                  {{ allSelected ? "Deselect All" : "Select All" }}
                </button>
                <button
                  @click="deleteSelected"
                  class="action-btn delete-btn"
                  :disabled="!hasSelection"
                >
                  Delete Selected
                </button>
              </div>
              <ul class="notes-list">
                <li v-for="note in notes" :key="note._id">
                  <div class="note-item">
                    <input
                      type="checkbox"
                      :value="note._id"
                      v-model="selectedNotes"
                    />
                    <button
                      class="note-btn"
                      @click="
                        $router.push({
                          name: 'ViewNotesPreview',
                          params: { id: note._id },
                        })
                      "
                    >
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

          <div class="right-content-pane">
            <h2>Flashcard Sets</h2>
            <div v-if="flashcardNotes.length > 0">
              <!-- Mass action controls for flashcards -->
              <div style="padding-bottom: 10px" class="mass-action-controls">
                <button @click="toggleSelectAllFlashcards" class="action-btn">
                  {{ allSelectedFlashcards ? "Deselect All" : "Select All" }}
                </button>
                <button
                  @click="deleteSelectedFlashcards"
                  class="action-btn delete-btn"
                  :disabled="!hasSelectionFlashcards"
                >
                  Delete Selected
                </button>
              </div>

              <!-- List of flashcards with checkboxes for selection -->
              <ul class="notes-list">
                <li v-for="note in flashcardNotes" :key="note._id">
                  <div class="note-item">
                    <!-- Checkbox for selecting flashcards -->
                    <input
                      type="checkbox"
                      :value="note._id"
                      v-model="selectedFlashcards"
                    />
                    <button
                      class="note-btn"
                      @click="
                        $router.push({
                          name: 'FCPage',
                          params: { id: note.flashcard_set_name },
                        })
                      "
                    >
                      {{ note.flashcard_set_name }}
                    </button>
                  </div>
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
import Swal from "sweetalert2";

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
      selectedFlashcards: [], // state for selected flashcards
      flashcards: [],
    };
  },
  computed: {
    flashcardNotes() {
      const uniqueSets = new Map();

      this.flashcards.forEach((note) => {
        if (
          note.flashcard_set_name &&
          !uniqueSets.has(note.flashcard_set_name)
        ) {
          uniqueSets.set(note.flashcard_set_name, note);
        }
      });

      return Array.from(uniqueSets.values());
    },
    allSelected() {
      return (
        this.notes.length > 0 && this.selectedNotes.length === this.notes.length
      );
    },
    hasSelection() {
      return this.selectedNotes.length > 0;
    },

    // Computed properties for flashcards selection
    allSelectedFlashcards() {
      return (
        this.flashcardNotes.length > 0 &&
        this.selectedFlashcards.length === this.flashcardNotes.length
      );
    },
    hasSelectionFlashcards() {
      return this.selectedFlashcards.length > 0;
    },
  },
  watch: {
    $route(to) {
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
        this.flashcards = onlyNotes.filter(
          (note) => note.note_format === "flashcards"
        );
        onlyNotes = onlyNotes.filter(
          (note) => note.note_format !== "flashcards"
        );
        this.notes = onlyNotes;
        this.selectedNotes = []; // Reset selections when fetching new notes
        this.selectedFlashcards = []; // Reset flashcard selections
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
        this.selectedNotes = this.notes.map((note) => note._id);
      }
    },

    // Methods for flashcards select and delete actions
    toggleSelectAllFlashcards() {
      if (this.allSelectedFlashcards) {
        this.selectedFlashcards = [];
      } else {
        this.selectedFlashcards = this.flashcardNotes.map((note) => note._id);
      }
    },
    async deleteSelectedFlashcards() {
      if (this.selectedFlashcards.length === 0) return;

      // Log the selected flashcards to ensure the correct IDs are selected
      console.log("Selected flashcards for deletion:", this.selectedFlashcards);

      // SweetAlert2 confirmation dialog
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete ${this.selectedFlashcards.length} selected flashcard set(s). This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            for (const flashcardId of this.selectedFlashcards) {
              const flashcardSetName = this.flashcards.find(note => note._id === flashcardId).flashcard_set_name;

              // Make the API call to delete the flashcard
              await axios.delete(`http://localhost:8080/api/notes/flashcards/set/${flashcardSetName}`);
            }

            // Remove deleted flashcards from the local array
            this.flashcards = this.flashcards.filter(
              (note) => !this.selectedFlashcards.includes(note._id.toString())
            );
            this.selectedFlashcards = []; // Clear selections
            // Optionally refetch notes to ensure the latest state
            await this.fetchNotes();

            // SweetAlert2 success dialog
            Swal.fire(
              "Deleted!",
              "Your flashcards have been deleted.",
              "success"
            );
          } catch (error) {
            console.error("Error deleting flashcards:", error);

            // SweetAlert2 error dialog
            Swal.fire(
              "Error",
              "An error occurred while deleting flashcards. Please try again.",
              "error"
            );
          }
        }
      });
    },

    async deleteSelected() {
      if (this.selectedNotes.length === 0) return;

      // SweetAlert2 confirmation dialog
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete ${this.selectedNotes.length} selected note(s). This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            for (const noteId of this.selectedNotes) {
              await axios.delete(`http://localhost:8080/api/notes/${noteId}`);
            }

            // Remove deleted notes from the local array
            this.notes = this.notes.filter(
              (note) => !this.selectedNotes.includes(note._id)
            );
            this.selectedNotes = []; // Clear selections

            // SweetAlert2 success dialog
            Swal.fire("Deleted!", "Your notes have been deleted.", "success");
          } catch (error) {
            console.error("Error deleting notes:", error);

            // SweetAlert2 error dialog
            Swal.fire(
              "Error",
              "An error occurred while deleting notes. Please try again.",
              "error"
            );
          }
        }
      });
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
  overflow: 100%;
}
.notes-list-pane,
.right-content-pane {
  flex: 1; /* Both panes will take up equal space */
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 10px; /* Add some space between the two panes */
}

.notes-list-pane {
  /*width: 300px;*/
  overflow-y: auto;
  border-right: 1px solid #ccc;
}
.right-content-pane {
  overflow-y: auto;
}

/*Make sure the content inside both panes is well spaced */
.notes-list li,
.flashcard-list li {
  padding: 12px;
  background-color: #f0f0f0;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.notes-list li:hover,
.flashcard-list li:hover {
  background-color: #e0e0e0;
}
</style>
