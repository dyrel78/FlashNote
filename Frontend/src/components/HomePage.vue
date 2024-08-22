<!-- <div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
-->

<!-- <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Note-Able - AI Note Taking</title>
    <link rel="stylesheet" href="css\noteable-styles.css">
</head> -->
<template>
<body>
    <div class="noteable-container">
        <!-- Navbar -->
        <nav class="noteable-navbar">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">History</a></li>
                <li><a href="#">Notes</a></li>
                <li><a href="#">Logout</a></li>
            </ul>
        </nav>

        <!-- Main content -->
        <div class="noteable-main-content">
            <!-- Left Column for Folders -->
            <div class="noteable-left-column">
                <div class="noteable-folders">
                    <h2>My Notes</h2>
                    <button class="noteable-add-folder">+</button>
                    <ul>
                        <li><a href="#">Info202</a><span class="noteable-date">September 6, 2015</span></li>
                        <li><a href="#">Hum345</a><span class="noteable-date">September 8, 2015</span></li>
                        <li><a href="#">Info301</a><span class="noteable-date">June 12, 2015</span></li>
                    </ul>
                </div>
            </div>

            <!-- Right Column for Note Input/Display -->
            <div class="noteable-right-column">
                <div class="noteable-note-area">
                    <h2>Advanced AI Note Creation</h2>
                    <p>Welcome to FlashNote! Easily create concise notes from your lecture slides.</p>
                    <div class="noteable-tabs">
                        <button>Long</button>
                        <button>Medium</button>
                        <button>Short</button>
                        <button>Flashcards</button>
                    </div>
                    <div class="noteable-note-input">
                        <textarea placeholder="Paste text"></textarea>
                        <button class="noteable-upload-pdf">Upload PDF</button>
                        <button class="noteable-create-note">Create</button>
                    </div>
                    <div class="noteable-note-output">
                        <h3>Output Loading</h3>
                        <!-- Placeholder for AI generated notes preview -->
                    </div>
                    <button class="noteable-save-note">Save</button>
                </div>
            </div>
        </div>
    </div>
</body>
</template>
<!-- </html> -->


