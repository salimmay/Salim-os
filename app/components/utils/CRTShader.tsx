export const CRTShader = () => (
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
