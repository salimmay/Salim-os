import { User, Code, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";
import { BehanceIcon } from "../utils/BehanceIcon";

export const BioApp = () => (
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
          <span className="text-sm font-medium text-slate-700">Node.js, Express, Spring Boot, Laravel</span>
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
