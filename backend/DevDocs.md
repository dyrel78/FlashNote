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

# API Documentation

## Base URL for Users
## /api/users

### Endpoints

1. **Get All Users**
   - **Method**: `GET`
   - **URL**: `/`
   - **Description**: Retrieves all users.
   - **Response**: 
     - `200 OK` (List of users) 
     - `500 Internal Server Error`.

2. **User Login**
   - **Method**: `POST`
   - **URL**: `/login`
   - **Description**: Authenticates a user with email and password.
   - **Body**:
     ```json
     { 
       "email": "user@example.com", 
       "password": "yourpassword" 
     }
     ```
   - **Response**: 
     - `200 OK` (Login success) 
     - `401 Unauthorized` 
     - `404 Not Found`.

3. **Get User by Username**
   - **Method**: `GET`
   - **URL**: `/username/:username`
   - **Description**: Retrieves user details by username.
   - **Response**: 
     - `200 OK` (User found) 
     - `404 Not Found`.

4. **Register User**
   - **Method**: `POST`
   - **URL**: `/register`
   - **Description**: Registers a new user.
   - **Body**:
     ```json
     { 
       "first_name": "", 
       "last_name": "", 
       "email": "", 
       "username": "", 
       "password": "" 
     }
     ```
   - **Response**: 
     - `201 Created` (Success) 
     - `400 Bad Request`.

5. **Update User by Username**
   - **Method**: `PUT`
   - **URL**: `/username/:username`
   - **Description**: Updates user details by username.
   - **Response**: 
     - `200 OK` (User updated) 
     - `404 Not Found`.

6. **Delete User by Username**
   - **Method**: `DELETE`
   - **URL**: `/username/:username`
   - **Description**: Deletes a user by username.
   - **Response**: 
     - `200 OK` (User deleted) 
     - `404 Not Found`.

---

## Base URL for Notes

### Endpoints

1. **Create a Note/Flashcard**
   - **Method**: `POST`
   - **URL**: `/`
   - **Description**: Creates a new note or flashcard.
   - **Body**: 
     - `folder`, `note_content`, `note_format`, `note_name`, `user`, `question`, `answer`, `status`.
   - **Response**: 
     - `201 Created` or 
     - `500 Internal Server Error`.

2. **Get All Notes**
   - **Method**: `GET`
   - **URL**: `/`
   - **Description**: Retrieves all notes.
   - **Response**: 
     - `200 OK` (Array of notes) or 
     - `500 Internal Server Error`.

3. **Get Note by ID**
   - **Method**: `GET`
   - **URL**: `/:id`
   - **Description**: Retrieves a note by its ID.
   - **Response**: 
     - `200 OK` (Note) or 
     - `404 Not Found` or 
     - `500 Internal Server Error`.

4. **Get Notes by User and Folder**
   - **Method**: `GET`
   - **URL**: `/:userId/folder/:folderName`
   - **Description**: Retrieves all notes for a specific user in a specific folder.
   - **Response**: 
     - `200 OK` (Array of notes) or 
     - `500 Internal Server Error`.

5. **Get Notes by User**
   - **Method**: `GET`
   - **URL**: `/user/:userId`
   - **Description**: Retrieves all notes for a specific user.
   - **Response**: 
     - `200 OK` (Array of notes) or 
     - `404 Not Found` or 
     - `500 Internal Server Error`.

6. **Get Unique Folders by User**
   - **Method**: `GET`
   - **URL**: `/folders/:userId`
   - **Description**: Retrieves all unique folders for a specific user.
   - **Response**: 
     - `200 OK` (Array of folders) or 
     - `500 Internal Server Error`.

7. **Update a Note by ID**
   - **Method**: `PUT`
   - **URL**: `/:id`
   - **Description**: Updates a note by its ID.
   - **Response**: 
     - `200 OK` (Updated note) or 
     - `404 Not Found` or 
     - `500 Internal Server Error`.

8. **Get Flashcards by User and Folder**
   - **Method**: `GET`
   - **URL**: `/flashcards/:userId/:folder`
   - **Description**: Retrieves all flashcards for a specific user and folder.
   - **Response**: 
     - `200 OK` (Array of flashcards) or 
     - `404 Not Found` or 
     - `500 Internal Server Error`.

9. **Delete a Note by ID**
   - **Method**: `DELETE`
   - **URL**: `/:id`
   - **Description**: Deletes a note by its ID.
   - **Response**: 
     - `200 OK` (Deletion success) or 
     - `404 Not Found` or 
     - `500 Internal Server Error`.

---

## Base URL for LLM

### Endpoints

1. **Short Notes Generation**
   - **Method**: `GET`
   - **URL**: `/short?inputText=<input>`
   - **Description**: Generates short notes (4 bullet points per heading) using Gemini AI.
   - **Response**: 
     - `200 OK` (Short notes) or 
     - `500 Internal Server Error`.

2. **Medium Notes Generation**
   - **Method**: `GET`
   - **URL**: `/medium?inputText=<input>`
   - **Description**: Generates medium-length notes (5 bullet points, max 40 words each) using Gemini AI.
   - **Response**: 
     - `200 OK` (Medium notes) or 
     - `500 Internal Server Error`.

3. **Long Notes Generation**
   - **Method**: `GET`
   - **URL**: `/long?inputText=<input>`
   - **Description**: Generates long-form content (full paragraphs) using Gemini AI.
   - **Response**: 
     - `200 OK` (Long notes) or 
     - `500 Internal Server Error`.

4. **Flashcard Generation**
   - **Method**: `GET`
   - **URL**: `/flashcards?inputText=<input>`
   - **Description**: Generates flashcards on key concepts using Gemini AI. Each flashcard includes a question and an answer.
   - **Response**: 
     - `200 OK` (Flashcards) or 
     - `500 Internal Server Error`.

---

## Base URL for PDF

### Endpoints

1. **Extract Text from PDF**
   - **Method**: `POST`
   - **URL**: `/extract_text`
   - **Description**: Extracts text from an uploaded PDF file.
   - **Request**:
     - **Body**: The request must include a file uploaded under the key `pdfFile`.
   - **Response**:
     - `200 OK` with extracted text on success.
     - `400 Bad Request` if no files were uploaded.
     - `500 Internal Server Error` if an error occurs during PDF processing.


4. **Models**
    Our models can be found in /backend/models which consists of the schemas for out notes and users to be stored in out database.
    Note will take 2 different formats flash cards which will consists of question and answer format and paragraph which will just include the note-content.

5. **AI Integration**
    We are using the GEMINI 1.5 model for out AI integration. Can be found in the llmRoutes folder where a prompt is used to generate a response from our model.