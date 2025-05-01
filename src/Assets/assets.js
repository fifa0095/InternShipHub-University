

// ✅ รูปโลโก้บริษัท
import agoda from "./agoda.png";
import ais from "./ais.png";
import cpall from "./cpall.png";
import kbank from "./kbank.png";
import line from "./line.png";
import ptt from "./ptt.png";
import scg from "./scg.png";
import thaibev from "./thaibev.png";
import cloud from "./Cloud.png"
import dataAi from "./Data_Ai.png"
import developer from "./Dev.png"
import tester from "./QA__Tester.png"
import security from "./Security.png"
import designer from "./webdesigner.png"

export const assets = {
  // 🔧 โลโก้บริษัท (สำหรับ company_name)
  ptt,
  cpall,
  thaibev,
  agoda,
  line,
  scg,
  ais,
  kbank,

  // job
  cloud,
  dataAi,
  developer,
  tester,
  security,
  designer,


};

export const jobInfo = {
  "Cloud Management": {
    title: "Cloud Management",
    description:
      "สายงาน Cloud Management มีหน้าที่ดูแลระบบโครงสร้างพื้นฐานบนคลาวด์ เช่น AWS, Azure หรือ Google Cloud โดยเน้นความปลอดภัย การขยายตัว และความพร้อมใช้งานสูง",
    skills: ["Cloud Computing", "AWS", "Azure", "DevOps"],
    image: assets.cloud,
  },
  "Data & AI": {
    title: "Data & AI",
    description:
      "สายงานด้าน Data & AI มุ่งเน้นการวิเคราะห์ข้อมูลเชิงลึกและการสร้างโมเดล AI เพื่อช่วยในการตัดสินใจธุรกิจแบบแม่นยำ",
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Visualization"],
    image: assets.dataAi,
  },
  "Designer": {
    title: "Designer",
    description:
      "สายงาน Designer มีบทบาทในการออกแบบประสบการณ์ผู้ใช้ (UX) และส่วนติดต่อผู้ใช้ (UI) เพื่อให้แอปพลิเคชันดูดีและใช้งานง่าย",
    skills: ["UI/UX", "Figma", "Adobe XD", "Design Thinking"],
    image: assets.designer,
  },
  "Developer": {
    title: "Developer",
    description:
      "Developer คือผู้พัฒนาแอปพลิเคชันทั้งฝั่ง Frontend และ Backend ด้วยภาษาต่าง ๆ เช่น JavaScript, Python, Node.js",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    image: assets.developer,
  },
  "QA & Tester": {
    title: "QA & Tester",
    description:
      "สายงาน QA & Tester มีหน้าที่ตรวจสอบคุณภาพของซอฟต์แวร์ ตรวจหาบั๊ก และสร้างระบบทดสอบอัตโนมัติ",
    skills: ["Selenium", "JUnit", "Manual Testing", "Test Automation"],
    image: assets.tester,
  },
  "Security": {
    title: "Security",
    description:
      "สายงาน Security ทำหน้าที่วางระบบความปลอดภัย ตรวจสอบช่องโหว่ และป้องกันภัยคุกคามไซเบอร์ในองค์กร",
    skills: ["Network Security", "Penetration Testing", "Cryptography", "SIEM"],
    image: assets.security,
  },
};
