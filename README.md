

[![Backend Build and Test](https://github.com/dyrel78/FlashNote/actions/workflows/backend-build.yml/badge.svg?branch=main)](https://github.com/dyrel78/FlashNote/actions/workflows/backend-build.yml)

[![Frontend Build](https://github.com/dyrel78/FlashNote/actions/workflows/frontend-build.yml/badge.svg)](https://github.com/dyrel78/FlashNote/actions/workflows/frontend-build.yml)


[![Codacy Badge](https://app.codacy.com/project/badge/Grade/dc3cb21cb3ce4eb0811637ce4ca672c2)](https://app.codacy.com/gh/dyrel78/FlashNote/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)


<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/dyrel78/Best-README">
    <img src="Frontend/old_html_files/flashnote-logo.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Flashnote</h1>

  <p align="center">
FlashNote is an AI-powered study tool designed to help students create various types of notes, from concise summaries to detailed paragraphs and flashcards. With FlashNote, users can easily copy and paste lecture slides or upload PDFs directly into the platform. By selecting the desired note format, FlashNote’s advanced AI generates the perfect study material in just a few clicks. Users can then make any adjustments as needed or save the note for future reference.
    <br />
    <a href="https://github.com/dyrel78/FlashNote/DevDocs.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://www.flashnote.click:8080/">View Demo (If not on University of Otago Wifi)</a>
    ·
    <a href="
    <a href="https://github.com/dyrel78/Best-README">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About the Project

FlashNote is a modern, AI-powered study tool designed to enhance students' productivity by making note-taking more efficient. By using advanced language models, FlashNote can generate various types of notes (summaries, detailed paragraphs, and flashcards) based on user input like lecture slides or PDFs.

### Key Features
- **AI-Powered Note Generation**: Generate concise summaries or detailed notes in seconds.
- **Upload Lecture Slides/PDFs**: Directly upload documents for automatic note creation.
- **Flashcard Mode**: Create study flashcards for exam preparation.
- **Customizable Output**: Edit and save generated notes for future reference.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built using the **MEVN Stack**:
* [**MongoDB**](https://www.mongodb.com/): NoSQL database to store user data and notes.
* [**Express.js**](https://expressjs.com/): Backend framework for building APIs.
* [**Vue.js**](https://vuejs.org/): Frontend JavaScript framework for creating the user interface.
* [**Node.js**](https://nodejs.org/): JavaScript runtime for the backend server.

Other technologies:
- **Docker**: To containerize the application for easier deployment.
- **Gemini**: For integrating AI language models to generate notes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started


<a href="http://www.flashnote.click:8080/">Link to a deployed solution</a>



For local setup, follow these instructions to set up and run the FlashNote application on your local machine.


### Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v16 or later)
- **npm** (v7 or later)
- **MongoDB** (MongoDB API key )
- **Gemini**  (Gemini API key)
- **Docker** (optional for containerized deployment)
  
## .env file
Inside your /backend and /Frontend folders, create a .env file with the following variables:
```
DB_CONNECTION_STRING = your_mongo_uri
MONGO_URI=your_mongo_uri
GEMINI_API_KEY=your_gemini_api_key
```
INFO301 Staff have been provided with the API keys for Gemini and MongoDB inside our Taiga submission

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dyrel78/FlashNote.git

2. **build the frontend**
    ```bash
   cd Frontend
   npm install
   npm run build

3. **build the backend**
    ```bash
   cd backend 
   npm install
   npm run start

4. **start the frontend**
    ```bash
    cd Frontend
    npm run serve

5. **start the application**
    ```bash
    http://localhost:8081/

### License

### Contact
Leon - [chele691@student.otago.ac.nz](mailto:chele691@student.otago.ac.nz)
Dyrel - [lumdy690@student.otago.ac.nz](mailto:lumdy690@student.otago.ac.nz)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## How to Use

### 1. Create Account
- Navigate to 'Create Account' in the navbar
- Enter your details and select create account

### 2. Log In
- Enter your newly created account details
- Click 'Ok' on the pop-up alert

### 3. Conciseness Level
- Choose level of conciseness from buttons above input section (detailed, concise, bullet-points, flashcards)

### 4a. Paste Text
- Click on large grey text input box on left side of screen
- Cmd + V OR Right Click -> Paste to paste text

#### OR

### 4b. Upload PDF
- Click 'Choose File' 
- Select and open desired file (must be PDF format)
- Click 'Upload PDF' to convert file to text and add to content input section

### 6. Select Folder
- Click 'Select a Folder' then 'Create a New Folder'
- Enter folder name

### 7. Create Note
- Select 'Create Note' to generate your AI note summary according to your selected style
- Your generated note will appear to the right in the output box

### 8. Save Note
- Click 'Save' 
- Name your generated note and click 
- Click 'Ok' on the pop-up alert

### 9. View Notes or Flashcards
- Click icon at the top of the black side bar to see your saved folders
- Select the folder of notes you want to see
- Click on the name of the note or flashcard set 
- Navigate through flashcards by clicking or using space bar to flip and arrow keys to move left and right

### 10. Edit Notes
- Make any desired changes to your summarised notes using the provided toolbar
- Select 'Save' to save your changes
- Click 'Ok' on the pop-up alert

### 11. Delete Notes
- Navigate to the folder the note you want to delete is in
- Check the box or click 'Select All'
- Click 'Delete Selected'
- Confirm you would like to delete note
- Click 'Ok' on the pop-up alert

### Help Feature
Navigate to help page from navbar if you require further help or utilise tour feature on first log in







[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
