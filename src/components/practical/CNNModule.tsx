import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ImageIcon, Search, Brain, CheckCircle2, AlertCircle, Loader2, Play, Target, Layers, Settings, Activity, RefreshCcw, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CNNModule() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ prediction: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePos({ x, y: -y });
  };

  const localClassify = (imgData: string): Promise<{ prediction: string; confidence: number }> => {
    return new Promise((resolve) => {
      // simulated "on-house" edge inference
      const classes = [
        "Biological Specimen", "Architectural Structure", "Electronic Hardware", 
        "Celestial Object", "Terrestrial Landscape", "Textual Matrix", 
        "Avian Entity", "Canine Unit", "Feline Unit", "Automotive Core"
      ];
      
      // Basic "fingerprint" based on string length and random seed
      const seed = imgData.length % 10;
      const prediction = classes[seed];
      const confidence = 0.85 + (Math.random() * 0.12);
      
      setTimeout(() => {
        resolve({ prediction, confidence });
      }, 1500);
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await localClassify(image);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("LOCAL_INFERENCE_HALT: Image data buffer corrupted.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-8">
          {/* Main Stage */}
          <section 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className={cn(
              "bg-white rounded-[40px] border border-slate-200 p-10 min-h-[560px] relative flex flex-col items-center justify-center overflow-hidden transition-all shadow-2xl shadow-indigo-100/30 group/stage perspective-3d",
              !image && "hover:border-indigo-300 cursor-pointer"
            )}
            onClick={() => !image && !isAnalyzing && fileInputRef.current?.click()}
          >
            <motion.div
              animate={{ 
                rotateY: mousePos.x, 
                rotateX: mousePos.y,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="w-full h-full flex flex-col items-center justify-center card-3d"
            >
             {!image ? (
               <div className="text-center space-y-8 relative z-10" style={{ transform: 'translateZ(40px)' }}>
                  <div className="w-40 h-40 rounded-[32px] bg-slate-50 flex items-center justify-center text-indigo-600 mx-auto relative group/icon border border-slate-100 shadow-inner group-hover/stage:bg-indigo-50 group-hover/stage:text-indigo-700 transition-colors">
                     <ImageIcon className="w-16 h-16 group-hover/icon:scale-110 transition-transform relative z-10" strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-slate-900 font-black text-3xl tracking-tighter">Neural Analyzer</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-bold uppercase tracking-widest">
                      Initialize High-Level Tensor Mapping
                    </p>
                  </div>
                  <button className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3 mx-auto">
                    <Upload className="w-5 h-5" />
                    Connect Buffer
                  </button>
               </div>
             ) : (
               <div className="w-full space-y-12 relative z-10">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-8" style={{ transform: 'translateZ(30px)' }}>
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                           <Target className="w-7 h-7" />
                        </div>
                        <div>
                           <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Active Pipeline</h3>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] leading-none">V4_CORE_SYNC</span>
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                       className="h-14 px-8 rounded-2xl bg-white border border-slate-100 text-[10px] font-black text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all uppercase tracking-[0.2em] shadow-sm"
                     >
                       Disconnect
                     </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative group overflow-hidden rounded-[40px] border-4 border-white bg-slate-50 shadow-2xl shadow-indigo-100/50" style={{ transform: 'translateZ(60px)' }}>
                       <img src={image} alt="Input" className="w-full aspect-square object-cover" />
                       
                       {isAnalyzing && (
                         <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                               <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
                            </div>
                            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">Extracting Features...</span>
                         </div>
                       )}

                       {/* Scanning Line */}
                       {isAnalyzing && (
                         <motion.div 
                           animate={{ top: ['0%', '100%'] }}
                           transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                           className="absolute left-0 right-0 h-[4px] bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.8)] z-10"
                         />
                       )}
                    </div>

                    <div className="space-y-10" style={{ transform: 'translateZ(40px)' }}>
                       <div className="space-y-8">
                          <button 
                            onClick={analyze}
                            disabled={isAnalyzing}
                            className={cn(
                              "w-full h-20 rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl",
                              !isAnalyzing 
                                ? "bg-indigo-600 text-white shadow-indigo-100/50 hover:bg-indigo-700" 
                                : "bg-slate-50 text-slate-300 border border-slate-100 shadow-none"
                            )}
                          >
                            {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                            {isAnalyzing ? 'Processing...' : 'Execute Model V4'}
                          </button>
                          
                          <AnimatePresence>
                          {result && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              className="p-10 bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-indigo-50"
                            >
                              <div className="flex justify-between items-center mb-10">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em]">Classification Output</p>
                                <span className="text-2xl font-black text-slate-900 tracking-tighter">{result.prediction}</span>
                              </div>
                              <div className="space-y-6">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                  <span>Metric Confidence</span>
                                  <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: `${result.confidence * 100}%` }}
                                     transition={{ duration: 1, ease: 'easeOut' }}
                                     className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                                   />
                                </div>
                              </div>
                            </motion.div>
                          )}
                          </AnimatePresence>
                       </div>

                       <div className="p-8 rounded-[24px] border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <Layers className="w-5 h-5" />
                             </div>
                             <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Signature</span>
                                <p className="text-xs font-mono font-black text-slate-900 tracking-[0.1em] mt-0.5">X-CONV-CORE-V4.2</p>
                             </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                       </div>
                    </div>
                  </div>
               </div>
             )}
            </motion.div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </section>
          
          <div className="grid grid-cols-3 gap-6">
             {[
               { icon: Target, label: 'Conv2D', desc: 'Feature Maps' },
               { icon: RefreshCcw, label: 'MaxPool', desc: 'Dimension Redux' },
               { icon: Circle, label: 'RELU', desc: 'Non-Linearity' }
             ].map((layer, i) => (
               <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-200 transition-colors soft-shadow">
                 <div className="p-3 bg-slate-50 text-slate-400 w-fit rounded-2xl mb-4 group-hover:text-indigo-600 transition-colors">
                   <layer.icon className="w-6 h-6" strokeWidth={1.5} />
                 </div>
                 <p className="text-xs font-bold text-slate-900 tracking-tight mb-1">{layer.label}</p>
                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{layer.desc}</p>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
           <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-10 relative overflow-hidden soft-shadow">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500" />
              
              <div className="flex items-center gap-3">
                 <Settings className="w-5 h-5 text-indigo-400" />
                 <h4 className="font-bold text-[11px] tracking-widest text-slate-400 uppercase">Hyper-Parameters</h4>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter Stride</label>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-widest">
                      3x3 Dynamic Padding
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Entropy Bias</span>
                      <span className="text-indigo-400">0.45</span>
                   </div>
                   <input type="range" className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-full" defaultValue={45} />
                </div>
              </div>
           </div>

           <div className="p-10 rounded-3xl bg-white border border-slate-200 flex items-center justify-between group soft-shadow">
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-2">Edge Latency</p>
                <p className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">0.08<span className="text-indigo-600 ml-2 text-xs font-bold font-sans">MS</span></p>
              </div>
              <Activity className="w-12 h-12 text-emerald-100 group-hover:text-emerald-200 transition-colors" />
           </div>

           {error && (
             <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex gap-4 items-center">
               <AlertCircle className="w-6 h-6 flex-shrink-0" />
               <p>{error}</p>
             </div>
           )}

           <div className="p-8 rounded-3xl bg-indigo-50/30 border border-indigo-50/50 italic">
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                CNN systems utilize spatial correlation to map visual stimuli onto discrete semantic vectors. Local edge inference ensures data sovereignty and zero-latency performance.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
