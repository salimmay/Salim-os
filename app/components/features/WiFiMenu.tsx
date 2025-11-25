"use client";

import { motion } from "framer-motion";
import { Wifi, Lock, ChevronRight } from "lucide-react";
import { WIFI_NETWORKS } from "../constants/data";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

export const WiFiMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
