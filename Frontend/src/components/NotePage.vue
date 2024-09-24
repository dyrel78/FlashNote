
  <template>
    <div v-if="userExists">
      <body id="view-notes-preview">
        <!-- <div class="flashnote-container"></div> -->
          <!-- Navbar -->
      <FlashnoteNavbar 
        :userExists="userExists" 
        :userObject="userObject" 
        @update:userExists="userExists = $event" 
        @update:userObject="userObject = $event" 
      />
  
          <!-- Main content -->
          <div class="flashnote-main-content">
            <!-- Left Column for Folders -->
            <div class="flashnote-left-column">
              <div class="flashnote-folders">
                <h2>My Notes</h2>
                <ul>
                  <li v-for="note in notes" :key="note.id">
                    <a href="#">{{ note.title }}</a>
                    <span class="flashnote-date">{{ note.date }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="note-page">
      <h1>View Note</h1>
  
      <!-- Display note details -->
      <!-- <div v-if="noteObject">
        <h2>{{ noteObject.note_name }}</h2>
        <p><strong>Format:</strong> {{ noteObject.note_format }}</p>
        <p><strong>Content:</strong></p>
        <pre>{{ noteObject.note_content }}</pre>
      </div>
      <div v-else>
        <p>Loading note...</p>
      </div>
    </div> -->
            <!-- Right Column for Expanded Note Output -->
            <div class="flashnote-right-column">
              <div class="flashnote-note-area">
                <h1>View Notes Preview</h1> <!-- Page title added -->
                <h2>Note Output</h2>
                <p>Your expanded notes are shown below.</p>
  
                <div class="flashnote-content">
                  <div class="flashnote-note-output">
                    <div style="white-space: pre-wrap; word-wrap: break-word; max-width: 100%; overflow-x: auto;">
                      <pre class="preformatted">{{ outputText }}</pre>
                    </div>
                  </div>

                </div>
  
                <!-- Save Button at the bottom -->
                <button v-if="userExists" class="flashnote-save-note" @click="saveNote">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
    <div v-else>
      <p>Redirecting to login...</p>
    </div>
  </template>
  <script>
  import axios from 'axios';
  import FlashnoteNavbar from './Navbar.vue';
  
  export default {
    name: 'NotePage',
    components: {
    FlashnoteNavbar  // Register FlashnoteNavbar component here
  },
    data() {
      return {
        noteObject: null,
        outputText: "",
        userExists: false,
        userObject: "",

      };
    },
    mounted() {

      this.checkUserInSession();
        this.created();
        this.getNote();
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
    async checkUserInSession() {
      const user = sessionStorage.getItem("user");
      if (!user) {
        // If the user does not exist, redirect to sign-in page
        window.location.href = "/sign-in";
      } else {
        this.userExists = true;
        this.userObject = JSON.parse(user);
      }
    },
    async getNote(){
             try {
        // Fetch the saved note by ID, replace `NOTE_ID` with actual note ID (can be passed via route params)
        const response = await axios.get('/api/notes/NOTE_ID');
        this.note = response.data;
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    },
  };
  </script>
  
  <style scoped>
  .note-page {
    margin: 20px;
  }
  
  pre {
    background-color: #f8f8f8;
    padding: 10px;
    white-space: pre-wrap;
  }
  </style>
  