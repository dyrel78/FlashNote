<template>
<body id="app">
    <div class="flashnote-container">
        <!-- Navbar -->
        <nav class="flashnote-navbar">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">History</a></li>
                <li><a href="#">Notes</a></li>
                <li><a href="#">Logout</a></li>
            </ul>
        </nav>

        <!-- Main content -->
        <div class="flashnote-main-content">
            <!-- Left Column for Folders -->
            <div class="flashnote-left-column">
                <div class="flashnote-folders">
                    <h2>My Notes</h2>
                    <button class="flashnote-add-folder" @click="addFolder">+</button>
                    <ul>
                        <li v-for="note in notes" :key="note.id">
                            <a href="#">{{ note.title }}</a><span class="flashnote-date">{{ note.date }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Right Column for Note Input/Display -->
            <div class="flashnote-right-column">
                <div class="flashnote-note-area">
                    <h2>Advanced AI Note Creation</h2>
                    <p>Welcome to FlashNote! Easily create concise notes from your lecture slides.</p>
                    <div class="flashnote-tabs">
                        <button @click="setTab('long')">Long</button>
                        <button @click="setTab('medium')">Medium</button>
                        <button @click="setTab('short')">Short</button>
                        <button @click="setTab('flashcards')">Flashcards</button>
                    </div>
                    <div class="flashnote-content">
                        <div class="flashnote-note-input">
                            <textarea v-model="inputText" placeholder="Paste text"></textarea>
                            <button class="flashnote-upload-pdf">Upload PDF</button>
                            <button class="flashnote-create-note" @click="createNote">Create</button>
                        </div>
                        <div class="flashnote-note-output">
                            <h3>{{ outputText }}</h3>
                            <!-- Placeholder for AI generated notes preview -->
                        </div>
                    </div>
                    <button class="flashnote-save-note" @click="saveNote">Save</button>
                </div>
            </div>
        </div>
    </div>

   
</body>
</template>

<script>
  export default {
    data() {
      return {
        notes: [
          { id: 1, title: 'INFO202', date: 'September 6, 2024' },
          { id: 2, title: 'INFO310', date: 'September 8, 2024' },
          { id: 3, title: 'INFO301', date: 'June 12, 2024' }
        ],
        inputText: '',
        outputText: '',
        selectedTab: 'long'
      };
    },
    methods: {
      addFolder() {
        const newId = this.notes.length + 1;
        this.notes.push({ id: newId, title: `New Folder ${newId}`, date: new Date().toLocaleDateString() });
      },
      setTab(tab) {
        this.selectedTab = tab;
      },
      createNote() {
        // Logic to process inputText based on selectedTab and generate outputText
        this.outputText = `Generated Note for ${this.selectedTab} tab: ${this.inputText}`;
      },
      saveNote() {
        alert('Note saved successfully!');
        // Logic to save the note
      }
    }
  };
  </script>



