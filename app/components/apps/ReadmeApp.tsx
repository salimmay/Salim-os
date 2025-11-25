export const ReadmeApp = () => {
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
