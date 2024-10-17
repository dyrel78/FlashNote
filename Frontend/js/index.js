// Deprecated - this file is no longer used in the project


// Vue.createApp({
//     data() {
//         return {
//             notes: [
//                 { id: 1, title: 'INFO202', date: 'September 6, 2024' },
//                 { id: 2, title: 'INFO310', date: 'September 8, 2024' },
//                 { id: 3, title: 'INFO301', date: 'June 12, 2024' }
//             ],
//             inputText: '',
//             outputText: '',
//             selectedTab: 'long'
//         };
//     },
    
//     methods: {
//         // Placeholder for adding a new folder to the database
//         addFolder() {
//             const newId = this.notes.length + 1;
//             const newNote = { id: newId, title: `New Folder ${newId}`, date: new Date().toLocaleDateString() };

//             // Placeholder for database interaction - this would be an API call
//             console.log('Creating new folder in the database:', newNote);

//             this.notes.push(newNote);
//         },
        
//         // Set the active tab for generating different types of notes
//         setTab(tab) {
//             this.selectedTab = tab;
//             console.log('Selected tab:', this.selectedTab);
//         },
        
//         // Placeholder function to interact with LLM
//         createNote() {
//             let prompt = '';

//             // Generate different prompts based on the selected tab
//             if (this.selectedTab === 'short') {
//                 prompt = `${this.inputText} + "Generate notes on key points, 4 bullet points per heading, less than 15 words per bullet point."`;
//             } else if (this.selectedTab === 'medium') {
//                 prompt = `${this.inputText} + "Generate notes on key points, 5 bullet points, less than 40 words per bullet point."`;
//             } else if (this.selectedTab === 'long') {
//                 prompt = `${this.inputText} + "Generate full paragraphs on key concepts."`;
//             }

//             // Placeholder for LLM API call
//             console.log('Sending prompt to LLM:', prompt);
            
//             // Simulated response from LLM
//             this.outputText = `Generated Note for ${this.selectedTab} tab: (LLM Response Placeholder) ${prompt}`;
//         },
        
//         // Placeholder for saving the generated note to the database
//         saveNote() {
//             console.log('Saving note to the database:', this.outputText);
//             alert('Note saved successfully!');
//             // Placeholder for actual database saving logic
//         },
        
//         // Placeholder for showing a PDF upload popup
//         uploadPDF() {
//             console.log('Triggered PDF upload popup');
//             // Placeholder for actual PDF upload and text scraping functionality
//             alert('PDF Upload Popup (Functionality not yet implemented)');
//         }
//     }
// }).mount('#app');
