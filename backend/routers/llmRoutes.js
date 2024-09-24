import express from "express";
import mongoose from "mongoose";
import Note from "../models/note.js";
import User from "../models/user.js";
import { Mistral}  from '@mistralai/mistralai';
import { GoogleGenerativeAI } from "@google/generative-ai";
let mistralApiKey = process.env.MISTRAL_API_KEY;
let geminiApiKey = process.env.GEMINI_API_KEY;
const client = new Mistral({apiKey: mistralApiKey});


const router = express.Router();


router.get("/mistral", async (req, res) => {
    try {

        const listOfGames = ['League of Legends', 'Valorant', 'Team Fortess 2'];
        const chatStreamResponse = await client.chat.complete({
            model: 'mistral-tiny',
            messages: [{ 
                role: 'user',
                 content: 'Summarize these + ' + listOfGames.join(', ') 
                }],
        });
        console.log('Chat Stream:');
        console.log('============');
        console.log(chatStreamResponse);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/test", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "In under 20 words, describe New Zealand.";

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.send(result.response.text());      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/short", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let inputText = req.query.inputText;
        let prompt = `${inputText} + "Generate notes on key points, 4 bullet points per heading, less than 15 words per bullet point."`;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.send(result.response.text());      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/medium", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let inputText = req.query.inputText + " ";
        let prompt = `${inputText} + "Generate notes on key points, 5 bullet points, less than 40 words per bullet point."`; 
        const result = await model.generateContent(prompt);
        //  result.response.text();
        res.send( result.response.text());
        
        ;      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/long", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let inputText = req.query.inputText;
        let prompt = `${inputText} + "Generate full paragraphs on key concepts."`;
        const result = await model.generateContent(prompt);
        
        console.log(result.response.text());
        res.send(result.response.text());      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/flashcards", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let inputText = req.query.inputText;
        let prompt = `"Generate flashcards on key concepts in the following text. After each flashcard, include the answer
     to the flashcard. After each pair of question and answer, include the character '|' to separate the flashcards." ${inputText} `;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.send(result.response.text());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




export default router;
