"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { SALIM_AI_RESPONSES } from "../constants/data";
import { useSound } from "../contexts/SoundContext";

export const SalimAIChat = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
