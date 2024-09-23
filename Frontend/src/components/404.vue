<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/">
        <button class="go-home-btn">Go Back Home</button>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundPage'
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background-color: #FFFDF7; /* Light background color */
  }
  
  .not-found h1 {
    font-size: 6rem;
    margin: 0;
    color: #FDC921; /* Primary Yellow */
  }
  
  .not-found p {
    font-size: 1.5rem;
    margin: 20px 0;
    color: #6798C0; /* Accent blue for text */
  }
  
  .go-home-btn {
    background-color: #99D6EA; /* Button background */
    color: #FFFDF7; /* Button text color */
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .go-home-btn:hover {
    background-color: #6798C0; /* Darker button color on hover */
  }
  </style>
  