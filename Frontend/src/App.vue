<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <HomePage/>
</template>

<script>
import HomePage from './components/HomePage.vue';
//import future components here
import './assets/flashnote-styles.css';

export default {
  name: 'App',
  components: {
// Add future components here
    HomePage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>

<style  src="@/assets/flashnote-styles.css">
</style>