<template>
    <nav class="flashnote-navbar">
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="#">Flashcards</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/create-account">Create Account</a></li>
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
    userExists: Boolean,
    userObject: Object
  },
  methods: {
    handleSignInOut() {
      if (this.userExists) {
        sessionStorage.removeItem('user');
        this.$emit('update:userExists', false);
        this.$emit('update:userObject', {});
      } else {
        window.location.href = '/sign-in';
      }
    }
  }
};
</script>
