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
          <div id="notes-list-pane-id" :class="['notes-list-pane', { 'hidden': !isNotesListVisible }]">
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
            <button @click="toggleNotesListPane">{{ isNotesListVisible ? 'Hide Notes List' : 'Show Notes List' }}</button> 

            <div class="flashcard-page-body">
       <div class="flashcard-container" id="cardContainer" v-if="flashcards.length > 0">
        <div class="flashcard-maincontainer" @click="flipCard(currentCard)">
            <div :class="['flashcard-thecard', { 'flashcard-flip': flippedCards.includes(currentCard) }]">
              <div v-html=" flashcards[currentCard - 1].question" class="flashcard-thefront"></div>
              <div   v-html=" flashcards[currentCard - 1].answer" class="flashcard-theback"></div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No flashcards available in this set.</p>
        </div>


       

        <!-- Navigation buttons -->
        <div class="flashcard-navigation" v-if="flashcards.length > 0">
          <button id="prevBtn" @click="previousCard" :disabled="currentCard === 1">Previous</button>
          <span id="cardIndicator">{{ currentCard }} / {{ totalCards }}</span>
          <button id="nextBtn" @click="nextCard" :disabled="currentCard === totalCards">Next</button>
        </div>
  
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
      
      currentCard: 1,
      flippedCards: [],
      isNotesListVisible: true,
    };
  },
  computed: {
    totalCards() {
    return this.flashcards.length;
  },
    allSelected() {
      return this.flashcards.length > 0 && this.selectedNotes.length === this.flashcards.length;
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
    this.checkMediaQuery();
    window.addEventListener('resize', this.checkMediaQuery);
    window.addEventListener('keydown', this.handleKeyDown);
    // this.updateCardDisplay();

  },beforeUnmount() {
window.removeEventListener('resize', this.checkMediaQuery);
window.removeEventListener('keydown', this.handleKeyDown);

},
  methods: {
    // async fetchFlashcards() {
    //   try {
    //     const user = JSON.parse(sessionStorage.getItem("user"));
    //     const userId = user._id;
    //     console.log(this.flashcard_set_name)
    //     console.log(userId)
    //     const response = await axios.get(
    //       `http://localhost:8080/api/notes/${userId}/${this.flashcard_set_name}`
    //     );
    //     // console.log(response.data)
    //     // These lines below are bnew
    //     this.flashcards = response.data.map(flashcard => ({
    //     ...flashcard,
    //     question: flashcard.note_name,
    //     answer: flashcard.note_content
    //   }));          console.log(this.flashcards);
    //     // return onlyNotes
    //   } catch (error) {
    //     console.error("Error fetching notes:", error);
    //   }
    // },
    handleKeyDown(event) {
      switch(event.key) {
        case 'ArrowLeft':
          this.previousCard();
          break;
        case 'ArrowRight':
          this.nextCard();
          break;
        case ' ': // Space key
          event.preventDefault(); // Prevent scrolling
          this.flipCard(this.currentCard);
          break;
      }
    },


    toggleNotesListPane() {
this.isNotesListVisible = !this.isNotesListVisible;
},
checkMediaQuery() {
const mediaQuery = window.matchMedia('(max-width: 1000px)');
this.isNotesListVisible = !mediaQuery.matches;
},
    async fetchFlashcards() {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userId = user._id;
      const response = await axios.get(
        `http://localhost:8080/api/notes/${userId}/${this.flashcard_set_name}`
      );
      this.flashcards = response.data.map(flashcard => ({
        ...flashcard,
        question: flashcard.note_name,
        answer: flashcard.answer
      }));
      console.log(this.flashcards);
      this.currentCard = 1;
      this.flippedCards = [];
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  },
  // ..
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
          `http://3.217.34.111:8080/api/notes/folders/${user._id}`
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
        this.selectedNotes = this.flashcards.map(note => note._id);
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
            await axios.delete(`http://3.217.34.111:8080/api/notes/${noteId}`);
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
    },updateCardDisplay() {
      for (let i = 1; i <= this.totalCards; i++) {
        const card = document.getElementById('card' + i);
        card.style.display = i === this.currentCard ? 'block' : 'none';
      }
      document.getElementById('cardIndicator').innerText = `${this.currentCard} / ${this.totalCards}`;
    },
    nextCard() {
    if (this.currentCard < this.totalCards) {
      this.currentCard++;
    }
  },
  previousCard() {
    if (this.currentCard > 1) {
      this.currentCard--;
    }
  },
  flipCard(cardNumber) {
    if (this.flippedCards.includes(cardNumber)) {
      this.flippedCards = this.flippedCards.filter((num) => num !== cardNumber);
    } else {
      this.flippedCards.push(cardNumber);
    }
  },
    // nextCard() {
    //   this.currentCard = this.currentCard < this.totalCards ? this.currentCard + 1 : 1;
    //   this.updateCardDisplay();
    // },
    // previousCard() {
    //   this.currentCard = this.currentCard > 1 ? this.currentCard - 1 : this.totalCards;
    //   this.updateCardDisplay();
    // },
    // flipCard(cardNumber) {
    //   if (this.flippedCards.includes(cardNumber)) {
    //     this.flippedCards = this.flippedCards.filter((num) => num !== cardNumber);
    //   } else {
    //     this.flippedCards.push(cardNumber);
    //   }
    // },
    
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
/* .two-pane-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
}
.notes-list-pane {
    width: 400px;
    overflow-y: auto;
    border-right: 1px solid #ccc;
    padding: 20px;
    transition: opacity 0.3s ease, max-width 0.3s ease;

}
.notes-list-pane.hidden {
opacity: 0;
max-width: 0;
} */
.two-pane-container {
display: flex;
gap: 20px;
flex-grow: 1;
overflow: hidden;
}

.notes-list-pane {
flex: 1;
transition: opacity 0.3s ease, max-width 0.3s ease;
opacity: 1;
max-width: 100%;
overflow: hidden;
padding: 20px;

border-right: 1px solid #ccc;

}

.notes-list-pane.hidden {
opacity: 0;
max-width: 0;
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
/* @media screen and (max-width:1000px){
  .notes-list-pane{
    display: none;
  }
} */
 
@media screen and (max-width: 1000px) {
.two-pane-container {
  flex-direction: column;
  align-items: center; /* Center children horizontally */
}

.notes-list-pane {
  max-width: 100%;
  width: 100%; /* Ensure full width when visible */
}

.notes-list-pane.hidden {
  display: none;
}

.right-content-pane {
  width: 100%; /* Full width to allow proper centering of content */
  max-width: 600px; /* Limit maximum width for readability */
  padding: 0 20px; /* Add some padding on smaller screens */
  box-sizing: border-box; /* Ensure padding is included in width calculation */
}

.toggle-notes-btn {
  display: block;
  margin: 0 auto 20px; /* Center the button and add some bottom margin */
}

/* Center the flashcard content */
.flashcard-page-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flashcard-thecard{
  width:100%;
}

/* Ensure the flashcard container is centered and responsive */
.flashcard-container {
  width: 100%;
  max-width: 100%; /* Adjust this value as needed */
}
}


.two-pane-container {
  display: flex;
  justify-content: space-between;
}

.notes-list-pane, .right-content-pane {
  width: 48%;
}
.flashcard-page-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  margin: 0;
}

.flashcard-container {
  position: relative;
  width: 70%; /* Increased width */
  height: 70%; /* Increased height */
  /* max-width: 900px; */
  /* max-height: 650px; */
  max-width: 700px;
  max-height: 450px;
  perspective: 1000px;
  margin-bottom: 20px; /* Ensure some space below the card for buttons */
}

.flashcard-maincontainer {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.flashcard-thecard {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.flashcard-thefront, .flashcard-theback {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Ensure that the back side isn't visible when it flips */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px; /* Increased font size */
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-align: center;
  padding: 20px; /* Added padding for better text layout */
  border-radius: 20px; /* Apply rounded corners to both sides */
}

.flashcard-theback{
  font-size: 25px;
}

.flashcard-thefront {
  background-color: #c3d3f0;
  color: #333;
}

.flashcard-theback {
  background-color: #fff5ba;
  color: #333;
  transform: rotateY(180deg);
}

/* Flip the card when clicked */
.flashcard-flip {
  transform: rotateY(180deg);
}

/* Ensure the navigation is placed below the card */
.flashcard-navigation {
  display: flex;
  justify-content: space-between;
  width: 70%; /* Match the width of the card */
  max-width: 500px; /* Match the width of the card */
  font-family: Arial, sans-serif;
  margin-top: 20px; /* Add some space above the buttons */
}

.flashcard-navigation button {
  padding: 10px 20px;
  font-size: 16px; /* Adjusted button font size */
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

.flashcard-navigation button:hover {
  background-color: #0056b3;
}

.flashcard-indicator {
  display: flex;
  align-items: center;
  font-size: 16px; /* Increased indicator font size */
}

</style>
