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
  
<style>
@import url(../assets/flashnote-styles.css);
</style>
  