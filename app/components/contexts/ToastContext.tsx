"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, Trophy } from "lucide-react";

const ToastContext = React.createContext<any>(null);

export const ToastProvider = ({ children }: any) => {
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

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
