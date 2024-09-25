const FormatFlashcards = (text) => {
    const parts= text.split('|');
    const flashcards = [];
    // let formattedText = '';


    for (let i = 0; i < parts.length; i+=2) {
        const question = parts[i];
        const answer = parts[i+1];
        flashcards.push({ question, answer });
        // formattedText += `Q: ${question}\nA: ${answer}\n\n`;
    }
    // return flashcards.join('');
    return flashcards;
    // return { flashcards, formattedText: formattedText.trim() };

};

export default FormatFlashcards;