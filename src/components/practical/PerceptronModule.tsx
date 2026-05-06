import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Play, RefreshCcw, Cpu, Layers, Zap, Terminal } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PerceptronModule() {
  const [type, setType] = useState<'SLP' | 'MLP'>('SLP');
  const [inputs, setInputs] = useState<[number, number]>([0, 0]);
  const [weights, setWeights] = useState<[number, number]>([0.5, 0.5]);
  const [bias, setBias] = useState(-0.7);
  const [output, setOutput] = useState(0);

  // Simple step activation function
  const stepFunction = (x: number) => (x >= 0 ? 1 : 0);
  // Sigmoid for MLP representation
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePos({ x, y: -y });
  };

  useEffect(() => {
    if (type === 'SLP') {
      const sum = inputs[0] * weights[0] + inputs[1] * weights[1] + bias;
      setOutput(stepFunction(sum));
    } else {
      // Simulated XOR-like MLP logic
      // Hidden layer nodes
      const h1 = sigmoid(inputs[0] * 20 + inputs[1] * -20 - 10);
      const h2 = sigmoid(inputs[0] * -20 + inputs[1] * 20 - 10);
      // Output node
      const z = sigmoid(h1 * 20 + h2 * 20 - 10);
      setOutput(z > 0.5 ? 1 : 0);
    }
  }, [inputs, weights, bias, type]);

  const setGate = (gate: 'AND' | 'OR' | 'NAND' | 'XOR') => {
    if (gate === 'AND') {
      setType('SLP');
      setWeights([0.5, 0.5]);
      setBias(-0.7);
    } else if (gate === 'OR') {
      setType('SLP');
      setWeights([0.5, 0.5]);
      setBias(-0.2);
    } else if (gate === 'NAND') {
      setType('SLP');
      setWeights([-0.5, -0.5]);
      setBias(0.7);
    } else if (gate === 'XOR') {
      setType('MLP');
    }
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex gap-4 p-2 bg-white/50 backdrop-blur-md border border-slate-100 rounded-[28px] w-fit shadow-sm">
        <button
          onClick={() => setType('SLP')}
          className={cn(
            "px-10 py-4 rounded-[20px] text-[11px] font-black transition-all uppercase tracking-[0.2em]",
            type === 'SLP' ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-400 hover:text-slate-900"
          )}
        >
          LRN_LINEAR
        </button>
        <button
          onClick={() => setType('MLP')}
          className={cn(
            "px-10 py-4 rounded-[20px] text-[11px] font-black transition-all uppercase tracking-[0.2em]",
            type === 'MLP' ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-400 hover:text-slate-900"
          )}
        >
          LRN_NONLINEAR
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start perspective-3d">
        <div className="space-y-10">
          {/* Visualization Area */}
          <section 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="relative aspect-video rounded-[64px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden p-16 shadow-2xl shadow-indigo-100/40 group perspective-3d"
          >
            <motion.div 
              animate={{ 
                rotateY: mousePos.x, 
                rotateX: mousePos.y,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="relative flex items-center justify-between w-full max-w-2xl px-12 z-10 card-3d preserve-3d"
            >
              {/* Inputs */}
              <div className="space-y-24" style={{ transform: 'translateZ(60px)' }}>
                {[0, 1].map((i) => (
                  <div key={i} className="relative flex items-center gap-8 group/node preserve-3d">
                    <button
                      onClick={() => {
                        const newInputs = [...inputs] as [number, number];
                        newInputs[i] = inputs[i] === 0 ? 1 : 0;
                        setInputs(newInputs);
                      }}
                      className={cn(
                        "w-16 h-16 rounded-[24px] border-4 flex items-center justify-center font-black text-2xl transition-all cursor-pointer select-none relative z-10",
                        inputs[i] === 1 
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-2xl shadow-indigo-200" 
                          : "bg-white border-slate-100 text-slate-200 hover:border-indigo-200"
                      )}
                    >
                      {inputs[i]}
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">INP_0{i+1}</div>
                  </div>
                ))}
              </div>

              {/* Hidden Layer (only for MLP) */}
              {type === 'MLP' && (
                <div className="flex flex-col gap-16" style={{ transform: 'translateZ(30px)' }}>
                   {[0, 1].map((i) => (
                     <div key={i} className="w-16 h-16 rounded-full border-2 border-indigo-50 bg-white/80 backdrop-blur-xl flex items-center justify-center text-[10px] font-black text-indigo-400 relative z-10 shadow-xl shadow-indigo-100/20">
                        HID_0{i+1}
                     </div>
                   ))}
                </div>
              )}

              {/* Node (Output Layer Node) */}
              <div className="relative" style={{ transform: 'translateZ(100px)' }}>
                <motion.div 
                   animate={{ 
                     scale: output === 1 ? [1, 1.05, 1] : 1,
                     boxShadow: output === 1 ? "0 0 50px rgba(99, 102, 241, 0.4)" : "0 0 0 rgba(0,0,0,0)"
                   }}
                   className={cn(
                     "w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-700 relative z-10",
                     output === 1 ? "border-indigo-600 bg-indigo-50 shadow-2xl shadow-indigo-100" : "border-slate-50 bg-white/50 backdrop-blur-sm"
                   )}
                >
                  <div className="text-center">
                    <div className="text-[11px] uppercase font-black text-indigo-300 mb-2 tracking-[0.3em]">Decision</div>
                    <div className="text-6xl font-black text-slate-900 leading-none">{output}</div>
                  </div>
                </motion.div>
                {type === 'SLP' && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl border border-slate-100 bg-white shadow-xl text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] whitespace-nowrap">
                    THRESHOLD_VAL: {bias.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Lines Visualization */}
              <div className="absolute inset-0 pointer-events-none opacity-60" style={{ transform: 'translateZ(10px)' }}>
                <svg width="100%" height="100%" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow">
                       <feGaussianBlur stdDeviation="3" result="blur" />
                       <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {type === 'SLP' ? (
                    <>
                      <line x1="20%" y1="35%" x2="55%" y2="50%" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
                      <line x1="20%" y1="65%" x2="55%" y2="50%" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
                    </>
                  ) : (
                    <>
                      <line x1="18%" y1="35%" x2="42%" y2="40%" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" />
                      <line x1="18%" y1="35%" x2="42%" y2="60%" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" />
                      <line x1="18%" y1="65%" x2="42%" y2="40%" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" />
                      <line x1="18%" y1="65%" x2="42%" y2="60%" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" />
                      
                      <line x1="48%" y1="40%" x2="65%" y2="50%" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="2" />
                      <line x1="48%" y1="60%" x2="65%" y2="50%" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="2" />
                    </>
                  )}
                  <line x1="82%" y1="50%" x2="95%" y2="50%" stroke="#6366f1" strokeWidth="3" strokeDasharray="10 10" className="animate-pulse" filter="url(#glow)" />
                </svg>
              </div>

              {/* Final Output */}
              <div className="flex flex-col items-center gap-6 relative z-10" style={{ transform: 'translateZ(50px)' }}>
                <div className={cn(
                  "w-20 h-20 rounded-[32px] flex items-center justify-center border-4 transition-all duration-700",
                  output === 1 ? "bg-emerald-500 border-emerald-400 shadow-2xl shadow-emerald-100" : "bg-white border-slate-50 text-slate-100"
                )}>
                  {output === 1 ? <Zap className="w-10 h-10 text-white fill-current animate-pulse" /> : <RefreshCcw className="w-8 h-8 animate-spin-slow opacity-10" />}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">OUT_PULSE</div>
              </div>
            </motion.div>
            
            {/* HUD Decoration */}
            <div className="absolute top-10 right-12 text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] text-right leading-relaxed opacity-50">
               INF_CORE: STABLE<br />
               LYR_TYP: {type}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-10 rounded-[48px] bg-white border border-slate-100 shadow-2xl shadow-indigo-100/20">
              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3">
                <Cpu className="w-4 h-4 text-indigo-500" />
                PRESET_LOGIC_GATES
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {['AND', 'OR', 'NAND', 'XOR'].map((gate) => (
                  <button
                    key={gate}
                    onClick={() => setGate(gate as any)}
                    className="py-5 text-[11px] font-black bg-slate-50 text-slate-500 rounded-[20px] border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-[0.2em] active:scale-95 shadow-sm"
                  >
                    {gate}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-10 rounded-[48px] bg-slate-900 border border-slate-800 relative overflow-hidden group shadow-2xl shadow-slate-200">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Terminal className="w-24 h-24 text-white" />
              </div>
              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 mb-8">Activ_Logic_Buffer</h4>
              <div className="p-6 h-32 flex items-center justify-center rounded-[32px] bg-white/5 border border-white/10 font-mono text-sm text-indigo-400 shadow-inner">
                {type === 'SLP' ? 'Σ(w_i · x_i + b) ≥ 0' : 'σ(ΣW_h · H(x)) > 0.5'}
              </div>
            </div>
          </div>
        </div>

        {/* Panel */}
        <aside className="p-12 rounded-[56px] bg-white border border-slate-100 space-y-12 relative overflow-hidden shadow-2xl shadow-indigo-100/40">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600/10" />
          
          <div className="flex items-center gap-4 mb-4">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-900 leading-none">Synaptic_Weights</h3>
          </div>

          {[
            { label: 'Weight_Input_01', val: weights[0], set: (v: number) => setWeights([v, weights[1]]) },
            { label: 'Weight_Input_02', val: weights[1], set: (v: number) => setWeights([weights[0], v]) },
            { label: 'Global_Bias_Vector', val: bias, set: setBias },
          ].map((slider, i) => (
            <div key={i} className="space-y-8">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{slider.label}</label>
                <span className="text-xl font-black text-indigo-600 font-mono tracking-tighter tabular-nums">{slider.val.toFixed(2)}</span>
              </div>
              <div className="relative group">
                 <input 
                  type="range" min="-1" max="1" step="0.1" 
                  value={slider.val} 
                  onChange={(e) => slider.set(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                 />
                 <div className="absolute -bottom-4 left-0 w-full flex justify-between px-1">
                    <span className="text-[8px] font-black text-slate-200">-1</span>
                    <span className="text-[8px] font-black text-slate-200">0</span>
                    <span className="text-[8px] font-black text-slate-200">+1</span>
                 </div>
              </div>
            </div>
          ))}

          <div className="pt-12 border-t border-slate-50">
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider">
              Synaptic weight modulation realigns the hyper-plane boundary within the multidimensional decision vector space. 
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
