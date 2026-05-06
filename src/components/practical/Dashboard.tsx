import { useState } from 'react';
import { motion } from 'motion/react';
import { Network, Target, Cpu, Brain, Database, ArrowRight, ShieldCheck, Activity, Terminal, Zap } from 'lucide-react';
import { STUDENT_INFO } from '../../constants';
import { cn } from '../../lib/utils';

function DashboardCard({ card, i, setActiveTab }: { card: any, i: number, setActiveTab: (tab: any) => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 15;
    const y = (e.clientY - rect.top - rect.height / 2) / 15;
    setMousePos({ x, y: -y });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: mousePos.y,
        rotateY: mousePos.x,
        z: mousePos.x !== 0 ? 50 : 0
      }}
      transition={{ 
        delay: i * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 30
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(card.id)}
      className="group p-10 bg-white border border-slate-100 rounded-[48px] text-left shadow-2xl shadow-indigo-100/30 card-3d relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10" style={{ transform: 'translateZ(40px)' }}>
          <div className={cn(
            "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-lg group-hover:shadow-indigo-200",
            card.color === 'text-indigo-600' && "bg-indigo-50",
            card.color === 'text-emerald-600' && "bg-emerald-50",
            card.color === 'text-blue-600' && "bg-blue-50",
            card.color === 'text-purple-600' && "bg-purple-50",
            card.color === 'text-rose-600' && "bg-rose-50",
            card.color === 'text-amber-600' && "bg-amber-50",
            "group-hover:bg-indigo-600 group-hover:text-white"
          )}>
            <card.icon className="w-7 h-7" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">NODE_{card.module}</span>
            <div className="w-8 h-1 bg-slate-100 rounded-full mt-2 group-hover:bg-indigo-200 transition-colors" />
          </div>
        </div>

        <div className="space-y-4" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{card.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
            {card.desc}
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50 relative z-10" style={{ transform: 'translateZ(20px)' }}>
        <span className="text-[11px] font-black text-indigo-400 group-hover:text-indigo-600 transition-colors flex items-center gap-3 uppercase tracking-widest">
          ACCESS CORE
          <div className="w-2 h-2 rounded-full bg-indigo-600 scale-0 group-hover:scale-100 transition-transform shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
        </span>
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all transform group-hover:rotate-12 shadow-sm">
           <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-transparent to-indigo-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-[80px] group-hover:bg-indigo-200/50 transition-colors duration-1000" />
    </motion.button>
  );
}

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const cards = [
    { id: 'perceptron', title: 'Perceptron Models', icon: Cpu, color: 'text-indigo-600', module: '01', desc: 'Configuring SLP & MLP architectures for non-linear decision boundary computations.' },
    { id: 'propagation', title: 'Optimization Engine', icon: Activity, color: 'text-emerald-600', module: '02', desc: 'Real-time back-propagation visualizer utilizing stochastic gradient descent (SGD).' },
    { id: 'cnn', title: 'CNN Classifier', icon: Target, color: 'text-blue-600', module: '03', desc: 'Deep feature extraction via multi-layer convolutional ResNet-50 architecture.' },
    { id: 'rnn', title: 'RNN-LSTM Pulse', icon: Network, color: 'text-purple-600', module: '04', desc: 'Temporal sequence analysis and sentiment vectors for linguistic recognition.' },
    { id: 'opencv', title: 'Face Detection', icon: Database, color: 'text-rose-600', module: '05', desc: 'Live stream face detection using cascade classifiers and neural bounding boxes.' },
    { id: 'hopfield', title: 'Hopfield Matrix', icon: Brain, color: 'text-amber-600', module: '06', desc: 'Auto-associative memory network for recursive pattern restoration and retrieval.' },
  ];

  return (
    <div className="space-y-12 pb-20 perspective-3d">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[56px] bg-white border-4 border-white p-12 shadow-2xl shadow-indigo-100/40 card-3d">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-[120px] -ml-48 -mb-48" />
         
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-8 max-w-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em]">Secure_Node_V4</span>
                   </div>
                   <div className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-brand" />
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">Compute_Active</span>
                   </div>
                </div>
                <h2 className="text-slate-900 font-black text-6xl tracking-tighter leading-[0.9]">
                  NEURAL <br />
                  <span className="text-brand">WORKSPACE</span>
                </h2>
                <p className="text-slate-500 text-lg font-bold leading-relaxed tracking-tight max-w-lg">
                  Unified command center for synaptic modeling and high-fidelity cognitive simulation. Optimized for real-time inference and recursive architectural research.
                </p>
              </div>

              <div className="flex items-center gap-12 pt-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center border-4 border-white shadow-xl text-white font-black text-xl">
                    {STUDENT_INFO.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1.5">LEAD_SCIENTIST</span>
                    <span className="text-slate-900 text-sm font-black uppercase tracking-tight">{STUDENT_INFO.name}</span>
                  </div>
                </div>
                <div className="w-px h-12 bg-slate-100" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1.5">AUTH_CRED_ID</span>
                  <span className="text-slate-900 text-sm font-mono font-black tabular-nums tracking-tighter">{STUDENT_INFO.rollNo}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block lg:w-[480px] lg:h-[480px] shrink-0 preserve-3d">
               <motion.div 
                 initial={{ rotateY: -15 }}
                 animate={{ rotateY: -5 }}
                 whileHover={{ rotateY: -15, rotateX: 10, scale: 1.05 }}
                 className="relative w-full h-full rounded-[80px] overflow-hidden bg-slate-950 shadow-3xl shadow-indigo-200 border-[12px] border-white group cursor-pointer preserve-3d"
                 style={{ transform: 'translateZ(100px)' }}
               >
                  <img 
                    src="https://scitechdaily.com/images/Left-Right-Brain-Signals.gif" 
                    alt="Neural Network Animation" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3000ms] ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-md">
                     <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />
                        <Brain className="w-24 h-24 text-white mb-6 animate-pulse relative z-10" />
                     </div>
                     <p className="text-white font-black text-sm tracking-[0.4em] uppercase relative z-10">CORE_SYNC_ESTABLISHED</p>
                  </div>

                  <div className="absolute bottom-12 left-0 right-0 text-center" style={{ transform: 'translateZ(60px)' }}>
                    <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/10 backdrop-blur-2xl rounded-full border border-white/30 shadow-2xl">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" />
                      <span className="text-[12px] font-black text-white uppercase tracking-[0.3em]">ENGINE_SYS_V4_LTD</span>
                    </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Grid of Modules */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 preserve-3d">
        {cards.map((card, i) => (
          <DashboardCard key={card.id} card={card} i={i} setActiveTab={setActiveTab} />
        ))}
      </section>
    </div>
  );
}
