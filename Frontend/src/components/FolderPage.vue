<template>
  <div>
    <!-- Navigation bar imported from existing components -->
    <Navbar />
    <div class="folder-page-container">
      <!-- Sidebar directly added here as part of FolderPage -->
      <div class="sidebar">
        <ul>
          <li
            v-for="folder in folders"
            :key="folder.id"
            @click="navigateToFolder(folder.id)"
          >
            <span>{{ folder.name }}</span>
          </li>
        </ul>
      </div>

      <div class="folder-content">
        <h1>{{ folderName }}</h1>
        <div v-if="files.length > 0" class="file-list">
          <div v-for="file in files" :key="file._id" class="file-item">
            <span @click="viewFile(file)">{{ file.name }}</span>
            <button @click="removeFile(file._id)">Remove</button>
          </div>
        </div>
        <div v-else>
          <p>No files in this folder.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";

export default {
  name: "FolderPage",
  components: {
    Navbar,
  },
  data() {
    return {
      folderName: "", // Can fetch this dynamically
      files: [], // Files in the folder
      folders: [], // List of folders for the sidebar
    };
  },
  methods: {
    viewFile(file) {
      // Navigate to the preview component
      this.$router.push({ name: "ViewNotesPreview", params: { id: file._id } });
    },
    async removeFile(fileId) {
      // Remove file by calling an API
      try {
        await this.$http.delete(`/api/notes/${fileId}`);
        this.files = this.files.filter((file) => file._id !== fileId);
      } catch (error) {
        console.error("Failed to remove file", error);
      }
    },
    async fetchFiles() {
      // Fetch files via API call
      try {
        const folderId = this.$route.params.id;
        const response = await this.$http.get(`/api/notes/folder/${folderId}`);
        this.files = response.data;
      } catch (error) {
        console.error("Error fetching files", error);
      }
    },
    async fetchFolders() {
      // Fetch folders for the sidebar
      try {
        const userId = this.$store.state.user.id;
        const response = await this.$http.get(`/api/notes/folders/${userId}`);
        this.folders = response.data;
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    },
    navigateToFolder(folderId) {
      // Navigate to another folder
      this.$router.push({ path: `/folder/${folderId}` });
    },
  },
  created() {
    // Check if user is logged in before fetching
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push({ path: "/sign-in" });
    } else {
      this.fetchFiles();
      this.fetchFolders(); // Load folders for sidebar
    }
  },
};
</script>

<style scoped>
.folder-page-container {
  display: flex;
}

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

.folder-content {
  flex-grow: 1;
  padding: 20px;
}

.file-list {
  display: flex;
  flex-direction: column;
}

.file-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
