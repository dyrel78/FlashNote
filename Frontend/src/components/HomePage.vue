<template>
<body id="app">
    <div class="flashnote-container">
        <!-- Navbar -->
        <nav class="flashnote-navbar">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">History</a></li>
                <li><a href="#">Notes</a></li>
                <li><a href="/create-account    ">Create Account</a></li>
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
import axios from 'axios';


  export default {
    name: 'HomePage',
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
        // Placeholder for adding a new folder to the database
        addFolder() {
            const newId = this.notes.length + 1;
            const newNote = { id: newId, title: `New Folder ${newId}`, date: new Date().toLocaleDateString() };

            // Placeholder for database interaction - this would be an API call
            console.log('Creating new folder in the database:', newNote);

            this.notes.push(newNote);
        },
        
        // Set the active tab for generating different types of notes
        setTab(tab) {
            this.selectedTab = tab;
            console.log('Selected tab:', this.selectedTab);
        },
        
        // Placeholder function to interact with LLM
        // createNote() {
        //     let prompt = '';

        //     // Generate different prompts based on the selected tab
        //     if (this.selectedTab === 'short') {
        //         prompt = `${this.inputText} + "Generate notes on key points, 4 bullet points per heading, less than 15 words per bullet point."`;
        //     } else if (this.selectedTab === 'medium') {
        //         prompt = `${this.inputText} + "Generate notes on key points, 5 bullet points, less than 40 words per bullet point."`;
        //     } else if (this.selectedTab === 'long') {
        //         prompt = `${this.inputText} + "Generate full paragraphs on key concepts."`;
        //     }

        //     // Placeholder for LLM API call
        //     console.log('Sending prompt to LLM:', prompt);
            
        //     // Simulated response from LLM
        //     this.outputText = `Generated Note for ${this.selectedTab} tab: (LLM Response Placeholder) ${prompt}`;
        // }
        async createNote() {
            try {
                const endpointMap = {
                    short: '/api/llm/short',
                    medium: '/api/llm/medium',
                    long: '/api/llm/long'
                };
                const endpoint = endpointMap[this.selectedTab];
                const response = await axios.get(endpoint, {
                    params: {
                        inputText: this.inputText
                    }
                });

                this.outputText = response.data;
            } catch (error) {
                console.error('Error creating note:', error);
                this.outputText = 'An error occurred while generating the note.';
            }
        }
        ,
        
        // Placeholder for saving the generated note to the database
        saveNote() {
            console.log('Saving note to the database:', this.outputText);
            alert('Note saved successfully!');
            // Placeholder for actual database saving logic
        },
        
        // Placeholder for showing a PDF upload popup
        uploadPDF() {
            console.log('Triggered PDF upload popup');
            // Placeholder for actual PDF upload and text scraping functionality
            alert('PDF Upload Popup (Functionality not yet implemented)');
        }
    }}
  </script>




