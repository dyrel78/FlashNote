<template>
  <div>
    <!-- Navigation bar imported from the homepage -->
    <Navbar />

    <div class="container">
      <!-- Sidebar like in the homepage -->
      <div class="sidebar">
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

      <!-- Main content area where the folder name and notes are displayed -->
      <div class="content">
        <h1>Folder: {{ folderName }}</h1>

        <!-- List of notes by their name -->
        <div v-if="notes.length > 0">
          <ul class="notes-list">
            <li v-for="note in notes" :key="note._id">
              <!-- Clicking on the Note Name navigates to the ViewNotesPreview page -->
               <!-- <router-link :to="{ name: 'ViewNotesPreview', params: { id: note._id } }"> -->
              
                <!-- Button to view the note -->
              <button class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: note._id } })">
                {{ note.note_name }}
              </button>

                <!-- Displaying the saved note name -->
              <!--</router-link>-->
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No notes available in this folder.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import axios from "axios";

export default {
  name: "FolderPage",
  components: {
    Navbar,
  },
  props: ["id"], // Accept the folder name or ID as a prop
  data() {
    return {
      folderName: this.id, // Initialize folderName from the route parameter
      notes: [], // Array to hold notes
      folders: [], // To populate the sidebar with folders
    };
  },
  created() {
    this.fetchNotes(); // Fetch notes when the component is created
    this.fetchFolders(); // Fetch folders for the sidebar
  },
  methods: {
    async fetchNotes() {
      try {
        // Get the current user's ID from the session or store
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user._id;

        // Replace with your actual backend API endpoint to fetch notes by folder and user
        const response = await axios.get(
          `http://localhost:8080/api/notes/${userId}/folder/${this.folderName}`
        );
        this.notes = response.data; // Assuming the API returns an array of notes
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    },
    async fetchFolders() {
      // Fetch folders to populate the sidebar
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
  },
};
</script>

<style>
@import url(../assets/will-style.css);
@import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
</style>


<style scoped>
/* Make sure the button has the same style as other buttons across the application */
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
</style>
