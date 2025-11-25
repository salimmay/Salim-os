import Background1 from "../../bg1";
import Background2 from "../../bg2";
import Background3 from "../../bg3";
import Background4 from "../../bg4";
import Background5 from "../../bg5";
import SaiyanBackground from "../../bg6";

export const BACKGROUND_COMPONENTS = [
  Background1,// Simple
  Background2,// Space
  Background3,// The Singularity
  Background4,// Black hole
  Background5,// Hex Grid
  SaiyanBackground,
];

export const BOOT_SEQUENCE = [
  "Initializing SalimOS kernel...",
  "Loading React.js modules...",
  "Mounting file system...",
  "Starting UI/UX services...",
  "Access Granted."
];

export const PROJECTS = [
  { id: "fiesta", name: "Fiesta App", file: "fiesta.tsx", tag: "SaaS Ecosystem", tech: ["React", "TypeScript", "Node.js", "MongoDB", "Redux Toolkit"], desc: "A comprehensive SaaS solution for event venue management. Engineered a complex Role-Based Access Control (RBAC) system for multi-user environments. Features include real-time calendar synchronization, financial analytics dashboards, and an integrated partner marketplace.", status: "Production Ready", color: "text-blue-400" },
  { id: "cuisine", name: "Cuisine IQ", file: "cuisine_iq.jsx", tag: "Real-Time Platform", tech: ["React", "Express", "Socket.io", "QR API", "JWT"], desc: "Digitizing the dining experience with a contactless ordering system. Implemented WebSocket connections for sub-second synchronization between client devices and kitchen display systems (KDS).", status: "Live Beta", color: "text-orange-400" },
  { id: "tunisair", name: "Tunisair Recrute", file: "recruitment.jsx", tag: "Enterprise Portal", tech: ["MERN Stack", "Secure Uploads", "Admin Panel", "Data Filtering"], desc: "Official recruitment portal developed for the national airline. Streamlined the internship application process by digitizing workflows. Built a secure backend for handling sensitive candidate data.", status: "Enterprise", color: "text-red-500" },
  { id: "syrvis", name: "Syrvis", file: "marketplace.js", tag: "E-Commerce", tech: ["React", "Redux", "Payment Gateway", "REST API"], desc: "A fully functional marketplace for tech accessories. Implemented a custom shopping cart logic using Redux, secure user authentication, and product search filtering.", status: "Completed", color: "text-purple-400" },
];

export const GALLERY_ITEMS = [
  {
    title: "Dar Kadra Unveiling Luxury",
    image: "DarKadra.jpg",
    link: "https://www.behance.net/gallery/220339077/Dar-Kadra-Unveiling-Luxury"
  },
  {
    title: "Whispers of Love in Heritage Walls",
    image: "Weeding.jpg",
    link: "https://www.behance.net/gallery/225719867/Whispers-of-Love-in-Heritage-Walls"
  },
  {
    title: "Capturing the Essence of Asiatic Cuisine",
    image: "LeBao.jpg",
    link: "https://www.behance.net/gallery/220338231/Le-Bao-Capturing-the-Essence-of-Asiatic-Cuisine"
  },
  {
    title: "Tunisian Princess",
    image: "TunisianPrincess.jpg",
    link: "https://www.behance.net/gallery/167700185/Tunisian-Princess"
  },
  {
    title: "Roof Street Photoshoot",
    image: "RoofStreet.jpg",
    link: "https://www.behance.net/gallery/173225295/Roof-Street-Photoshoot"
  },
  {
    title: "Opening Ceremony of the FMT Olympic Days",
    image: "Ceremony.jpg",
    link: "https://www.behance.net/gallery/165199847/Cremonie-douverture-des-Journes-Olympiques-de-la-FMT-Street-Photoshoot"
  },
  {
    title: "Please Comfort Calm Nurture and Power",
    image: "Nurture.jpg",
    link: "https://www.behance.net/gallery/161599243/Please-Comfort-Calm-Nurture-and-Power"
  },
  {
    title: "Girl and Her Micro",
    image: "GirlandHerMicro.jpg",
    link: "https://www.behance.net/gallery/173227183/A-Girl-and-Her-Micro-in-the-charming-Streets-of-Tunisia"
  },
  {
    title: "Unleash the Beast: Sculpted by Iron, Forged in Sweat",
    image: "UnleashTheBeast.jpg",
    link: "https://www.behance.net/gallery/179283047/Unleash-the-Beast-Sculpted-by-Iron-Forged-in-Sweat"
  }
];

export const WIFI_NETWORKS = [
  { ssid: "GitHub_Public", signal: 4, security: "WPA2", url: "https://github.com/salimmay", type: "github" },
  { ssid: "LinkedIn_Corp", signal: 3, security: "WPA2", url: "https://linkedin.com/in/salim-may-456a271a3", type: "linkedin" },
  { ssid: "Behance_Creative", signal: 4, security: "WPA2", url: "https://behance.net/SalimMaytn", type: "behance" },
  { ssid: "Email_Server", signal: 5, security: "WPA3", url: "mailto:maysalimp@gmail.com", type: "email" },
  { ssid: "Portfolio_Main", signal: 4, security: "WPA2", url: "#", type: "portfolio" }
];

export const FILE_SYSTEM = {
  root: {
    type: "folder",
    name: "My Computer",
    children: {
      projects: {
        type: "folder",
        name: "Projects",
        children: {
          fiesta: { type: "file", name: "fiesta.js", content: "SaaS Event Management Platform" },
          cuisine: { type: "file", name: "cuisine_iq.js", content: "Contactless Ordering System" },
          tunisair: { type: "file", name: "tunisair.js", content: "Enterprise Recruitment Portal" }
        }
      },
      certificates: {
        type: "folder", 
        name: "Certificates",
        children: {
          aws: { type: "file", name: "aws_cert.pdf", content: "AWS Cloud Practitioner" },
          react: { type: "file", name: "react_advanced.pdf", content: "Advanced React Patterns" }
        }
      },
      secrets: {
        type: "folder",
        name: "Secrets",
        locked: true,
        children: {
          secret: { type: "file", name: "secret.txt", content: "🎉 You found the secret! The password is 'open sesame'" }
        }
      }
    }
  }
};

export const SALIM_AI_RESPONSES = {
  skills: "I specialize in Full Stack Development with React, Node.js, TypeScript, MongoDB, and modern DevOps tools. I build scalable, performant web applications with clean architecture.",
  contact: "You can reach me at maysalimp@gmail.com or connect on LinkedIn/GitHub. Let's build something amazing together!",
  joke: ["Why do programmers prefer dark mode? Because light attracts bugs!", "I would tell you a joke about UDP... but you might not get it.", "There are 10 types of people in the world: those who understand binary and those who don't."],
  projects: "I've worked on Fiesta App (SaaS), Cuisine IQ (real-time platform), Tunisair Recrute (enterprise), and Syrvis (e-commerce). Check the VS Code app for details!",
  default: "I'm SalimAI, your virtual assistant. Ask me about my skills, projects, contact info, or even tell me a joke!"
};

export const HACKER_CODE = `// SalimOS Kernel v1.0
#include <react.h>
#include <typescript.h>
#include <innovation.h>

class Developer {
  constructor(public name: string, public skills: string[]) {}
  
  deployProject(project: Project): void {
    const success = this.codeReview(project);
    if (success) {
      console.log("🚀 Production deployed!");
      this.drinkCoffee();
    }
  }
  
  private codeReview(project: Project): boolean {
    return project.testsPassed && project.architecture === "clean";
  }
  
  private drinkCoffee(): void {
    this.energyLevel += 100;
    this.creativity *= 2;
  }
}

const salim = new Developer("Salim May", [
  "React", "Node.js", "TypeScript", "MongoDB", 
  "AWS", "Docker", "UI/UX Design", "System Architecture"
]);

salim.deployProject(fiestaApp);`;
