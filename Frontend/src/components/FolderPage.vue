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
                <router-link :to="{ name: 'ViewNotesPreview', params: { id: note._id } }">
                  {{ note.note_name }} <!-- Displaying the saved note name -->
                </router-link>
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
  import Navbar from './Navbar.vue';
  import axios from 'axios';
  
  export default {
    name: 'FolderPage',
    components: {
      Navbar
    },
    props: ['id'], // Accept the folder name or ID as a prop
    data() {
      return {
        folderName: this.id, // Initialize folderName from the route parameter
        notes: [], // Array to hold notes
        folders: [] // To populate the sidebar with folders
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
          const response = await axios.get(`http://localhost:8080/api/notes/${userId}/folder/${this.folderName}`);
          this.notes = response.data; // Assuming the API returns an array of notes
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      },
      async fetchFolders() {
        // Fetch folders to populate the sidebar
        const user = JSON.parse(sessionStorage.getItem("user"));
        try {
          const response = await axios.get(`http://localhost:8080/api/notes/folders/${user._id}`);
          this.folders = response.data;
        } catch (error) {
          console.error("Error fetching folders:", error);
          this.folders = [];
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
  }
  
  /* Sidebar styles like the homepage */
  .sidebar {
    width: 250px;
    background-color: #f4f4f4;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin-bottom: 10px;
    cursor: pointer;
  }
  
  .sidebar ul li:hover {
    background-color: #ddd;
  }
  
  .content {
    flex-grow: 1;
    padding: 20px;
  }
  
  .notes-list {
    list-style-type: none;
    padding: 0;
  }
  
  .notes-list li {
    padding: 10px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  p {
    color: #666;
  }
  </style>
  