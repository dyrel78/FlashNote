<template>
    <!-- Remove or comment out v-if check for userExists -->
    <div>
      <body id="flashcards-page">
        <!-- Navbar -->
        <FlashnoteNavbar 
          :userExists="userExists" 
          :userObject="userObject" 
          @update:userExists="userExists = $event" 
          @update:userObject="userObject = $event" 
        />
  
        <!-- Flashcards Content -->
        <div class="flashcards-main-content">
          <h1>Flashcards</h1>
          <p>Create and manage your flashcards below.</p>
  
          <div class="flashcards-container">
            <!-- Flashcard creation area -->
            <div class="flashcard-create-area">
              <h2>Create a New Flashcard</h2>
              <input type="text" v-model="newFlashcardFront" placeholder="Front of the card" />
              <input type="text" v-model="newFlashcardBack" placeholder="Back of the card" />
              <button @click="addFlashcard">Add Flashcard</button>
            </div>
  
            <!-- Flashcard display area -->
            <div class="flashcard-list">
              <h2>Your Flashcards</h2>
              <ul>
                <li v-for="flashcard in flashcards" :key="flashcard.id">
                  <div class="flashcard-item">
                    <p><strong>Front:</strong> {{ flashcard.front }}</p>
                    <p><strong>Back:</strong> {{ flashcard.back }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </body>
    </div>
    <!-- Remove the else case that redirects to login -->
  </template>
  
  <script>
  import FlashnoteNavbar from './Navbar.vue';
  
  export default {
    name: 'FlashcardsPage',
    components: {
      FlashnoteNavbar
    },
    data() {
      return {
        // Keep userExists and userObject but you won't be using them for now
        userExists: false,
        userObject: null,
        flashcards: [],
        newFlashcardFront: '',
        newFlashcardBack: ''
      };
    },
    // Comment out the checkUserInSession method and just handle frontend logic
    mounted() {
      // this.checkUserInSession(); // Comment this out
    },
    methods: {
      // Comment out checkUserInSession method
      // checkUserInSession() {
      //   const user = sessionStorage.getItem("user");
      //   if (!user) {
      //     window.location.href = "/sign-in";
      //   } else {
      //     this.userExists = true;
      //     this.userObject = JSON.parse(user);
      //   }
      // },
      addFlashcard() {
        if (this.newFlashcardFront && this.newFlashcardBack) {
          const newFlashcard = {
            id: Date.now(),
            front: this.newFlashcardFront,
            back: this.newFlashcardBack
          };
          this.flashcards.push(newFlashcard);
          this.newFlashcardFront = '';
          this.newFlashcardBack = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .flashcards-main-content {
    padding: 20px;
  }
  
  .flashcards-container {
    display: flex;
    gap: 20px;
  }
  
  .flashcard-create-area, .flashcard-list {
    width: 50%;
  }
  
  .flashcard-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
  }
  </style>
  