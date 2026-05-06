/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Network, 
  Cpu, 
  Image as ImageIcon, 
  MessageSquare, 
  User, 
  Scan, 
  PenTool,
  Home,
  ChevronRight,
  Github,
  GraduationCap
} from 'lucide-react';
import { cn } from './lib/utils';
import { STUDENT_INFO } from './constants';

// Internal Components
import Dashboard from './components/practical/Dashboard';
import PerceptronModule from './components/practical/PerceptronModule';
import PropagationModule from './components/practical/PropagationModule';
import CNNModule from './components/practical/CNNModule';
import RNNModule from './components/practical/RNNModule';
import OpenCVModule from './components/practical/OpenCVModule';
import HopfieldModule from './components/practical/HopfieldModule';

type ModuleId = 'home' | 'perceptron' | 'propagation' | 'cnn' | 'rnn' | 'opencv' | 'hopfield';

interface NavItem {
  id: ModuleId;
  label: string;
  icon: any;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: Home, description: 'Overview and Student Info' },
  { id: 'perceptron', label: 'Perceptron', icon: Cpu, description: 'Single & Multi-layer' },
  { id: 'propagation', label: 'Propagation', icon: MoveRightIcon, description: 'Forward / Backward / Gradient Descent' },
  { id: 'cnn', label: 'CNN Classifier', icon: ImageIcon, description: 'Cat vs Dog Image Recognition' },
  { id: 'rnn', label: 'RNN (LSTM)', icon: MessageSquare, description: 'Text Sentiment Analysis' },
  { id: 'opencv', label: 'OpenCV Detection', icon: Scan, description: 'Face Detection & Counting' },
  { id: 'hopfield', label: 'Hopfield Network', icon: PenTool, description: 'Character Recognition' },
];

function MoveRightIcon(props: any) {
  return (
    <div className="flex items-center">
      <ChevronRight {...props} />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ModuleId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;
    setMousePos({ x: moveX, y: moveY });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand selection:text-white"
    >
      <div className="relative flex h-screen overflow-hidden">
        {/* Animated Background Nodes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              x: mousePos.x, 
              y: mousePos.y 
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute -inset-20 opacity-[0.03] select-none"
          >
            <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-20 p-20 h-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 280 : 96,
            rotateY: isSidebarOpen ? 0 : -5,
            x: 0
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={cn(
            "relative z-40 flex flex-col sidebar-floating mesh-shades border border-white/40 overflow-hidden shrink-0 perspective-3d",
            isSidebarOpen ? "sidebar-curve-open" : "sidebar-curve-closed"
          )}
        >
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

          {/* Neural Node Decorations */}
          <div className="neural-node top-20 left-10 opacity-20" />
          <div className="neural-node top-40 right-10 opacity-10" />
          <div className="neural-node bottom-60 left-5 opacity-20" />

          <div className="p-6 h-32 flex items-center gap-5 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand/40 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-600 via-brand to-indigo-400 flex items-center justify-center shadow-2xl shadow-indigo-200 ring-4 ring-white transition-all group-hover:rotate-12 group-hover:scale-105 duration-500">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="font-extrabold text-2xl tracking-tighter text-slate-900 leading-none">NEURAL<span className="text-brand">LAB</span></span>
                <span className="text-[10px] text-indigo-400 font-black mt-2 tracking-[0.25em] uppercase">Enterprise 2026</span>
              </motion.div>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar relative z-10">
            {isSidebarOpen && <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-60">Base Logic</div>}
            {NAV_ITEMS.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center w-full gap-3 px-4 py-3.5 rounded-[20px] transition-all duration-500 group relative",
                    isActive 
                      ? "sidebar-active text-brand" 
                      : "text-slate-400 hover:text-slate-800 hover:bg-white/50"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-slate-100/50 text-slate-400 group-hover:bg-white group-hover:text-brand ring-1 ring-transparent group-hover:ring-slate-100"
                  )}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">{item.label}</span>
                    </div>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-glow" 
                      className="absolute inset-0 rounded-[20px] ring-2 ring-indigo-50 leading-none pointer-events-none" 
                    />
                  )}
                </button>
              );
            })}

            {isSidebarOpen && <div className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-60">Recognition</div>}
            {NAV_ITEMS.slice(3).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center w-full gap-3 px-4 py-3.5 rounded-[20px] transition-all duration-500 group relative",
                    isActive 
                      ? "sidebar-active text-brand" 
                      : "text-slate-400 hover:text-slate-800 hover:bg-white/50"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-slate-100/50 text-slate-400 group-hover:bg-white group-hover:text-brand ring-1 ring-transparent group-hover:ring-slate-100"
                  )}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">{item.label}</span>
                    </div>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-glow-2" 
                      className="absolute inset-0 rounded-[20px] ring-2 ring-indigo-50 leading-none pointer-events-none" 
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <footer className="p-6 relative z-10">
            {isSidebarOpen && (
              <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl mb-6 shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                
                <p className="text-[9px] text-indigo-200 font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  SYSTEM OPERATOR
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white tracking-tight">{STUDENT_INFO.name}</p>
                  <p className="text-[10px] text-indigo-300 font-bold tracking-widest">{STUDENT_INFO.rollNo}</p>
                </div>
              </div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center w-full h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100 hover:border-indigo-100 shadow-sm group"
            >
              <ChevronRight className={cn("w-5 h-5 transition-transform group-active:scale-95", isSidebarOpen && "rotate-180")} />
            </button>
          </footer>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 relative flex flex-col perspective-3d overflow-hidden">
          <header className="sticky top-0 z-30 h-24 px-10 flex items-center justify-between border-b border-white bg-white/40 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                  {NAV_ITEMS.find(i => i.id === activeTab)?.label}
                </h1>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">
                  {NAV_ITEMS.find(i => i.id === activeTab)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                 <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-100 text-emerald-600 text-[10px] font-black tracking-widest shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-50" />
                    NEURAL CORE ONLINE
                 </div>
                 <div className="w-px h-8 bg-slate-200" />
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">SYS.V2</span>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar container-3d">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, rotateY: 10, z: -100, x: 50 }}
                animate={{ opacity: 1, rotateY: 0, z: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -10, z: -100, x: -50 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="max-w-7xl mx-auto"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {activeTab === 'home' && <Dashboard setActiveTab={setActiveTab} />}
                {activeTab === 'perceptron' && <PerceptronModule />}
                {activeTab === 'propagation' && <PropagationModule />}
                {activeTab === 'cnn' && <CNNModule />}
                {activeTab === 'rnn' && <RNNModule />}
                {activeTab === 'opencv' && <OpenCVModule />}
                {activeTab === 'hopfield' && <HopfieldModule />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

