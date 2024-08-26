Vue.createApp({
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
}).mount('#app');
