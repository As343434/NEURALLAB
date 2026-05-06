import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Activity, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PropagationModule() {
  const [step, setStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.5);
  const [w, setW] = useState(0.8);
  const [learningRate, setLearningRate] = useState(0.1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const input = 1.0;
  const target = 0.5;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMousePos({ x, y: -y });
  };

  // Training Loop
  useEffect(() => {
    if (isTraining) {
      intervalRef.current = setInterval(() => {
        setEpoch((prev) => prev + 1);

        setW((prevW) => {
          const prediction = prevW * input;
          const currentLoss = Math.pow(prediction - target, 2);
          const gradient = 2 * (prediction - target) * input;

          setLoss(currentLoss);

          const newW = prevW - learningRate * gradient;

          if (currentLoss < 0.001) {
            setIsTraining(false);
          }

          return newW;
        });
      }, 80);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTraining, learningRate]); // Removed 'w'

  const reset = () => {
    setW(0.8);
    setEpoch(0);
    setLoss(0.5);
    setIsTraining(false);
    setMousePos({ x: 0, y: 0 });
  };

  const stepForward = useCallback(() => {
    setEpoch((e) => e + 1);
    setW((prevW) => {
      const prediction = prevW * input;
      const currentLoss = Math.pow(prediction - target, 2);
      setLoss(currentLoss);
      return prevW;
    });
  }, []);

  const stepBackward = useCallback(() => {
    setW((prevW) => {
      const prediction = prevW * input;
      const gradient = 2 * (prediction - target) * input;
      const newW = prevW - learningRate * gradient;
      
      const newLoss = Math.pow(newW * input - target, 2);
      setLoss(newLoss);
      setEpoch((e) => Math.max(0, e - 1));

      return newW;
    });
  }, [learningRate]);

  const toggleTraining = () => {
    setIsTraining((prev) => !prev);
  };

  return (
    <div className="space-y-12 pb-20 perspective-3d">
      <div className="grid lg:grid-cols-[1fr_420px] gap-12">
        <div className="space-y-10">
          {/* Visual Simulation */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            animate={{
              rotateY: mousePos.x,
              rotateX: mousePos.y,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
            className="p-12 rounded-[48px] bg-white border border-slate-100 shadow-2xl shadow-indigo-100/30 space-y-14 relative overflow-hidden card-3d"
          >
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10" style={{ transform: 'translateZ(30px)' }}>
              <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 flex items-center gap-4">
                <Activity className="w-6 h-6 text-indigo-500" />
                Training Protocol
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={stepForward}
                  disabled={isTraining}
                  className="px-6 py-3 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all disabled:opacity-50 shadow-sm"
                >
                  Forward Pulse
                </button>

                <button
                  onClick={stepBackward}
                  disabled={isTraining}
                  className="px-6 py-3 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 hover:bg-white hover:border-violet-100 transition-all disabled:opacity-50 shadow-sm"
                >
                  Back Prop
                </button>

                <div className="w-px h-10 bg-slate-100 mx-2 hidden md:block" />

                <button
                  onClick={toggleTraining}
                  className={cn(
                    'flex items-center gap-3 px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95',
                    isTraining
                      ? 'bg-rose-500 text-white shadow-rose-100'
                      : 'bg-indigo-600 text-white shadow-indigo-200'
                  )}
                >
                  <Play className={cn('w-3 h-3', isTraining && 'hidden')} />
                  {isTraining ? 'Abort Session' : 'Initiate Training'}
                </button>

                <button
                  onClick={reset}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-300 hover:text-slate-900 transition-all shadow-sm active:rotate-180 duration-500"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Path Visualization */}
            <div className="relative h-80 border-b border-slate-50 flex items-end justify-around px-12 pb-16 z-10">
              {/* ... (your SVG + nodes remain the same) ... */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 400 200" className="opacity-10 scale-125">
                  <path d="M 50 150 Q 200 10 350 150" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="12,12" />
                </svg>
              </div>

              {/* Input Node */}
              <div className="flex flex-col items-center gap-5 relative z-10" style={{ transform: 'translateZ(50px)' }}>
                <div className="w-20 h-20 rounded-[28px] border-4 border-slate-50 bg-white flex items-center justify-center font-black text-slate-400 shadow-xl">
                  {input.toFixed(1)}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Inp_Matrix</span>
              </div>

              {/* Weight Line */}
              <div className="relative flex-1 mx-16 h-0.5 bg-slate-100 mt-[-40px] self-center">
                {isTraining && (
                  <>
                    <motion.div
                      animate={{ x: ['-20%', '120%'], opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="absolute top-[-3px] w-24 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    />
                    <motion.div
                      animate={{ x: ['120%', '-20%'], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute bottom-[-3px] w-28 h-1.5 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"
                    />
                  </>
                )}

                <motion.div
                  animate={{ scale: isTraining ? [1, 1.1, 1] : 1 }}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-16 px-6 py-2.5 rounded-2xl border border-indigo-100 bg-white shadow-2xl text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] z-20"
                >
                  ω_VAL: {w.toFixed(4)}
                </motion.div>
              </div>

              {/* Prediction Node */}
              <div className="flex flex-col items-center gap-5 relative z-10" style={{ transform: 'translateZ(70px)' }}>
                <motion.div
                  animate={{
                    borderColor: loss < 0.01 ? '#10b981' : '#6366f1',
                    scale: isTraining ? [1, 1.05, 1] : 1,
                  }}
                  className={cn(
                    'w-32 h-32 rounded-full border-4 bg-white flex flex-col items-center justify-center font-black transition-all shadow-2xl',
                    loss < 0.01 ? 'text-emerald-600 border-emerald-500 shadow-emerald-100' : 'text-indigo-600 border-indigo-500 shadow-indigo-100'
                  )}
                >
                  <span className="text-3xl tracking-tighter">{(w * input).toFixed(2)}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-50">Vector</span>
                </motion.div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Pred_Exit</span>
              </div>

              {/* Target */}
              <div className="absolute right-12 top-0 flex flex-col items-center gap-4" style={{ transform: 'translateZ(40px)' }}>
                <div className="p-4 rounded-full bg-rose-50 shadow-inner border border-rose-100">
                  <Target className="w-6 h-6 text-rose-500 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Target_Min</p>
                  <p className="text-xl font-black text-rose-600 tabular-nums tracking-tighter">{target}</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-10 relative z-10" style={{ transform: 'translateZ(20px)' }}>
              <div className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100/50 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-slate-400 font-black mb-4 tracking-[0.2em]">Iteration Epoch</p>
                <p className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">{epoch}</p>
              </div>
              <div className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100/50 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-slate-400 font-black mb-4 tracking-[0.2em]">Entropy Loss</p>
                <p className={cn('text-4xl font-black tabular-nums transition-colors tracking-tighter', loss < 0.01 ? 'text-emerald-500' : 'text-rose-500')}>
                  {loss.toFixed(6)}
                </p>
              </div>
              <div className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100/50 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-slate-400 font-black mb-4 tracking-[0.2em]">Gradient Delta</p>
                <p className="text-4xl font-black text-violet-600 tabular-nums tracking-tighter">
                  {(2 * (w * input - target) * input).toFixed(4)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Education Blocks */}
          <div className="grid md:grid-cols-2 gap-16 px-6">
            <div className="space-y-4">
              <h4 className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest text-indigo-600">
                <ArrowRight className="w-4 h-4" />
                Feed Forward
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Synaptic signal propagation through weighted channels. Inputs are modulated by connection strengths to approximate the output manifold.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest text-violet-600">
                <ArrowLeft className="w-4 h-4" />
                Back-Propagation
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Error signal reflection. Calculating the partial derivative of the loss function with respect to weights using the recursive chain rule.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Controls - unchanged */}
        <aside className="p-12 rounded-[48px] bg-slate-900 border border-slate-800 h-fit space-y-12 sticky top-24 shadow-2xl overflow-hidden text-white">
          {/* ... your sidebar code ... */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Rate (η)</label>
                <span className="text-[12px] font-black text-indigo-400 font-mono bg-indigo-500/10 px-3 py-1 rounded-full">{learningRate}</span>
              </div>
              <div className="flex gap-3">
                {[0.01, 0.1, 0.5].map((lr) => (
                  <button
                    key={lr}
                    onClick={() => setLearningRate(lr)}
                    className={cn(
                      'flex-1 py-4 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-[0.2em] active:scale-95',
                      learningRate === lr
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    )}
                  >
                    {lr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
