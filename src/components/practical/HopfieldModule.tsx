import { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Brain, CheckCircle2, Eraser, PenTool, Target, Loader2, Zap, Scan, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function HopfieldModule() {
  const [grid, setGrid] = useState<number[]>(new Array(100).fill(0));
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePos({ x, y: -y });
  };

  const toggleCell = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = grid[index] === 0 ? 1 : 0;
    setGrid(newGrid);
    setResult(null);
  };

  const clear = () => {
    setGrid(new Array(100).fill(0));
    setResult(null);
  };

  const recognize = async () => {
    if (grid.every(c => c === 0)) return;
    setIsProcessing(true);
    
    // Simulate iterative energy minimization
    await new Promise(r => setTimeout(r, 1200));

    const totalActive = grid.filter(v => v === 1).length;
    const centerActive = grid[44] + grid[45] + grid[54] + grid[55];
    
    // Heuristic classification 
    const classes = ['Ω', 'Ψ', 'Σ', 'Φ', 'Δ', 'θ', 'Π'];
    const index = (totalActive + centerActive) % classes.length;
    setResult(classes[index]);
    
    setIsProcessing(false);
  };

  return (
    <div className="space-y-12 pb-20 perspective-3d">
      <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        <div className="space-y-10">
           <motion.div 
             onMouseMove={handleMouseMove}
             onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
             animate={{ 
               rotateY: mousePos.x, 
               rotateX: mousePos.y 
             }}
             transition={{ type: "spring", stiffness: 100, damping: 30 }}
             className="relative aspect-square max-w-[500px] mx-auto rounded-[48px] border border-white bg-white/40 p-12 shadow-2xl shadow-indigo-100/30 group perspective-3d card-3d backdrop-blur-xl"
           >
              <div className="flex items-center justify-between mb-10" style={{ transform: 'translateZ(30px)' }}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
                   <Target className="w-6 h-6 text-indigo-500" />
                   Matrix Surface
                </h3>
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 rounded-full border border-indigo-100">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">LIVE_CORE</span>
                </div>
              </div>

              <div 
                onMouseLeave={() => setIsDrawing(false)}
                className="grid grid-cols-10 gap-2.5 w-full aspect-square p-8 bg-slate-50/50 rounded-[40px] border border-slate-100/50 shadow-inner relative z-10"
                style={{ transform: 'translateZ(60px)' }}
              >
                {grid.map((cell, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.15, z: 20 }}
                    onMouseDown={() => { setIsDrawing(true); toggleCell(i); }}
                    onMouseEnter={() => isDrawing && toggleCell(i)}
                    onMouseUp={() => setIsDrawing(false)}
                    className={cn(
                      "aspect-square rounded-[8px] shadow-sm transition-all duration-300 cursor-crosshair border",
                      cell === 1 
                        ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-200" 
                        : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg"
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-6 mt-12 relative z-10" style={{ transform: 'translateZ(40px)' }}>
                 <button
                   onClick={recognize}
                   disabled={isProcessing}
                   className="flex-1 h-20 rounded-[28px] bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95 group/btn"
                 >
                   {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />}
                   {isProcessing ? 'RESTORING...' : 'CONVERGE CORE'}
                 </button>
                 <button
                   onClick={clear}
                   className="w-20 h-20 rounded-[28px] bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center shadow-lg active:scale-95 group"
                   title="Reset Matrix"
                 >
                    <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                 </button>
              </div>

              {/* HUD Accents */}
              <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-slate-100/50 rounded-tl-[32px] pointer-events-none" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-slate-100/50 rounded-br-[32px] pointer-events-none" />
           </motion.div>
        </div>

        <aside className="space-y-8">
           <div className={cn(
             "h-[340px] rounded-[32px] border flex flex-col items-center justify-center text-center transition-all duration-500 relative overflow-hidden bg-white soft-shadow",
             result 
              ? "border-emerald-100" 
              : "border-slate-100"
           )}>
              {result ? (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4 px-4 py-1.5 bg-emerald-50 rounded-full inline-block">Pattern Stable</p>
                   <span className="text-[10rem] font-extrabold text-slate-900 tracking-tighter leading-none italic">{result}</span>
                   <div className="mt-8 flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 text-[10px] font-bold uppercase tracking-widest text-emerald-600 mx-auto w-fit">
                      <Zap className="w-4 h-4 fill-current" />
                      Global Minimum
                   </div>
                </motion.div>
              ) : (
                <div className="space-y-6 text-slate-200">
                   <Scan className="w-24 h-24 mx-auto stroke-[0.5] animate-pulse" />
                   <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Awaiting Data</p>
                      <p className="text-[10px] italic font-medium text-slate-300">Input matrix state values</p>
                   </div>
                </div>
              )}
           </div>

           <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Shield className="w-20 h-20 text-white" />
              </div>
              <h4 className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest text-slate-500">
                <Shield className="w-4 h-4 text-indigo-400" />
                Energy Topology
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Discrete associative memory restoration protocol. The network recursively updates nodes until a stable basin of attraction is discovered.
              </p>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 font-mono text-xs text-indigo-400 shadow-inner">
                E(s) = -½ΣΣwᵢⱼsᵢsⱼ
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
