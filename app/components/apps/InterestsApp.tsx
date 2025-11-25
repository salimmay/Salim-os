import { HeartHandshake, Gamepad2, TreePine, Coffee, BrainCircuit } from "lucide-react";

export const InterestsApp = () => {
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
