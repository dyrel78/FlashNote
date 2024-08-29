<template>

  <body>
    <h1>Create Account</h1>
    <link rel="stylesheet" href="..\assets\noteable-styles.css">

    <!-- Form Container -->
    <link rel="stylesheet" href="..\assets\noteable-styles.css">
    <form action="/submit-account" method="post">
      <div>
        <!-- First Name -->
        <label for="user-name">Username:</label>
        <input type="text" id="user-name" name="user-name" required />
      </div>
      <div>
        <!-- First Name -->
        <label for="first-name">First Name:</label>
        <input type="text" id="first-name" name="first-name" required />
      </div>
      <div>
        <!-- Last Name -->
        <label for="last-name">Last Name:</label>
        <input type="text" id="last-name" name="last-name" required />
      </div>
      <div>
        <!-- Email -->
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div>
        <!-- Password -->
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div>
        <!-- Confirm Password -->
        <label for="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
        />
      </div>
      <div>
        <!-- Create Account Button -->
        <button type="submit">Create Account</button>
      </div>
    </form>
  </body>

</template>

<script>
export default {
  name: 'CreateAccount',
}
</script>

<style> 


body, html {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
}

.noteable-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.noteable-navbar {
    background-color: #333;
    color: white;
    padding: 1rem;
}

.noteable-navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-around;
}

.noteable-navbar ul li {
    display: inline;
}

.noteable-navbar ul li a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
}

.noteable-main-content {
    display: flex;
    flex: 1;
}

.noteable-left-column {
    width: 20%;
    background-color: #e8e8e8;
    padding: 1rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.noteable-folders h2 {
    font-size: 1.5rem;
}

.noteable-add-folder {
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 0.5rem;
    margin: 1rem 0;
    cursor: pointer;
    width: 100%;
}

.noteable-folders ul {
    list-style-type: none;
    padding: 0;
}

.noteable-folders ul li {
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
}

.noteable-folders ul li a {
    text-decoration: none;
    color: #333;
}

.noteable-right-column {
    flex: 1;
    background-color: white;
    padding: 2rem;
}

.noteable-note-area {
    display: flex;
    flex-direction: column;
}

.noteable-tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;
}

.noteable-tabs button {
    flex: 1;
    padding: 0.5rem;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    cursor: pointer;
}

.noteable-note-input, .noteable-note-output {
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    padding: 1rem;
    background-color: #f8f8f8;
}

.noteable-note-input textarea {
    width: 100%;
    height: 100px;
    border: none;
    padding: 1rem;
    resize: none;
}

.noteable-upload-pdf, .noteable-create-note, .noteable-save-note {
    padding: 0.5rem 1rem;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
}

.noteable-save-note {
    align-self: flex-end;
}

</style>