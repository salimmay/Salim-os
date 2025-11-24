"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, User, X, Github, Linkedin, Mail, Wifi, Battery,
  Code, Cpu, Play, FileCode, Folder, ChevronRight, BrainCircuit, Coffee, TreePine,
  Tv, HeartHandshake, Smile, Gamepad2, RefreshCw, MapPin, Phone, ExternalLink,
  Maximize2, ArrowLeft, ArrowUp, ArrowDown, ArrowRight, AlertTriangle, Bell,
  Music, Palette, Layout, Power, Settings, Globe, CheckCircle, XCircle, Info, Image,
  Lock, Unlock, Volume2, VolumeX, Monitor, Zap, Trophy, Star, Minus, Maximize, Minimize2
} from "lucide-react";
import Background1 from "./bg1";
import Background2 from "./bg2";
import Background3 from "./bg3";
import Background4 from "./bg4";
import Background5 from "./bg5";

const BACKGROUND_COMPONENTS = [
  Background1,
  Background2,
  Background3,
  Background4,
  Background5
];

// ==========================================
// TYPES
// ==========================================

interface WindowState {
  id: string;
  title: string;
  icon: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  z: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================

const ToastContext = React.createContext<any>(null);

const ToastProvider = ({ children }: any) => {
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'achievement' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[200] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className={`pointer-events-auto backdrop-blur-md border rounded-lg p-4 shadow-xl min-w-[300px] ${
                toast.type === 'achievement' 
                  ? 'bg-yellow-500/95 border-yellow-400 text-yellow-900' 
                  : toast.type === 'success'
                  ? 'bg-green-500/95 border-green-400 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-500/95 border-red-400 text-white'
                  : 'bg-slate-900/95 border-slate-700 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'achievement' && <Trophy className="text-yellow-700" size={20} />}
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// ==========================================
// ACHIEVEMENTS SYSTEM
// ==========================================

const AchievementsContext = React.createContext<any>(null);

const AchievementsProvider = ({ children }: any) => {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  const unlock = (id: string, name: string) => {
    if (!unlocked.has(id)) {
      setUnlocked(prev => new Set([...prev, id]));
      addToast(`🏆 Achievement Unlocked: ${name}`, 'achievement');
    }
  };

  return (
    <AchievementsContext.Provider value={{ unlocked, unlock }}>
      {children}
    </AchievementsContext.Provider>
  );
};

const useAchievements = () => {
  const context = React.useContext(AchievementsContext);
  if (!context) throw new Error('useAchievements must be used within AchievementsProvider');
  return context;
};

// ==========================================
// SOUND SYSTEM
// ==========================================

const SoundContext = React.createContext<any>(null);

const SoundProvider = ({ children }: any) => {
  const [muted, setMuted] = useState(false);
  const sounds = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    const soundFiles = {
      click: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
      swoosh: 'https://assets.mixkit.co/sfx/preview/mixkit-swoosh-1139.mp3',
      error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
      success: 'https://assets.mixkit.co/sfx/preview/mixkit-success-bell-593.mp3',
      keyboard: 'https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3',
      startup: 'https://assets.mixkit.co/sfx/preview/mixkit-computer-startup-1671.mp3'
    };

    Object.entries(soundFiles).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.3;
      sounds.current.set(key, audio);
    });
  }, []);

  const play = (sound: string) => {
    if (muted) return;
    const audio = sounds.current.get(sound);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
    play('click');
  };

  return (
    <SoundContext.Provider value={{ muted, toggleMute, play }}>
      {children}
    </SoundContext.Provider>
  );
};

const useSound = () => {
  const context = React.useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};// ==========================================
// UTILITY COMPONENTS & ICONS
// ==========================================

const BehanceIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />
    <path d="M16 10h2" />
    <path d="M16 14c.5 0 1-.2 1-.5v-1c0-.8-.7-1.5-1.5-1.5h-1.5v3h1.5c.3 0 .5-.1.5-.5" />
    <path d="M6 14h1.5a1.5 1.5 0 0 0 0-3H6v3z" />
    <path d="M6 11h1.5a1.5 1.5 0 0 0 0-3H6v3z" />
  </svg>
);

// ==========================================
// DATA & CONSTANTS
// ==========================================

const BOOT_SEQUENCE = ["Initializing SalimOS kernel...", "Loading React.js modules...", "Mounting file system...", "Starting UI/UX services...", "Access Granted."];

const PROJECTS = [
  { id: "fiesta", name: "Fiesta App", file: "fiesta.tsx", tag: "SaaS Ecosystem", tech: ["React", "TypeScript", "Node.js", "MongoDB", "Redux Toolkit"], desc: "A comprehensive SaaS solution for event venue management. Engineered a complex Role-Based Access Control (RBAC) system for multi-user environments. Features include real-time calendar synchronization, financial analytics dashboards, and an integrated partner marketplace.", status: "Production Ready", color: "text-blue-400" },
  { id: "cuisine", name: "Cuisine IQ", file: "cuisine_iq.jsx", tag: "Real-Time Platform", tech: ["React", "Express", "Socket.io", "QR API", "JWT"], desc: "Digitizing the dining experience with a contactless ordering system. Implemented WebSocket connections for sub-second synchronization between client devices and kitchen display systems (KDS).", status: "Live Beta", color: "text-orange-400" },
  { id: "tunisair", name: "Tunisair Recrute", file: "recruitment.jsx", tag: "Enterprise Portal", tech: ["MERN Stack", "Secure Uploads", "Admin Panel", "Data Filtering"], desc: "Official recruitment portal developed for the national airline. Streamlined the internship application process by digitizing workflows. Built a secure backend for handling sensitive candidate data.", status: "Enterprise", color: "text-red-500" },
  { id: "syrvis", name: "Syrvis", file: "marketplace.js", tag: "E-Commerce", tech: ["React", "Redux", "Payment Gateway", "REST API"], desc: "A fully functional marketplace for tech accessories. Implemented a custom shopping cart logic using Redux, secure user authentication, and product search filtering.", status: "Completed", color: "text-purple-400" },
];

const GALLERY_ITEMS = [
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

const WIFI_NETWORKS = [
  { ssid: "GitHub_Public", signal: 4, security: "WPA2", url: "https://github.com/salimmay", type: "github" },
  { ssid: "LinkedIn_Corp", signal: 3, security: "WPA2", url: "https://linkedin.com/in/salim-may-456a271a3", type: "linkedin" },
  { ssid: "Behance_Creative", signal: 4, security: "WPA2", url: "https://behance.net/SalimMaytn", type: "behance" },
  { ssid: "Email_Server", signal: 5, security: "WPA3", url: "mailto:maysalimp@gmail.com", type: "email" },
  { ssid: "Portfolio_Main", signal: 4, security: "WPA2", url: "#", type: "portfolio" }
];

const FILE_SYSTEM = {
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

const SALIM_AI_RESPONSES = {
  skills: "I specialize in Full Stack Development with React, Node.js, TypeScript, MongoDB, and modern DevOps tools. I build scalable, performant web applications with clean architecture.",
  contact: "You can reach me at maysalimp@gmail.com or connect on LinkedIn/GitHub. Let's build something amazing together!",
  joke: ["Why do programmers prefer dark mode? Because light attracts bugs!", "I would tell you a joke about UDP... but you might not get it.", "There are 10 types of people in the world: those who understand binary and those who don't."],
  projects: "I've worked on Fiesta App (SaaS), Cuisine IQ (real-time platform), Tunisair Recrute (enterprise), and Syrvis (e-commerce). Check the VS Code app for details!",
  default: "I'm SalimAI, your virtual assistant. Ask me about my skills, projects, contact info, or even tell me a joke!"
};

const HACKER_CODE = `// SalimOS Kernel v1.0
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
// ==========================================
// NEW FEATURE COMPONENTS
// ==========================================

const WiFiMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { play } = useSound();
  const { unlock } = useAchievements();

  const handleConnect = (network: any) => {
    play('success');
    unlock('wifi_connected', 'Connected to ' + network.ssid);
    
    if (network.type === 'email') {
      window.location.href = network.url;
    } else if (network.url !== '#') {
      window.open(network.url, '_blank');
    } else {
      setTimeout(() => {
        const event = new CustomEvent('openWindow', { detail: 'bio' });
        window.dispatchEvent(event);
      }, 500);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-16 right-4 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-[100] pointer-events-auto"
    >
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 text-white">
          <Wifi size={20} className="text-blue-400" />
          <h3 className="font-bold">Available Networks</h3>
        </div>
      </div>
      <div className="p-2 space-y-1 max-h-80 overflow-auto">
        {WIFI_NETWORKS.map((network, index) => (
          <div
            key={network.ssid}
            onClick={() => handleConnect(network)}
            className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-${3 + i * 2} rounded-full ${
                      i < network.signal ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{network.ssid}</div>
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <Lock size={10} />
                  {network.security}
                </div>
              </div>
            </div>
            <div className="text-slate-400 group-hover:text-white transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const CRTShader = () => (
  <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)`,
        backgroundSize: '100% 4px'
      }}
    />
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)`
      }}
    />
    <div 
      className="absolute inset-0 bg-black opacity-0 animate-pulse"
      style={{
        animation: 'flicker 8s infinite linear'
      }}
    />
    <style jsx>{`
      @keyframes flicker {
        0%, 100% { opacity: 0; }
        1% { opacity: 0.1; }
        2% { opacity: 0; }
        50% { opacity: 0; }
        51% { opacity: 0.05; }
        52% { opacity: 0; }
      }
    `}</style>
  </div>
);

const FileExplorer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentPath, setCurrentPath] = useState(['root']);
  const [unlockedFolders, setUnlockedFolders] = useState<Set<string>>(new Set());
  const { play } = useSound();
  const { unlock } = useAchievements();

  const getCurrentFolder = () => {
    let current: any = FILE_SYSTEM;
    currentPath.forEach(key => {
      if (current && current.children) {
        current = current.children[key];
      }
    });
    return current;
  };

  const navigateTo = (key: string, item: any) => {
    play('click');
    
    if (item.type === 'file') {
      alert(`File: ${item.name}\nContent: ${item.content}`);
      return;
    }

    if (item.locked && !unlockedFolders.has(key)) {
      const password = prompt('This folder is locked. Enter password:');
      if (password === 'open sesame') {
        setUnlockedFolders(prev => new Set([...prev, key]));
        unlock('hacker', 'Master Hacker - Unlocked Secret Folder');
        setCurrentPath(prev => [...prev, key]);
      } else {
        play('error');
        alert('Incorrect password!');
      }
      return;
    }

    setCurrentPath(prev => [...prev, key]);
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      play('click');
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  const currentFolder = getCurrentFolder();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-[100] pointer-events-auto flex flex-col"
    >
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <button onClick={goBack} disabled={currentPath.length === 1} className="p-1 rounded hover:bg-slate-800 disabled:opacity-30">
          <ArrowLeft size={16} className="text-white" />
        </button>
        <div className="text-white font-bold text-sm">
          {currentPath.map((key, i) => (
            <span key={i}>
              {i > 0 && ' > '}
              {(FILE_SYSTEM.root.children as any)[key]?.name || key}
            </span>
          ))}
        </div>
        <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-slate-800">
          <X size={16} className="text-white" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {currentFolder.children && Object.entries(currentFolder.children).map(([key, item]: [string, any]) => (
          <div
            key={key}
            onClick={() => navigateTo(key, item)}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer group"
          >
            {item.type === 'folder' ? (
              <Folder size={20} className={item.locked && !unlockedFolders.has(key) ? "text-red-400" : "text-blue-400"} />
            ) : (
              <FileCode size={20} className="text-green-400" />
            )}
            <div className="flex-1">
              <div className="text-white text-sm">{item.name}</div>
              {item.locked && !unlockedFolders.has(key) && (
                <div className="text-red-400 text-xs flex items-center gap-1">
                  <Lock size={10} />
                  Locked
                </div>
              )}
            </div>
            {item.type === 'folder' && (
              <ChevronRight size={16} className="text-slate-400 group-hover:text-white" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SalimAIChat = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hi! I'm SalimAI. Ask me about my skills, projects, or just say hello!", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { play } = useSound();

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    play('keyboard');

    setTimeout(() => {
      const response = generateAIResponse(input.toLowerCase());
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
      play('click');
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (input: string): string => {
    if (input.includes('skill') || input.includes('tech') || input.includes('stack')) {
      return SALIM_AI_RESPONSES.skills;
    } else if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
      return SALIM_AI_RESPONSES.contact;
    } else if (input.includes('project') || input.includes('work')) {
      return SALIM_AI_RESPONSES.projects;
    } else if (input.includes('joke') || input.includes('funny')) {
      const jokes = SALIM_AI_RESPONSES.joke;
      return jokes[Math.floor(Math.random() * jokes.length)];
    } else {
      return SALIM_AI_RESPONSES.default;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-24 right-4 w-80 h-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-[100] pointer-events-auto flex flex-col"
    >
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <div className="text-white font-bold text-sm">SalimAI Assistant</div>
        <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-slate-800">
          <X size={16} className="text-white" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-white p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HackerTyperMode = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [typedCode, setTypedCode] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const { play } = useSound();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      e.preventDefault();
      play('keyboard');
      
      if (typingIndex < HACKER_CODE.length) {
        setTypedCode(prev => prev + HACKER_CODE[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, typingIndex, play]);

  const resetTyping = () => {
    setTypedCode("");
    setTypingIndex(0);
    play('click');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] pointer-events-auto flex flex-col"
    >
      <div className="p-4 border-b border-green-800 flex justify-between items-center">
        <div className="text-green-400 font-mono text-sm">HACKER MODE ACTIVE - Type anything...</div>
        <button onClick={onClose} className="text-green-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 font-mono text-green-400 text-sm p-4 overflow-auto whitespace-pre">
        {typedCode}
        <span className="animate-pulse">█</span>
      </div>
      
      <div className="p-4 border-t border-green-800 flex justify-between">
        <div className="text-green-400 text-sm">
          Progress: {Math.round((typingIndex / HACKER_CODE.length) * 100)}%
        </div>
        <button 
          onClick={resetTyping}
          className="text-green-400 hover:text-white text-sm"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
};
// ==========================================
// APP COMPONENTS
// ==========================================

const CalculatorApp = () => {
  const [display, setDisplay] = useState("0");
  const { play } = useSound();

  const handlePress = (val: string) => {
    play('click');
    if (val === "C") {
      setDisplay("0");
    } else if (val === "=") {
      try {
        setDisplay(eval(display).toString());
        play('success');
      } catch {
        setDisplay("Error");
        play('error');
      }
    } else {
      setDisplay(prev => prev === "0" ? val : prev + val);
    }
  };

  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col gap-4">
      <div className="bg-slate-950 p-4 text-right text-2xl font-mono text-green-400 rounded shadow-inner overflow-hidden">{display}</div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button onClick={() => handlePress("C")} className="col-span-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded p-2 active:scale-95 transition-transform">CLEAR</button>
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(b =>
          <button
            key={b}
            onClick={() => handlePress(b)}
            className={`font-bold rounded p-2 active:scale-95 transition-transform ${['/', '*', '-', '+', '='].includes(b) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
          >
            {b}
          </button>
        )}
      </div>
    </div>
  );
};

const NotepadApp = () => {
  const [text, setText] = useState("TODO:\n- Hire Salim\n- Check out his GitHub\n- Drink Coffee");
  const { play } = useSound();

  return (
    <textarea 
      className="w-full h-full bg-[#fff9c4] text-slate-800 p-4 font-handwriting resize-none outline-none text-lg" 
      value={text} 
      onChange={(e) => {
        setText(e.target.value);
        play('keyboard');
      }}
      style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }} 
    />
  );
};

const CalendarApp = () => {
  const today = new Date();
  return (
    <div className="h-full bg-white text-slate-900 p-4 flex flex-col items-center justify-center">
      <div className="text-red-500 font-bold text-xl uppercase tracking-widest">{today.toLocaleString('default', { month: 'long' })}</div>
      <div className="text-9xl font-bold">{today.getDate()}</div>
      <div className="text-slate-400 text-2xl">{today.toLocaleString('default', { weekday: 'long' })}</div>
    </div>
  );
};

const BSOD = ({ onRestart }: { onRestart: () => void }) => {
  const { play } = useSound();
  
  useEffect(() => {
    play('error');
  }, [play]);

  return (
    <div className="fixed inset-0 bg-[#0078d7] z-[100] flex flex-col items-center justify-center text-white font-mono p-10 cursor-none select-none">
      <div className="max-w-2xl">
        <div className="text-8xl mb-4">:(</div>
        <h1 className="text-2xl mb-8">Your PC ran into a problem. We're just collecting some error info, and then we'll restart for you.</h1>
        <div className="text-xl mb-8">0% complete</div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-white p-2"><div className="w-full h-full bg-black flex items-center justify-center text-[10px] text-center">QR CODE</div></div>
          <div className="text-sm space-y-1"><p>Stop code: CRITICAL_PROCESS_DIED</p><p>Error: USER_DID_NOT_HIRE_SALIM_YET</p></div>
        </div>
        <button onClick={onRestart} className="mt-12 px-6 py-2 border border-white hover:bg-white hover:text-[#0078d7] transition-colors cursor-pointer">FORCE RESTART</button>
      </div>
    </div>
  );
};

const InterestsApp = () => {
  const interests = [
    { title: "Social Work", Icon: HeartHandshake, color: "text-pink-400", desc: "Active Volunteer", stat: "Humanity First", col: "col-span-2" },
    { title: "Gaming", Icon: Gamepad2, color: "text-purple-400", desc: "Competitive & Story", stat: "Rank: High", col: "col-span-1" },
    { title: "Nature & Camping", Icon: TreePine, color: "text-green-400", desc: "System Recharge", stat: "Offline Mode", col: "col-span-1" },
    { title: "The Caffeine Engine", Icon: Coffee, color: "text-yellow-400", desc: "Fuel for Code", stat: "98% Intake", col: "col-span-2" },
    { title: "Psychology", Icon: BrainCircuit, color: "text-teal-400", desc: "Human Behavior", stat: "Analyzing...", col: "col-span-2" },
  ];

  return (
    <div className="h-full bg-slate-950 p-6 overflow-auto custom-scrollbar">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-teal-500/10 rounded-xl"><BrainCircuit className="text-teal-400" size={32} /></div>
        <div><h2 className="text-2xl font-bold text-white">Neural_Dump</h2><p className="text-slate-400 text-sm">Personal Interests & Background Processes</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interests.map((item: any, i) => (
          <div key={i} className={`${item.col} bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/80 transition-colors group hover:border-teal-500/30`}>
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:scale-110 transition-transform">
                <item.Icon className={item.color} size={24} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider border border-slate-800 px-2 py-1 rounded-full">{item.stat}</span>
            </div>
            <h3 className="text-slate-200 font-bold mb-1">{item.title}</h3>
            <p className="text-slate-400 text-xs">{item.desc}</p>
            <div className="w-full h-1 bg-slate-800 mt-3 rounded-full overflow-hidden"><div className="h-full bg-teal-500/50" style={{ width: `${Math.random() * 40 + 40}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { play } = useSound();

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      play('success');
    }
    setPlaying(!playing);
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col p-6 text-white relative overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-500/10 blur-[100px] pointer-events-none animate-pulse" />
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" />
      <div className="flex items-center justify-center flex-1 relative z-10">
        <div className={`relative w-40 h-40 rounded-full bg-black border-4 border-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-1000 ${playing ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
          <div className="absolute inset-2 rounded-full border border-slate-800 opacity-50"></div>
          <div className="absolute inset-4 rounded-full border border-slate-800 opacity-50"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"><Music size={20} className="text-white" /></div>
        </div>
      </div>
      <div className="space-y-4 z-10 mt-4">
        <div className="text-center"><h3 className="font-bold text-xl tracking-tight">Lofi Coding Beats</h3><p className="text-slate-400 text-xs uppercase tracking-widest">Salim FM • 98.5</p></div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" animate={{ width: playing ? ["0%", "100%"] : "0%" }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} /></div>
        <div className="flex justify-center gap-8 items-center">
          <button className="text-slate-500 hover:text-white"><ChevronRight className="rotate-180" /></button>
          <button onClick={togglePlay} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl hover:shadow-white/20">
            {playing ? <div className="flex gap-1 h-4 items-center"><div className="w-1 h-4 bg-black animate-[bounce_1s_infinite]" /><div className="w-1 h-6 bg-black animate-[bounce_1s_infinite_0.2s]" /><div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_0.4s]" /></div> : <Play size={24} className="ml-1 fill-black" />}
          </button>
          <button className="text-slate-500 hover:text-white"><ChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#ffffff");
  const [isDrawing, setIsDrawing] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
      }
    }
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.strokeStyle = color;
  }, [color]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    setIsDrawing(false);
  };

  return (
    <div className="h-full bg-slate-800 flex flex-col">
      <div className="p-2 bg-slate-700 flex gap-2 items-center" onMouseDown={(e) => e.stopPropagation()}>
        {['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ffffff'].map(c =>
          <button
            key={c}
            onClick={(e) => { 
              e.stopPropagation();
              setColor(c); 
              play('click'); 
            }}
            className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const c = canvasRef.current;
            const ctx = c?.getContext('2d');
            if (c && ctx) {
              ctx.clearRect(0, 0, c.width, c.height);
              play('success');
            }
          }}
          className="ml-auto text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="flex-1 bg-[#1e1e1e] cursor-crosshair"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />
    </div>
  );
};

const ReadmeApp = () => {
  return (
    <div className="h-full bg-[#1e1e1e] text-slate-300 p-6 md:p-10 font-mono overflow-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
        <h1 className="text-4xl font-bold text-white mb-8 border-b border-slate-700 pb-6 flex items-center gap-4">Hi there! <span className="animate-bounce inline-block">👋</span></h1>
        <div className="space-y-8 text-lg leading-relaxed">
          <p>I write <span className="text-green-400">clean</span>, <span className="text-blue-400">reusable</span>, and <span className="text-yellow-400">documented</span> code. I believe that great software is a combination of <span className="text-white font-bold">solid architecture</span> and <span className="text-white font-bold">intuitive design</span>.</p>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-4"><span className="text-2xl">🔭</span> <span>I'm currently working on <strong className="text-blue-400">Fiesta App</strong></span></div>
            <div className="flex items-center gap-4"><span className="text-2xl">🌱</span> <span>I'm currently learning <strong className="text-green-400">AWS & Microservices</strong></span></div>
            <div className="flex items-center gap-4"><span className="text-2xl">⚡</span> <span>Fun fact: I used to be a <strong className="text-purple-400">professional photographer</strong>!</span></div>
          </div>
          <div className="pt-6"><p className="text-slate-500 text-sm">* This README.md is rendered directly from the SalimOS kernel.</p></div>
        </div>
      </div>
    </div>
  );
};

const InteractiveTerminal = ({ onOpenWindow }: { onOpenWindow: (id: string) => void }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([{ type: "output", content: "SalimOS Kernel v1.0.0 initialized..." }]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const { play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      play('keyboard');
      const cmd = input.trim().toLowerCase();
      const args = cmd.split(" ").slice(1);
      let output: any = null;

      if (cmd === 'help') {
        output = (
          <div className="space-y-2">
            <div>Available commands:</div>
            <div className="grid grid-cols-[120px_1fr] gap-1 text-xs">
              <span className="text-yellow-400">about</span> <span>Who is Salim?</span>
              <span className="text-yellow-400">neofetch</span> <span>System Info</span>
              <span className="text-yellow-400">open [app]</span> <span>Launch app</span>
              <span className="text-red-500">sudo rm -rf /</span> <span className="text-red-400">⚠️ DO NOT USE</span>
            </div>
          </div>
        );
      }
      else if (cmd === 'about') output = "Salim May | Full Stack Dev";
      else if (cmd === 'neofetch') {
        output = (
          <div className="flex gap-4 text-xs font-mono mt-2">
            <div className="space-y-1">
              <div><span className="text-blue-400">salim</span>@<span className="text-blue-400">macbook-pro</span></div>
              <div>-------------------</div>
              <div><span className="text-yellow-400">OS</span>: SalimOS v1.0</div>
              <div><span className="text-yellow-400">Host</span>: Vercel Edge</div>
              <div><span className="text-yellow-400">Kernel</span>: React 18.2.0</div>
              <div><span className="text-yellow-400">Uptime</span>: Forever</div>
            </div>
          </div>
        );
      }
      else if (cmd.startsWith('open')) {
        const app = args[0];
        if (['vscode', 'game', 'gallery', 'bio', 'interests', 'readme', 'music', 'paint'].includes(app)) {
          output = `Opening ${app}...`;
          play('swoosh');
          onOpenWindow(app);
        }
        else output = "App not found.";
      }
      else if (cmd === 'clear') { setHistory([]); setInput(""); return; }
      else if (cmd.startsWith('sudo')) {
        if (args.join(' ') === 'rm -rf /') {
          addToast("⚠️ SYSTEM KERNEL PANIC! Rebooting...", 'error');
          play('error');
          document.body.style.transition = "all 1.5s ease-in-out";
          document.body.style.transform = "scale(0.01) rotate(180deg)";
          document.body.style.opacity = "0";
          setTimeout(() => { window.location.reload(); }, 1500);
          return;
        }
        output = <span className="text-red-500">Permission denied.</span>;
      }
      else output = `Command not found: ${cmd}`;

      setHistory([...history, { type: "command", content: input }, { type: "output", content: output }]);
      setInput("");
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] p-4 font-mono text-sm overflow-auto custom-scrollbar cursor-text" onClick={() => inputRef.current?.focus()}>
      <div className="space-y-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === "command" ? "text-slate-300 mt-4" : "text-slate-400 ml-2"}>
            {line.type === "command" ? <span className="text-green-400">➜ ~ {line.content}</span> : line.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2 items-center">
        <span className="text-green-400">➜ ~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none text-slate-200 flex-1"
          autoFocus
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

const VSCodeApp = () => {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const { play } = useSound();

  return (
    <div className="flex h-full text-sm font-mono bg-[#1e1e1e] text-slate-300">
      <div className="hidden md:flex w-48 bg-[#252526] border-r border-[#333] flex-col">
        <div className="p-3 text-xs font-bold text-slate-500 tracking-wider">EXPLORER</div>
        <div className="px-2 pt-2 overflow-auto">
          <div className="pl-3 space-y-1">
            {PROJECTS.map((p) => (
              <div 
                key={p.id} 
                onClick={() => { setActiveProject(p); play('click'); }} 
                className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${activeProject.id === p.id ? "bg-[#37373d] text-white" : "hover:text-white"}`}
              >
                <FileCode size={16} className={p.file.endsWith("tsx") ? "text-blue-400" : "text-yellow-400"} />
                <span className="truncate">{p.file}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
        <div className="flex bg-[#252526] border-b border-[#333] px-4 py-2 text-white text-xs gap-2">
          <FileCode size={12} className="text-yellow-400" /> {activeProject.file}
        </div>
        <div className="flex-1 p-6 overflow-auto custom-scrollbar">
          <h1 className={`text-2xl font-bold mb-2 ${activeProject.color}`}>{activeProject.name}</h1>
          <div className="text-[#ce9178] whitespace-pre-wrap font-sans leading-relaxed">{activeProject.desc}</div>
          {activeProject.tech && (
            <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
              {activeProject.tech.map(t => <div key={t} className="bg-[#2d2d2d] p-2 rounded text-xs border border-[#3e3e42]">{t}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const GalleryApp = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { play } = useSound();

  return (
    <div className="h-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedProject ? (
            <button onClick={() => { setSelectedProject(null); play('click'); }} className="p-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-bold">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div className="p-2 bg-indigo-500/10 rounded-lg"><Image className="text-indigo-400" size={20} /></div>
          )}
          <h2 className="text-lg font-bold text-white truncate max-w-[200px]">{selectedProject ? selectedProject.title : "Creative Gallery"}</h2>
        </div>
        <a href="https://www.behance.net/SalimMaytn" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-white flex items-center gap-1">Behance <ExternalLink size={12} /></a>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-slate-950">
        {selectedProject ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-xl overflow-hidden border border-slate-800 relative">
            <iframe src={selectedProject.link} height="100%" width="100%" allowFullScreen loading="lazy" frameBorder="0" className="w-full h-full"></iframe>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => { setSelectedProject(cat); play('swoosh'); }} 
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 cursor-pointer bg-slate-900 shadow-lg hover:scale-[1.02] transition-all"
              >
                <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                <div className="absolute inset-0 bg-slate-800 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-bold text-md mb-1">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={12} /> Open Project</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BioApp = () => (
  <div className="h-full bg-white text-slate-800 p-8 overflow-auto custom-scrollbar">
    <div className="flex flex-col items-center border-b border-slate-100 pb-6 mb-6">
      <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-xl overflow-hidden">
        <img src="/me.jpg" alt="Salim May" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Salim May</h2>
      <p className="text-blue-600 font-medium text-lg">Full Stack Developer</p>
      <p className="text-slate-500 text-sm mt-1 text-center">System Admin • UI/UX Enthusiast</p>
      <div className="flex gap-4 mt-6 justify-center">
        <a href="https://www.linkedin.com/in/salim-may-456a271a3/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded hover:bg-blue-50 text-blue-600"><Linkedin size={20} /></a>
        <a href="https://github.com/salimmay" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded hover:bg-slate-200 text-slate-900"><Github size={20} /></a>
        <a href="https://www.behance.net/SalimMaytn" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded hover:bg-blue-600 hover:text-white text-blue-700"><BehanceIcon size={20} /></a>
        <a href="mailto:maysalimp@gmail.com" className="p-2 bg-slate-100 rounded hover:bg-red-50 text-red-500"><Mail size={20} /></a>
      </div>
    </div>
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2"><User size={18} className="text-blue-600" /> About Me</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        I am a developer who bridges the gap between <b>robust backend logic</b> and <b>pixel-perfect frontend design</b>.
        Specializing in <b>TypeScript</b> and <b>Full Stack Architecture</b> to deliver secure, scalable, and high-performance web applications.
      </p>
    </div>
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
        <Code size={18} className="text-blue-600" /> Technical Stack
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Frontend</span>
          <span className="text-sm font-medium text-slate-700">React.js, Next.js, Tailwind, Redux</span>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Backend</span>
          <span className="text-sm font-medium text-slate-700">Node.js, Express, Spring Boot, PHP</span>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Database</span>
          <span className="text-sm font-medium text-slate-700">MongoDB, MySQL, PostgreSQL</span>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">DevOps</span>
          <span className="text-sm font-medium text-slate-700">Linux, Docker, Git, Agile/Scrum</span>
        </div>
      </div>
    </div>
    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg">
      <h3 className="font-bold text-sm mb-4">Let's work together</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3"><Mail size={16} className="text-blue-400" /> maysalimp@gmail.com</div>
        <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-400" /> Manouba, Tunisia</div>
        <div className="flex items-center gap-3"><Phone size={16} className="text-blue-400" /> +216 27 004 058</div>
      </div>
    </div>
  </div>
);

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const boardSize = 20;
  const dirRef = useRef({ x: 1, y: 0 });
  const { play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const currentDir = dirRef.current;
        const newHead = { x: prev[0].x + currentDir.x, y: prev[0].y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          play('error');
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          play('success');
          if (score + 1 >= 10) unlock('snake_master', 'Snake Master - Score 10+');
          setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);

    return () => clearInterval(moveSnake);
  }, [gameStarted, gameOver, food, boardSize, score, play, unlock]);

  const handleDir = (x: number, y: number) => {
    const current = dirRef.current;
    if ((x !== 0 && current.x === 0) || (y !== 0 && current.y === 0)) {
      setDir({ x, y });
      dirRef.current = { x, y };
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowUp") handleDir(0, -1);
      if (e.key === "ArrowDown") handleDir(0, 1);
      if (e.key === "ArrowLeft") handleDir(-1, 0);
      if (e.key === "ArrowRight") handleDir(1, 0);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    play('click');
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="mb-4 text-center z-20">
        <h3 className="text-green-500 text-xl font-bold tracking-widest">SNAKE.EXE</h3>
        <div className="text-slate-400 text-sm mt-2">SCORE: <span className="text-white">{score}</span></div>
      </div>
      <div className="relative border-4 border-slate-700 bg-black/80 p-1 rounded-lg shadow-2xl z-20">
        <div className="grid bg-slate-900/50" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, width: "min(70vw, 400px)", height: "min(70vw, 400px)" }}>
          {Array.from({ length: boardSize * boardSize }).map((_, i) => {
            const x = i % boardSize;
            const y = Math.floor(i / boardSize);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return <div key={i} className={`${isSnake ? "bg-green-600/80" : isFood ? "bg-red-500 rounded-full" : "border-[0.5px] border-white/5"}`} />;
          })}
        </div>
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-30">
            {gameOver && <div className="text-red-500 font-bold text-2xl mb-2">GAME OVER</div>}
            <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 cursor-pointer"><Play size={18} /> {gameOver ? "RETRY" : "START"}</button>
          </div>
        )}
      </div>
      <div className="mt-4 text-slate-500 text-xs">Use arrow keys to move</div>
    </div>
  );
};
const StartMenu = ({ isOpen, onOpenWindow, toggleStart }: any) => {
  const { play } = useSound();

  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 20, opacity: 0 }}
      className="absolute bottom-16 left-4 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col pointer-events-auto"
    >
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full overflow-hidden"><img src="/me.jpg" alt="SM" className="w-full h-full object-cover" /></div>
        <div><div className="font-bold">Salim May</div><div className="text-xs opacity-80">Administrator</div></div>
      </div>
      <div className="p-2 space-y-1">
        <button onClick={() => { onOpenWindow('music'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-pink-500 rounded"><Music size={14} className="text-white" /></div> Salim FM</button>
        <button onClick={() => { onOpenWindow('paint'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-orange-500 rounded"><Palette size={14} className="text-white" /></div> Paint.exe</button>
        <button onClick={() => { onOpenWindow('game'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-emerald-500 rounded"><Gamepad2 size={14} className="text-white" /></div> Snake Game</button>
        <button onClick={() => { onOpenWindow('interests'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-teal-500 rounded"><BrainCircuit size={14} className="text-white" /></div> Brain.exe</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => { onOpenWindow('calc'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-gray-500 rounded"><Code size={14} className="text-white" /></div> Calculator</button>
        <button onClick={() => { onOpenWindow('calendar'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-blue-500 rounded"><Cpu size={14} className="text-white" /></div> Calendar</button>
        <button onClick={() => { onOpenWindow('notepad'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-yellow-500 rounded"><FileCode size={14} className="text-black" /></div> Notepad</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => { onOpenWindow('bsod'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-red-500/20 rounded text-red-400 text-sm flex items-center gap-3 group"><AlertTriangle size={16} className="group-hover:animate-bounce" /> Self Destruct</button>
      </div>
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex justify-between">
        <button className="text-xs text-slate-400 hover:text-white px-2 py-1">Settings</button>
        <button onClick={() => window.location.reload()} className="text-xs text-slate-400 hover:text-white px-2 py-1">Shut Down</button>
      </div>
    </motion.div>
  );
};

const ContextMenu = ({ x, y, onClose, onAction }: any) => {
  const { play } = useSound();

  const handleAction = (action: string) => {
    play('click');
    onAction(action);
  };

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="fixed z-[95] bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl py-2 min-w-[180px] pointer-events-auto" style={{ left: x, top: y }}>
        <button onClick={() => handleAction('refresh')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><RefreshCw size={14} /> Refresh</button>
        <button onClick={() => handleAction('wallpaper')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><Palette size={14} /> Change Wallpaper</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => handleAction('vscode')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><Code size={14} /> Open VS Code</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => handleAction('properties')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><Settings size={14} /> Properties</button>
      </div>
    </>
  );
};
const TopBar = () => {
  const [time, setTime] = useState("");
  const [wifiMenuOpen, setWifiMenuOpen] = useState(false);
  const [retroMode, setRetroMode] = useState(false);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [salimAIOpen, setSalimAIOpen] = useState(false);
  const [hackerModeOpen, setHackerModeOpen] = useState(false);
  const { muted, toggleMute, play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => { 
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })), 1000); 
    return () => clearInterval(t); 
  }, []);

  const handleRetroModeToggle = () => {
    setRetroMode(!retroMode);
    play('click');
    if (!retroMode) {
      unlock('retro_gamer', 'Retro Gamer - Enabled CRT Mode');
    }
  };

  const handleHackerModeToggle = () => {
    setHackerModeOpen(!hackerModeOpen);
    play('click');
    if (!hackerModeOpen) {
      unlock('hacker_typer', 'Hacker Typer - Enabled typing mode');
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-10 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 text-xs font-medium text-white z-50 border-b border-white/10 shadow-lg select-none pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SalimOS</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <button onClick={() => setFileExplorerOpen(true)} className="hover:text-blue-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            <Folder size={16} />
          </button>
          <button onClick={() => setSalimAIOpen(true)} className="hover:text-green-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            <BrainCircuit size={16} />
          </button>
          <button onClick={handleHackerModeToggle} className="hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            <Zap size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setWifiMenuOpen(!wifiMenuOpen)} className="hover:text-blue-400 transition-colors p-1.5 hover:bg-white/5 rounded flex items-center gap-1">
            <Wifi size={16} />
          </button>
          <button onClick={handleRetroModeToggle} className={`transition-colors p-1.5 hover:bg-white/5 rounded ${retroMode ? 'text-green-400' : 'hover:text-green-400'}`}>
            <Monitor size={16} />
          </button>
          <button onClick={toggleMute} className="hover:text-yellow-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm">{time}</span>
          </div>
        </div>
      </div>

      <WiFiMenu isOpen={wifiMenuOpen} onClose={() => setWifiMenuOpen(false)} />
      {retroMode && <CRTShader />}
      <FileExplorer isOpen={fileExplorerOpen} onClose={() => setFileExplorerOpen(false)} />
      <SalimAIChat isOpen={salimAIOpen} onClose={() => setSalimAIOpen(false)} />
      <HackerTyperMode isOpen={hackerModeOpen} onClose={() => setHackerModeOpen(false)} />
    </>
  );
};
const DraggableDesktopIcon = ({ icon: Icon, label, onClick, color, defaultPosition }: any) => {
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const { play } = useSound();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setZIndex(1000);
    play('click');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: position.x + e.movementX,
      y: position.y + e.movementY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      className={`group flex flex-col items-center gap-1 w-20 cursor-pointer absolute pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ 
        left: position.x, 
        top: position.y,
        zIndex 
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      drag={false}
    >
      <div 
        className={`w-12 h-12 ${color} rounded-xl shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform ${isDragging ? 'scale-110' : ''}`}
        onClick={(e) => {
          if (!isDragging) {
            onClick();
            play('click');
          }
        }}
      >
        <Icon size={24} />
      </div>
      <span className="text-white text-xs font-medium drop-shadow-md bg-black/40 px-2 rounded-full border border-white/10">
        {label}
      </span>
    </motion.div>
  );
};

const Window = ({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  isOpen, 
  isMinimized,
  isMaximized,
  isActive, 
  onClick 
}: any) => {
  const { play } = useSound();
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);

  if (!isOpen || isMinimized) return null;

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from title bar
    const target = e.target as HTMLElement;
    if (target.closest('.window-titlebar')) {
      setIsDraggingWindow(true);
    }
    onClick();
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`fixed flex flex-col overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-xl bg-slate-900/95 ${
        isActive ? "z-50 ring-2 ring-blue-500/50" : "z-40"
      } rounded-lg pointer-events-auto`}
      style={
        isMaximized
          ? {
              top: 40,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 120px)',
              borderRadius: 0,
            }
          : {
              top: 80,
              left: 100,
              width: 'min(90vw, 800px)',
              height: '600px',
            }
      }
      drag={!isMaximized && !isDraggingWindow}
      dragMomentum={false}
      dragConstraints={{ top: 40, left: 0, right: window.innerWidth - 400, bottom: window.innerHeight - 200 }}
      dragElastic={0}
      onMouseDown={handleWindowMouseDown}
      onDragEnd={() => setIsDraggingWindow(false)}
    >
      <div className="window-titlebar h-10 bg-slate-800/90 flex items-center justify-between px-4 border-b border-slate-700/50 shrink-0 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onClose(id); 
              play('click'); 
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center group transition-colors"
          >
            <X size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMinimize(id); 
              play('click'); 
            }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer flex items-center justify-center group transition-colors"
          >
            <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMaximize(id); 
              play('click'); 
            }}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer flex items-center justify-center group transition-colors"
          >
            {isMaximized ? (
              <Minimize2 size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
            ) : (
              <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm font-medium pointer-events-none">
          <Icon size={14} /> <span>{title}</span>
        </div>
        <div className="w-20" />
      </div>
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </motion.div>
  );
};
const DockIcon = ({ 
  icon: Icon, 
  isOpen, 
  isMinimized,
  onClick, 
  onClose,
  label 
}: any) => {
  const { play } = useSound();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
    play('click');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    play('click');
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`relative p-2.5 rounded-lg hover:-translate-y-2 transition-all shrink-0 ${
          isOpen && !isMinimized 
            ? 'bg-slate-700/80' 
            : 'bg-slate-800/80 hover:bg-slate-700'
        }`}
      >
        <Icon className="text-white" size={24} />
        {isOpen && (
          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
            isMinimized ? 'bg-yellow-400' : 'bg-blue-400'
          }`} />
        )}
      </button>
      {isOpen && (
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
        >
          <X size={12} className="text-white" />
        </button>
      )}
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
        {label}
      </div>
    </div>
  );
};
const Desktop = () => {
  const [bootStep, setBootStep] = useState(0);
  const [booting, setBooting] = useState(true);
  const [notification, setNotification] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [startOpen, setStartOpen] = useState(false);
  const [bsod, setBsod] = useState(false);
  const [gravityEnabled, setGravityEnabled] = useState(false);
  const { play } = useSound();
  const { unlock } = useAchievements();
  const { addToast } = useToast();

  const [windows, setWindows] = useState<Record<string, WindowState>>({
    readme: { id: "readme", title: "README.md", icon: FileCode, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    terminal: { id: "terminal", title: "Terminal", icon: Terminal, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    vscode: { id: "vscode", title: "VS Code", icon: Code, isOpen: false, isMinimized: false, isMaximized: false, z: 2 },
    gallery: { id: "gallery", title: "Creative Gallery", icon: Image, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    bio: { id: "bio", title: "Profile.pdf", icon: User, isOpen: true, isMinimized: false, isMaximized: false, z: 10 },
    game: { id: "game", title: "Snake.exe", icon: Gamepad2, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    interests: { id: "interests", title: "Brain.exe", icon: BrainCircuit, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    music: { id: "music", title: "Salim FM", icon: Music, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    paint: { id: "paint", title: "Paint.exe", icon: Palette, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    calc: { id: "calc", title: "Calculator", icon: Code, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    calendar: { id: "calendar", title: "Calendar", icon: Cpu, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    notepad: { id: "notepad", title: "Notepad", icon: FileCode, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
  });

  // Boot sequence
  useEffect(() => {
    if (bootStep < BOOT_SEQUENCE.length) {
      const t = setTimeout(() => setBootStep((p) => p + 1), 600);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setBooting(false), 800);
    }
  }, [bootStep]);

  // Notification
  useEffect(() => { 
    const t = setTimeout(() => setNotification(true), 6000); 
    return () => clearTimeout(t); 
  }, []);

  // Konami code
  useEffect(() => {
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let current = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === konami[current]) {
        current++;
        if (current === konami.length) {
          document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
          unlock('konami', 'Konami Code - Secret unlocked!');
          current = 0;
        }
      } else current = 0;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [unlock]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + W - Close active window
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const activeWindow = Object.values(windows)
          .filter(w => w.isOpen && !w.isMinimized)
          .sort((a, b) => b.z - a.z)[0];
        if (activeWindow) {
          closeWindow(activeWindow.id);
          addToast(`Closed ${activeWindow.title}`, 'info');
        }
      }

      // Cmd/Ctrl + M - Minimize active window
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        const activeWindow = Object.values(windows)
          .filter(w => w.isOpen && !w.isMinimized)
          .sort((a, b) => b.z - a.z)[0];
        if (activeWindow) {
          minimizeWindow(activeWindow.id);
          addToast(`Minimized ${activeWindow.title}`, 'info');
        }
      }

      // Cmd/Ctrl + F - Maximize/restore active window
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        const activeWindow = Object.values(windows)
          .filter(w => w.isOpen && !w.isMinimized)
          .sort((a, b) => b.z - a.z)[0];
        if (activeWindow) {
          maximizeWindow(activeWindow.id);
        }
      }

      // Cmd/Ctrl + Space - Open start menu
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setStartOpen(!startOpen);
      }

      // Alt + Tab - Switch between windows (simplified)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const openWindows = Object.values(windows)
          .filter(w => w.isOpen)
          .sort((a, b) => b.z - a.z);
        if (openWindows.length > 1) {
          const currentActive = openWindows[0];
          const nextWindow = openWindows[1];
          focusWindow(nextWindow.id);
          if (nextWindow.isMinimized) {
            restoreWindow(nextWindow.id);
          }
          addToast(`Switched to ${nextWindow.title}`, 'info');
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [windows, startOpen, addToast]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    play('click');
  };

  const handleMenuAction = (action: string) => {
    if (action === 'refresh') { 
      setBooting(true); 
      setBootStep(0); 
      play('success');
    }
    if (action === 'wallpaper') {
      setWallpaperIndex(prev => {
        const newIndex = (prev + 1) % BACKGROUND_COMPONENTS.length;
        play('swoosh');
        unlock('indecisive', 'Indecisive - Changed wallpaper');
        return newIndex;
      });
    }
    if (action === 'vscode') toggleWindow('vscode');
    if (action === 'properties') {
      addToast("System: SalimOS v1.0\nKernel: React Next.js\nMemory: 100% Creative Capacity\nUptime: Forever", 'info');
      play('click');
    }
    setContextMenu(null);
  };

  const toggleWindow = (id: string) => {
    if (id === 'bsod') { setBsod(true); play('error'); return; }
    
    setWindows((prev) => {
      const win = prev[id];
      const maxZ = Math.max(...Object.values(prev).map(w => w.z)) + 1;
      
      if (win.isOpen && !win.isMinimized) {
        // Window is open and visible - minimize it
        play('click');
        return { 
          ...prev, 
          [id]: { ...win, isMinimized: true } 
        };
      } else if (win.isOpen && win.isMinimized) {
        // Window is minimized - restore and focus it
        play('swoosh');
        return { 
          ...prev, 
          [id]: { ...win, isMinimized: false, z: maxZ } 
        };
      } else {
        // Window is closed - open it
        play('swoosh');
        return { 
          ...prev, 
          [id]: { ...win, isOpen: true, isMinimized: false, z: maxZ } 
        };
      }
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => ({ 
      ...prev, 
      [id]: { ...prev[id], isOpen: false, isMinimized: false } 
    }));
    play('click');
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({ 
      ...prev, 
      [id]: { ...prev[id], isMinimized: true } 
    }));
    play('click');
  };

  const restoreWindow = (id: string) => {
    const maxZ = Math.max(...Object.values(windows).map(w => w.z)) + 1;
    setWindows((prev) => ({ 
      ...prev, 
      [id]: { ...prev[id], isMinimized: false, z: maxZ } 
    }));
    play('swoosh');
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) => ({ 
      ...prev, 
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized } 
    }));
    play('click');
  };

  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...Object.values(prev).map(w => w.z)) + 1;
      return { ...prev, [id]: { ...prev[id], z: maxZ } };
    });
  };

  const toggleGravity = () => {
    setGravityEnabled(!gravityEnabled);
    play('click');
    if (!gravityEnabled) {
      unlock('physics_master', 'Physics Master - Enabled gravity');
    }
  };

  const desktopIcons = [
    { id: 'bio', icon: User, label: 'Profile', color: 'bg-purple-600', position: { x: 20, y: 20 } },
    { id: 'readme', icon: FileCode, label: 'README.md', color: 'bg-slate-500', position: { x: 20, y: 100 } },
    { id: 'interests', icon: BrainCircuit, label: 'Brain.exe', color: 'bg-teal-600', position: { x: 20, y: 180 } },
    { id: 'vscode', icon: Code, label: 'VS Code', color: 'bg-blue-600', position: { x: 20, y: 260 } },
    { id: 'gallery', icon: Image, label: 'Gallery', color: 'bg-indigo-600', position: { x: 20, y: 340 } },
    { id: 'game', icon: Gamepad2, label: 'DevBreak', color: 'bg-emerald-600', position: { x: 20, y: 420 } },
    { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'bg-slate-800', position: { x: 20, y: 500 } },
  ];

  const ActiveWallpaper = BACKGROUND_COMPONENTS[wallpaperIndex];

  if (booting) return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 flex flex-col justify-end z-[100]">
      {BOOT_SEQUENCE.slice(0, bootStep).map((txt, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-1">{`> ${txt}`}</motion.div>)}
    </div>
  );

  if (bsod) return <BSOD onRestart={() => setBsod(false)} />;

  return (
    <div className="fixed inset-0 overflow-hidden font-sans select-none bg-slate-950" onContextMenu={handleContextMenu}>
      <ActiveWallpaper />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <TopBar />
      
      {/* Keyboard shortcuts hint */}
      <div className="fixed top-12 right-4 z-10 text-[10px] text-white/20 font-mono select-none pointer-events-none hidden md:block">
        <div>⌘W: Close | ⌘M: Minimize | ⌘F: Maximize</div>
        <div>⌘Space: Start Menu | Alt+Tab: Switch</div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            onClick={() => { toggleWindow('bio'); setNotification(false); play('click'); }}
            className="fixed top-16 right-4 w-72 bg-slate-800/90 backdrop-blur p-4 rounded-lg border-l-4 border-blue-500 shadow-2xl z-[100] cursor-pointer hover:bg-slate-800 transition-colors pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full text-blue-400"><Bell size={16} /></div>
              <div className="flex-1"><h4 className="text-white text-sm font-bold">New Opportunity</h4><p className="text-slate-400 text-xs mt-1">Recruiters are viewing your profile. Click to see details.</p></div>
              <button onClick={(e) => { e.stopPropagation(); setNotification(false); play('click'); }} className="text-slate-500 hover:text-white"><X size={14} /></button>
            </div>
          </motion.div>
        )}
        {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onAction={handleMenuAction} />}
        {startOpen && <StartMenu isOpen={startOpen} toggleStart={() => setStartOpen(false)} onOpenWindow={toggleWindow} />}
      </AnimatePresence>

      {/* Desktop Icons */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {desktopIcons.map(icon => (
          <DraggableDesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onClick={() => toggleWindow(icon.id)}
            color={icon.color}
            defaultPosition={gravityEnabled ? { 
              x: Math.random() * (window.innerWidth - 100), 
              y: window.innerHeight - 100 
            } : icon.position}
          />
        ))}
      </div>

      {/* Windows */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {Object.values(windows).map((win) => (
            <Window
              key={win.id}
              {...win}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onClick={() => focusWindow(win.id)}
              isActive={win.z === Math.max(...Object.values(windows).filter(w => w.isOpen && !w.isMinimized).map(w => w.z))}
            >
              {win.id === "readme" && <ReadmeApp />}
              {win.id === "vscode" && <VSCodeApp />}
              {win.id === "terminal" && <InteractiveTerminal onOpenWindow={(id) => { if (!windows[id].isOpen) toggleWindow(id); focusWindow(id); }} />}
              {win.id === "gallery" && <GalleryApp />}
              {win.id === "bio" && <BioApp />}
              {win.id === "game" && <SnakeGame />}
              {win.id === "interests" && <InterestsApp />}
              {win.id === "music" && <MusicPlayer />}
              {win.id === "paint" && <PaintApp />}
              {win.id === "calc" && <CalculatorApp />}
              {win.id === "calendar" && <CalendarApp />}
              {win.id === "notepad" && <NotepadApp />}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-3 shadow-2xl z-[80] w-max max-w-[90vw] overflow-x-auto overflow-y-hidden pointer-events-auto">
        <button 
          onClick={() => { setStartOpen(!startOpen); play('click'); }} 
          className={`p-3 rounded-lg transition-all mr-2 ${startOpen ? 'bg-blue-600 text-white' : 'bg-slate-800/80 text-blue-400 hover:bg-slate-700'}`}
        >
          <Layout size={24} />
        </button>
        <div className="w-px h-8 bg-white/20 mx-1 shrink-0" />
        
        <DockIcon icon={User} label="Profile" isOpen={windows.bio.isOpen} isMinimized={windows.bio.isMinimized} onClick={() => toggleWindow("bio")} onClose={() => closeWindow("bio")} />
        <DockIcon icon={FileCode} label="README" isOpen={windows.readme.isOpen} isMinimized={windows.readme.isMinimized} onClick={() => toggleWindow("readme")} onClose={() => closeWindow("readme")} />
        <DockIcon icon={BrainCircuit} label="Interests" isOpen={windows.interests.isOpen} isMinimized={windows.interests.isMinimized} onClick={() => toggleWindow("interests")} onClose={() => closeWindow("interests")} />
        <DockIcon icon={Code} label="VS Code" isOpen={windows.vscode.isOpen} isMinimized={windows.vscode.isMinimized} onClick={() => toggleWindow("vscode")} onClose={() => closeWindow("vscode")} />
        <DockIcon icon={Image} label="Gallery" isOpen={windows.gallery.isOpen} isMinimized={windows.gallery.isMinimized} onClick={() => toggleWindow("gallery")} onClose={() => closeWindow("gallery")} />
        <DockIcon icon={Gamepad2} label="Snake Game" isOpen={windows.game.isOpen} isMinimized={windows.game.isMinimized} onClick={() => toggleWindow("game")} onClose={() => closeWindow("game")} />
        <DockIcon icon={Terminal} label="Terminal" isOpen={windows.terminal.isOpen} isMinimized={windows.terminal.isMinimized} onClick={() => toggleWindow("terminal")} onClose={() => closeWindow("terminal")} />
        
        <div className="w-px h-8 bg-white/20 mx-1 shrink-0" />
        <button onClick={toggleGravity} className={`p-2 rounded-lg transition-colors ${gravityEnabled ? 'bg-yellow-600 text-white' : 'bg-slate-700 hover:bg-slate-500 text-white'}`}>
          <Zap size={20} />
        </button>
        <a href="mailto:maysalimp@gmail.com" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-500 transition-colors text-white"><Mail size={20} /></a>
      </div>
    </div>
  );
};

export default function SalimOS() {
  return (
    <ToastProvider>
      <AchievementsProvider>
        <SoundProvider>
          <Desktop />
        </SoundProvider>
      </AchievementsProvider>
    </ToastProvider>
  );
}