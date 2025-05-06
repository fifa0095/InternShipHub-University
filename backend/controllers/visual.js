const Blog = require('../models/Blog');



// header tag except NODATA
// tag skill
// company name 

const TH_PROVINCES = [
  "กระบี่", "กรุงเทพฯ", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น",
  "จันทบุรี", "ฉะเชิงเทรา", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "ชลบุรี", "เชียงใหม่",
  "เชียงราย", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม",
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นราธิวาส", "น่าน",
  "นนทบุรี", "บึงกาฬ", "บุรีรัมย์", "ประจวบคีรีขันธ์", "ปทุมธานี", "ปราจีนบุรี",
  "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก",
  "เพชรบุรี", "เพชรบูรณ์", "แพร่", "พ่อแม่ฮ่องสอน", "ภูเก็ต", "มหาสารคาม",
  "มุกดาหาร", "แม่ฮ่องสอน", "ยะลา", "ยโสธร", "ร้อยเอ็ด", "ระนอง", "ระยอง",
  "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร",
  "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว",
  "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์",
  "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อุดรธานี", "อุทัยธานี", "อุตรดิตถ์",
  "อุบลราชธานี", "อำนาจเจริญ"
];
const BANGKOK_ALIASES = ["กรุงเทพ", "กทม", "กรุงเทพมหานคร"];

const JOB_SKILL_KEYWORDS = {
  "Developer": [
    "javascript", "typescript", "python", "java", "c#", "go", "php", "ruby", "swift", "kotlin",
    "node.js", "react", "vue.js", "angular", "django", "flask", "spring boot",
    "docker", "kubernetes", "ci/cd", "github actions", "jenkins",
    "sql", "nosql", "mongodb", "firebase", "postgresql", "mysql",
    "node.js", "express.js", "graphql", "graphql api", "restapi",
    "flutter", "spring framework", "laravel", "angularjs", "vuex", "next.js", "typescript",
    "spring boot", "aws", "azure", "gcp"
  ],
  "Designer": [
    "figma", "adobe xd", "sketch", "illustrator", "photoshop",
    "css animation", "bootstrap", "tailwind css", "material ui", "sass", "less",
    "sketch", "invision", "principle", "affinity designer", "webflow",
    "framer", "zeplin", "adobe photoshop", "adobe illustrator", "gimp", "canva"
  ],
  "Data & AI": [
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
    "kafka", "spark", "hadoop", "flink", "apache beam", "redis", "elasticsearch",
    "bigquery", "apache kafka", "mlflow", "dataiku", "azure ml", "google cloud ai", "aws sagemaker",
    "neo4j", "power bi", "tableau", "sql", "postgresql", "mongodb", "firebase", "hadoop", "spark"
  ],
  "Security": [
    "docker security", "kubernetes security", "api security", "web security",
    "encryption", "cryptography", "ssl", "tls", "oauth", "openid", "xss", "csrf",
    "pentesting", "wireshark", "nmap", "burp suite", "kali linux", "metasploit", "hashcat",
    "cybersecurity tools", "zabbix", "misp", "splunk", "elasticsearch", "siem"
  ],
  "QA & Tester": [
    "selenium", "junit", "cypress", "postman", "mocha", "chai", "jest", "karma", "testcafe", "protractor",
    "loadrunner", "appium", "testng", "gatling", "soapui", "pyrun", "robot framework",
    "jira", "testlink", "azure devops", "teamcity",
    "bugzilla", "sentry", "bug tracking", "gitlab ci", "circleci"
  ],
  "Cloud Management": [
    "aws", "amazon web services", "azure", "gcp", "kubernetes", "docker", "terraform", "ansible",
    "ansible", "cloudwatch", "prometheus", "grafana", "vpc", "vpn", "cloudfront", "iam", "ec2", "cloud storage", "cloud security", "devops", "ci/cd", "site reliability engineering",
    "lambda", "elk stack",
    "kubernetes clusters", "helm", "openstack", "finops"
  ]
};

exports.getCountingData = async (req, res) => {
  try {
    const blogs = await Blog.find();

    const jobCounts = {};
    const skillCounts = {};
    const provinceCounts = {};

    for (const [job, skills] of Object.entries(JOB_SKILL_KEYWORDS)) {
      if (job === "NODATA") continue;
      jobCounts[job] = 0;
      for (const skill of skills) {
        skillCounts[skill.toLowerCase()] = 0;
      }
    }

    const allProvinces = [...TH_PROVINCES, ...BANGKOK_ALIASES];

    for (const province of allProvinces) {
      provinceCounts[province] = 0;
    }

    blogs.forEach((blog) => {
      let combinedText = "";

      if (Array.isArray(blog.content)) {
        blog.content.forEach((section) => {
          if (Array.isArray(section)) {
            combinedText += section.join(" ");
          } else if (typeof section === "string") {
            combinedText += section + " ";
          }
        });
      }

      const lowerText = combinedText.toLowerCase();

      for (const [job, skills] of Object.entries(JOB_SKILL_KEYWORDS)) {
        if (job === "NODATA") continue;

        const matched = skills.some((kw) => lowerText.includes(kw.toLowerCase()));
        if (matched) jobCounts[job]++;

        skills.forEach((kw) => {
          const skill = kw.toLowerCase();
          if (lowerText.includes(skill)) {
            skillCounts[skill]++;
          }
        });
      }

      TH_PROVINCES.forEach((province) => {
        if (lowerText.includes(province.toLowerCase())) {
          provinceCounts[province]++;
        }
      });
      
      BANGKOK_ALIASES.forEach((alias) => {
        if (lowerText.includes(alias.toLowerCase())) {
          provinceCounts["กรุงเทพฯ"]++;
        }
      });
    });

    BANGKOK_ALIASES.forEach((alias) => {
      delete provinceCounts[alias];
    });


    // Quarter 
    const blogCounts = await Blog.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            quarter: {
              $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.quarter": 1
        }
      }
    ]);

    const quarterCounts = blogCounts.map(item => ({
      label: `Q${item._id.quarter} ${item._id.year}`,
      count: item.count
    }));

    return res.status(200).json({
      jobCounts,
      skillCounts,
      provinceCounts,
      quarterCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
