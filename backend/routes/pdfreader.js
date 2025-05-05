const express = require("express");
const multer = require("multer");
const path = require("path");
const pdfReaderController = require("../controllers/pdfreader");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .pdf files are allowed!"));
  },
});

// Route
router.post("/pdfReader", upload.single("file"), pdfReaderController.upload);

module.exports = router;

