import express from "express";
import express_file_upload from "express-fileupload";
import * as pdf_parse from "pdf-parse/lib/pdf-parse.js";

const router = express.Router();
router.use(express_file_upload());

router.post("/extract_text", async (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    return res.status(400).send("No files were uploaded.");
  }

  const pdfFile = req.files.pdfFile; // Access the file using the correct key
  console.log(req.files.pdfFile);
  pdf_parse.default(pdfFile) // Pass the file buffer data to pdf-parse
    .then((result) => {
      res.send(result.text);
    })
    .catch((err) => {
      res.status(500).send("Error processing PDF");
    });
});

export default router;
