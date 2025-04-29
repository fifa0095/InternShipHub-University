const fs = require("fs");
const pdfParse = require("pdf-parse");

const keywords = {
  skill: [
    "React", "Vue", "Angular", "Node.js", "Express", "JavaScript", "TypeScript", 
    "CSS", "HTML", "SASS", "Python", "Django", "Flask", "Java", "Spring Boot",
    "C#", ".NET", "C++", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL",
    "AWS", "Azure", "Docker", "Kubernetes", "Git", "REST API", "GraphQL"
  ],
  educational: [
    "Computer Engineering", "Computer Science", "Information Technology", "Information Systems", "Bachelor of Computer Engineering",
    "Bachelor of Computer Science", "B.Sc. in Computer", "B.Eng. in Computer", 
    "B.Sc. IT", "B.Eng. IT"
  ]
};


const resumeExtraction = (text) => {
  const foundKeywords = {};

  for (const [label, keywordList] of Object.entries(keywords)) {
      const matchingKeywords = new Set(
          keywordList.filter(kw =>
              text.toLowerCase().includes(kw.toLowerCase())
          )
      );

      if (matchingKeywords.size > 0) {
          foundKeywords[label] = Array.from(matchingKeywords).join(', ');
      }
  }

  return foundKeywords;
};


exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (req.file.mimetype !== "application/pdf") {
      fs.unlinkSync(req.file.path); 
      return res.status(400).json({ error: "Only .pdf files are allowed." });
    }

    const fileSizeInMB = req.file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "File size exceeds 5MB limit." });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);
    const searchedPDF =resumeExtraction(pdfData.text);
    console.log(searchedPDF);

    fs.unlinkSync(req.file.path);

    res.json(searchedPDF );

  } catch (error) {
    console.error("PDF parsing failed:", error);
    res.status(500).json({ error: "Failed to parse PDF." });
  }
};
