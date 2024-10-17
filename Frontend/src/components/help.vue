<template>
  <div class="help-container">
    <FlashnoteNavbar
      :userExists="userExists"
      :userObject="userObject"
      @update:userExists="userExists = $event"
      @update:userObject="userObject = $event"
    />
    <h1>How to Use FlashNote</h1>

    <section class="introduction">
      <h2>Introduction</h2>
      <p>
        Welcome to FlashNote! This guide will help you get started with using
        our application to efficiently create and manage your notes and
        flashcards.
      </p>
    </section>

    <section class="steps">
      <h2>Getting Started</h2>
      <ol>
        <li>
          <h3>Create an Account</h3>
          <p>
            Sign up for a new account by clicking the "Sign Up" button on the
            homepage. Fill in your details and submit the form.
          </p>
        </li>
        <li>
          <h3>Log In</h3>
          <p>Log in to your account using your email and password.</p>
        </li>
        <li>
          <h3>Create a New Note</h3>
          <p>
            On the homepage, you can create a new note by either copying and
            pasting your content or uploading a document by clicking "Upload
            PDF." Then, select the format for your note and click the "Create
            Note" button to generate it.
          </p>
        </li>
        <li>
          <h3>Save Notes</h3>
          <p>
            Once you're satisfied with your note, click the "Save Note" button
            to save it. You can also organize your notes by selecting a folder
            to store them in.
          </p>
        </li>
        <li>
          <h3>View Notes</h3>
          <p>
            To view your notes, click on the desired folder. You can access
            either your set of flashcards, which you can practice using our
            interactive flashcard display system, or the full note, with options
            to view, edit, or delete them.
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>

<script>
import FlashnoteNavbar from "./Navbar.vue";
export default {
  name: "helpPage",
  components: {
    FlashnoteNavbar, // Register FlashnoteNavbar component here
  },
};
</script>

<style scoped>
.help-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

h2 {
  color: #555;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 15px;
}

h3 {
  color: #666;
  margin-top: 15px;
}

p {
  color: #777;
  line-height: 1.6;
}

ol {
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}

.introduction,
.steps {
  margin-bottom: 30px;
}
</style>
