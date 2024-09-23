import { Router } from "express";
import multer from "multer";
import pdfParse from "pdfparse";
import path from "path";

const router = Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where uploaded files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Route to handle PDF upload and conversion to text
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    // Ensure file was uploaded
    const pdfBuffer = req.file ? req.file.buffer : null;
    if (!pdfBuffer) {
      return res.status(400).send("No file uploaded.");
    }

    // Convert the PDF buffer to text
    const pdfText = await pdfParse(pdfBuffer);

    // Send the extracted text as a response
    res.json({ text: pdfText.text });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF.");
  }
});

export default router;
