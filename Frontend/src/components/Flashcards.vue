<template>
  <div class="container">
    <!-- Sidebar -->
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
          <a href="#">
            <i class="bx bx-folder"></i>
            <span class="nav-item">{{ folder }}</span>
          </a>
          <span class="tooltip">{{ folder }}</span>
        </li>
      </ul>
    </div>

    <!-- Main content -->
    <div class="flashnote-container main-content">
      <!-- Navbar -->
      <FlashnoteNavbar
        :userExists="userExists"
        :userObject="userObject"
        @update:userExists="userExists = $event"
        @update:userObject="userObject = $event"
      />

      <!-- Flashcards Section -->
      <div class="flashcard-page-body">
        <div class="flashcard-container" id="cardContainer">
          <div class="flashcard-maincontainer" id="card1">
            <div class="flashcard-thecard">
              <div class="flashcard-thefront">Question 1: What is 2 + 2?</div>
              <div class="flashcard-theback">Answer: 4</div>
            </div>
          </div>
          <div class="flashcard-maincontainer" id="card2" style="display: none;">
            <div class="flashcard-thecard">
              <div class="flashcard-thefront">Question 2: What is the capital of France?</div>
              <div class="flashcard-theback">Answer: Paris</div>
            </div>
          </div>
          <div class="flashcard-maincontainer" id="card3" style="display: none;">
            <div class="flashcard-thecard">
              <div class="flashcard-thefront">Question 3: What is the boiling point of water?</div>
              <div class="flashcard-theback">Answer: 100°C</div>
            </div>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="flashcard-navigation">
          <button id="prevBtn">Previous</button>
          <span id="cardIndicator">1 / 3</span>
          <button id="nextBtn">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FlashnoteNavbar from './Navbar.vue';

export default {
  name: 'FlashcardsPage',
  components: {
    FlashnoteNavbar,
  },
  data() {
    return {
      userExists: false,
      userObject: {},
      folders: ['Folder 1', 'Folder 2', 'Folder 3'], // Sample folders
      currentCard: 1,
      totalCards: 3,
    };
  },
  mounted() {
    this.checkUserInSession();
    this.updateCardDisplay();
    this.setupNavigation();
  },
  methods: {
    checkUserInSession() {
      const user = sessionStorage.getItem('user');
      if (user) {
        this.userExists = true;
        this.userObject = JSON.parse(user);
      } else {
        this.userExists = false;
      }
    },
    updateCardDisplay() {
      for (let i = 1; i <= this.totalCards; i++) {
        const card = document.getElementById('card' + i);
        if (i === this.currentCard) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      }
      document.getElementById('cardIndicator').innerText = `${this.currentCard} / ${this.totalCards}`;
    },
    setupNavigation() {
      document.getElementById('nextBtn').addEventListener('click', () => {
        this.currentCard = this.currentCard < this.totalCards ? this.currentCard + 1 : 1;
        this.updateCardDisplay();
      });
      document.getElementById('prevBtn').addEventListener('click', () => {
        this.currentCard = this.currentCard > 1 ? this.currentCard - 1 : this.totalCards;
        this.updateCardDisplay();
      });
    },
  },
};
</script>

<style scoped>
@import "../assets/will-style.css";

/* Flashcards specific styles */
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
  width: 250px;
  height: 320px;
  perspective: 1000px;
  margin-bottom: 20px; /* Ensure some space below the card for buttons */
}

.flashcard-maincontainer {
  position: relative;
  width: 250px;
  height: 320px;
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
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.flashcard-thefront {
  background-color: #ffc728;
  color: #333;
}

.flashcard-theback {
  background-color: #fafafa;
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
  width: 250px;
  font-family: Arial, sans-serif;
  margin-top: 20px; /* Add some space above the buttons */
}

.flashcard-navigation button {
  padding: 10px 15px;
  font-size: 14px;
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
}
</style>
