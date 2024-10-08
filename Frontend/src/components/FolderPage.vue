<template>


    <div class="container">
      <!-- Sidebar like in the homepage -->
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
      <!-- Main content area where the folder name and notes are displayed -->
      <div class="content">
        <h1>Folder: {{ folderName }}</h1>

        <!-- List of notes by their name -->
        <div class="two-pane-container">
                <!-- Left pane: Notes list -->
                <div class="notes-list-pane">
                    <h2>Folder: {{ folderName }}</h2>
                    <div v-if="notes.length > 0">
                        <ul class="notes-list">
                            <li v-for="note in notes" :key="note._id">
                                <button class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: note._id } })">
                                    {{ note.note_name }}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>No notes available in this folder.</p>
                    </div>
                </div>

                <!-- Right pane: Content area -->
                <div class="right-content-pane">
                    <!-- This is where you can add the content for the selected note or any other relevant information -->
                    <h2>Flashcard sets</h2>
                    <div v-if="notes.length > 0">
                        <ul class="notes-list">
                            <!-- <li v-for="note in notes" :key="note._id">
                              
                                <button class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: note._id } })">
                                    {{ note.note_name }}
                                </button>
                            </li> -->
                            <li v-for="note in flashcardNotes" :key="note._id">
                          <button class="note-btn" @click="$router.push({ name: 'ViewNotesPreview', params: { id: note._id } })">
                              {{ note.note_name }}
                          </button>
                </li>

                        </ul>
                    </div>

                    
                    <div v-else>
                        <p>No notes available in this folder.</p>
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
// import  { all } from "axios";

export default {
  name: "FolderPage",
  components: {
    FlashnoteNavbar,
  },
  props: ["id"], // Accept the folder name or ID as a prop
  data() {
    return {
      folderName: this.id, // Initialize folderName from the route parameter
      notes: [], // Array to hold notes
      folders: [], // To populate the sidebar with folders
      userExists: false,
      userObject: {},
    };
  },
  mounted() {
    this.checkUserInSession();
    this.fetchNotes(); // Fetch notes when the component is created
    this.fetchFolders(); // Fetch folders for the sidebar
    this.sideBarMethods();

  },  computed: {
    flashcardNotes() {
      const flashcards = this.notes.filter(note => note.note_format === 'flashcards');
      const uniqueSets = new Map();
      
      flashcards.forEach(note => {
        if (note.flashcard_set_name && !uniqueSets.has(note.flashcard_set_name)) {
          uniqueSets.set(note.flashcard_set_name, note);
        }
      });
      
      return Array.from(uniqueSets.values());
    }
  
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
    async sideBarMethods() {
      let btn = document.querySelector("#btn");
      let sidebar = document.querySelector(".sidebar");

      btn.onclick = function () {
        sidebar.classList.toggle("active");
      };
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
