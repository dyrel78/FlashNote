<template>
  <nav class="flashnote-navbar">
    <ul>
      <li><a href="/home">Home</a></li>
      <li v-if="userExists">
        <a href="/profile">Profile</a>
      </li>
      <li v-else>
        <a href="/create-account">Create Account</a>
      </li>
      <li v-if="userExists">
        <a @click="handleSignInOut">Sign Out</a>
      </li>
      <li v-else>
        <a href="/sign-in">Sign In</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'FlashnoteNavbar',
  props: {
    userExists: Boolean
  },
  methods: {
    handleSignInOut() {
      if (this.userExists) {
        sessionStorage.removeItem('user');
        this.$emit('update:userExists', false);
      } else {
        window.location.href = '/sign-in';
      }
    }
  }
};
</script>

<style scoped>
.flashnote-navbar ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

.flashnote-navbar ul li {
  display: inline-block;
}

.flashnote-navbar ul li a {
  text-decoration: none;
  color: black;
  transition: color 0.2s ease;
}

.flashnote-navbar ul li a:hover {
  color: white;
}
</style>
