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
  
      <!-- Main content section -->
      <div class="main-content flashnote-container">
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
            <div class="flashcard-maincontainer" id="card1" @click="flipCard(1)">
              <div :class="['flashcard-thecard', { 'flashcard-flip': flippedCards.includes(1) }]">
                <div class="flashcard-thefront">Question 1: What is 2 + 2?</div>
                <div class="flashcard-theback">Answer: 4</div>
              </div>
            </div>
            <div class="flashcard-maincontainer" id="card2" style="display: none;" @click="flipCard(2)">
              <div :class="['flashcard-thecard', { 'flashcard-flip': flippedCards.includes(2) }]">
                <div class="flashcard-thefront">Question 2: What is the capital of France?</div>
                <div class="flashcard-theback">Answer: Paris</div>
              </div>
            </div>
            <div class="flashcard-maincontainer" id="card3" style="display: none;" @click="flipCard(3)">
              <div :class="['flashcard-thecard', { 'flashcard-flip': flippedCards.includes(3) }]">
                <div class="flashcard-thefront">Question 3: What is the boiling point of water?</div>
                <div class="flashcard-theback">Answer: 100°C</div>
              </div>
            </div>
          </div>
  
          <!-- Navigation buttons -->
          <div class="flashcard-navigation">
            <button id="prevBtn" @click="previousCard">Previous</button>
            <span id="cardIndicator">{{ currentCard }} / {{ totalCards }}</span>
            <button id="nextBtn" @click="nextCard">Next</button>
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
        flippedCards: [],
      };
    },
    mounted() {
      this.checkUserInSession();
      this.updateCardDisplay();
      this.setupSidebarToggle();
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
          card.style.display = i === this.currentCard ? 'block' : 'none';
        }
        document.getElementById('cardIndicator').innerText = `${this.currentCard} / ${this.totalCards}`;
      },
      nextCard() {
        this.currentCard = this.currentCard < this.totalCards ? this.currentCard + 1 : 1;
        this.updateCardDisplay();
      },
      previousCard() {
        this.currentCard = this.currentCard > 1 ? this.currentCard - 1 : this.totalCards;
        this.updateCardDisplay();
      },
      flipCard(cardNumber) {
        if (this.flippedCards.includes(cardNumber)) {
          this.flippedCards = this.flippedCards.filter((num) => num !== cardNumber);
        } else {
          this.flippedCards.push(cardNumber);
        }
      },
      setupSidebarToggle() {
        const btn = document.getElementById('btn');
        const sidebar = document.querySelector('.sidebar');
        btn.onclick = function () {
          sidebar.classList.toggle('active');
        };
      },
    },
  };
  </script>
  
  <style scoped>
  @import "../assets/flashnote-styles.css";
  
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
    width: 70%; /* Increased width */
    height: 70%; /* Increased height */
    max-width: 900px;
    max-height: 650px;
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