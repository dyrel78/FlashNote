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




export default router;
