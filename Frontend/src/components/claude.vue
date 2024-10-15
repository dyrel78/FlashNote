<template>
  <div class="container">
    <!-- ... (previous code remains unchanged) ... -->

    <div class="flashnote-container main-content">
      <!-- ... (previous code remains unchanged) ... -->

      <div class="right-content-pane">
        <h2>Flashcard</h2>
        <div class="flashcard-page-body">
          <div class="flashcard-container" id="cardContainer" v-if="flashcards.length > 0">
            <div class="flashcard-maincontainer" @click="flipCard(currentCard)">
              <div :class="['flashcard-thecard', { 'flashcard-flip': flippedCards.includes(currentCard) }]">
                <div class="flashcard-thefront">{{ flashcards[currentCard - 1].question }}</div>
                <div class="flashcard-theback">{{ flashcards[currentCard - 1].answer }}</div>
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
      flashcards: [],
      currentCard: 1,
      flippedCards: [],
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
  },
  methods: {
    async fetchFlashcards() {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user._id;
        const response = await axios.get(
          `http://3.217.34.111:8080/api/notes/${userId}/${this.flashcard_set_name}`
        );
        this.flashcards = response.data.map(flashcard => ({
          ...flashcard,
          question: flashcard.note_name,
          answer: flashcard.note_content
        }));
        console.log(this.flashcards);
        this.currentCard = 1;
        this.flippedCards = [];
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    },
    // ... (other existing methods remain unchanged) ...
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
  },
};
</script>

<style>
@import url(../assets/flashnote-styles.css);
@import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
</style>
