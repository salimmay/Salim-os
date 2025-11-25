"use client";

import React, { useState, useEffect, useRef } from "react";

const SoundContext = React.createContext<any>(null);

export const SoundProvider = ({ children }: any) => {
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

export const useSound = () => {
  const context = React.useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};
