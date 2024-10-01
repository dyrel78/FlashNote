1. **Project Overview**

    Purpose: Describe the general purpose of the project, such as creating a note-taking application with flashcards and different summarization options.
    Tech Stack:  Node.js, Express, MongoDB, Vue.js, Gemini API
    Main Features: Highlight the key functionalities such as note creation, different summarization styles (short, medium, long), flashcard generation, and integration with Google AI.

2. **Prerequisites**
    Dependencies: List the libraries and tools needed, e.g., express, mongoose, @google/generative-ai, etc.
    Installation: Include a step-by-step guide on how to install the dependencies using npm:
        ```bash
        npm install
    Environment Variables: Explain the environment variables needed for API keys (MongoDB and Gemini) and provide a .env file example:
    DB_CONNECTION_STRING=your_mongoDB_key
    GEMINI_API_KEY=your_gemini_key

3. **API Endpoints**
    Our API endpoints can be found in backend/routers/. There are multiple different api end points from retrieving/adding information to database, pdf parsing, LLM calling, and authentication such as 

    GET /api/notes/
    which retrieves all the notes or 

    GET /api/notes/:userid
    which retrieves all the notes of a certain user or

    POST /api/users/ 
    which takes a user object and stores it into the database

    To

    POST /api/users/login
    which takes the email and pasword that the user provides and authenticates it with a user in the database

    To 

    POST /api/pdf/extract-text
    which takes in a pdf and returns text of the pdf

    To 

    GET /api/llm/short
    which takes in a query to a llm and returns the output of the LLM

    -note notall routes are dispayed as there is simply too many but you can view them in out routers folder.

4. **Models**
    Our models can be found in /backend/models which consists of the schemas for out notes and users to be stored in out database.
    Note will take 2 different formats flash cards which will consists of question and answer format and paragraph which will just include the note-content.

5. **AI Integration**
    We are using the GEMINI 1.5 model for out AI integration. Can be found in the llmRoutes folder where a prompt is used to generate a response from our model.