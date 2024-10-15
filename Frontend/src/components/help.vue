<template>
  <div class="help-container">
    <h1>How to Use FlashNote</h1>

    <section class="introduction">
      <h2>Introduction</h2>
      <p>
        Welcome to FlashNote! This guide will help you get started with using
        our application to create and manage your notes and flashcards
        efficiently.
      </p>
    </section>

    <section class="steps">
      <h2>Getting Started</h2>
      <ol>
        <li>
          <h3>Create an Account</h3>
          <p>
            Sign up for a new account by clicking on the "Sign Up" button on the
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
            Navigate to the "Create Note" section. Enter your note content and
            save it.
          </p>
        </li>
        <li>
          <h3>Create Flashcards</h3>
          <p>
            Go to the "Flashcards" section. Enter your questions and answers to
            create flashcards.
          </p>
        </li>
        <li>
          <h3>Organize Your Notes</h3>
          <p>
            Use folders to organize your notes and flashcards. You can create
            new folders and move items between them.
          </p>
        </li>
      </ol>
    </section>

    <section class="faq">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-item">
        <h3>How do I reset my password?</h3>
        <p>
          Click on the "Forgot Password" link on the login page and follow the
          instructions to reset your password.
        </p>
      </div>
      <div class="faq-item">
        <h3>Can I share my notes with others?</h3>
        <p>
          Currently, FlashNote does not support sharing notes directly. However,
          you can export your notes and share the exported files.
        </p>
      </div>
      <div class="faq-item">
        <h3>How do I delete a note or flashcard?</h3>
        <p>
          Navigate to the note or flashcard you want to delete and click on the
          "Delete" button.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "helpPage",
};
</script>
<style>
@import url(../assets/flashnote-styles.css);
</style>
