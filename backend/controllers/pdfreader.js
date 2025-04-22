const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Check file type
    if (req.file.mimetype !== "application/pdf") {
      fs.unlinkSync(req.file.path); // remove the uploaded file
      return res.status(400).json({ error: "Only .pdf files are allowed." });
    }

    // Check file size (already enforced by multer, but can double-check)
    const fileSizeInMB = req.file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "File size exceeds 5MB limit." });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    // Delete the uploaded file after parsing
    fs.unlinkSync(req.file.path);

    // Return extracted text
    res.json({ text: pdfData.text });

  } catch (error) {
    console.error("PDF parsing failed:", error);
    res.status(500).json({ error: "Failed to parse PDF." });
  }
};
