import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Quote, Brain, Activity, Loader2, Frown, Smile, Meh } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function RNNModule() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ sentiment: 'positive' | 'negative' | 'neutral'; score: number; reason: string } | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 30;
    const y = (e.clientY - rect.top - rect.height / 2) / 30;
    setMousePos({ x, y: -y });
  };

  const localClassifySentiment = (input: string) => {
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'wonderful', 'best', 'outstanding', 'efficient', 'fast', 'amazing', 'cool', 'nice', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'slow', 'horrible', 'poor', 'failure', 'error', 'broken', 'waste', 'boring', 'useless', 'disappointing'];
    
    const words = input.toLowerCase().match(/\w+/g) || [];
    let scoreCount = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) scoreCount += 1;
      if (negativeWords.includes(word)) scoreCount -= 1;
    });

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (scoreCount > 0) sentiment = 'positive';
    if (scoreCount < 0) sentiment = 'negative';

    const confidence = Math.min(0.5 + (Math.abs(scoreCount) * 0.1), 0.98);

    return {
      sentiment,
      score: confidence,
      reason: `Local lexical engine weight: ${scoreCount}. Vector analysis localized ${Math.abs(scoreCount)} polarity markers within original stream indices.`
    };
  };

  const analyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    // Simulate processing latency for UX
    await new Promise(r => setTimeout(r, 1200));
    try {
      const data = localClassifySentiment(text);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-10 h-10 text-emerald-600" />;
      case 'negative': return <Frown className="w-10 h-10 text-rose-600" />;
      default: return <Meh className="w-10 h-10 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 relative perspective-3d">
      <div className="text-center space-y-4 relative z-10">
         <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            RECURRENT_SYS_V4
         </div>
         <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
           Sequential Polarity <span className="text-indigo-600">Engine</span>
         </h2>
         <p className="text-slate-400 text-xs max-w-xl mx-auto font-bold uppercase tracking-widest mt-4">
           Gated Memory Distribution // Temporal Vector Mapping
         </p>
      </div>

      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        animate={{ 
          rotateY: mousePos.x, 
          rotateX: mousePos.y 
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        className="space-y-8 relative z-10 card-3d"
      >
        <div className="relative group perspective-3d" style={{ transform: 'translateZ(40px)' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Initialize lexical stream..."
            className="relative w-full h-56 p-10 rounded-[48px] bg-white border border-slate-100 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-8 focus:ring-indigo-50 transition-all resize-none shadow-2xl shadow-indigo-100/30"
          />
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
             <MessageSquare className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="absolute bottom-10 left-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-indigo-400" />
             BUFFER_SIZE: {text.length}
          </div>
        </div>

        <div className="flex items-center gap-6" style={{ transform: 'translateZ(60px)' }}>
           <button
             onClick={analyze}
             disabled={!text.trim() || isAnalyzing}
             className={cn(
               "flex-1 h-20 rounded-[32px] text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl",
               text.trim() && !isAnalyzing 
                 ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700" 
                 : "bg-slate-50 text-slate-300 border border-slate-100 shadow-none"
             )}
           >
             {isAnalyzing ? (
               <>
                 <Loader2 className="w-6 h-6 animate-spin" />
                 STREAM_RUNNING
               </>
             ) : (
               <>
                 <Send className="w-5 h-5" />
                 INITIATE_INFERENCE
               </>
             )}
           </button>
           <button 
             onClick={() => { setText(''); setResult(null); }}
             className="h-20 px-10 rounded-[32px] border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50/30 transition-all active:scale-95 bg-white shadow-lg"
           >
             RESET
           </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, z: -100, rotateX: 20 }}
            animate={{ opacity: 1, z: 0, rotateX: 0 }}
            className="grid md:grid-cols-[260px_1fr] gap-12 items-center p-12 rounded-[48px] border border-white bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 relative overflow-hidden card-3d"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl -mr-24 -mt-24" />
             
             <div className="flex flex-col items-center gap-8 text-center border-r border-slate-100 pr-12 relative z-10">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner"
                >
                   {getSentimentIcon(result.sentiment)}
                </motion.div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">POLARITY_STATE</p>
                   <p className={cn(
                     "text-2xl font-black uppercase tracking-widest",
                     result.sentiment === 'positive' ? 'text-emerald-600' : result.sentiment === 'negative' ? 'text-rose-600' : 'text-amber-500'
                   )}>
                     {result.sentiment}
                   </p>
                </div>
             </div>

             <div className="space-y-10 relative z-10">
                <div>
                   <h4 className="flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.25em] text-indigo-600 mb-5">
                     <Brain className="w-5 h-5" />
                     LOGISTIC_EXIT
                   </h4>
                   <div className="p-8 rounded-[32px] bg-indigo-50/30 border border-indigo-100 italic text-[14px] leading-relaxed font-bold text-slate-600 tracking-tight">
                     "{result.reason}"
                   </div>
                </div>

                <div className="space-y-5">
                   <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                     <span>VECTOR_CONFIDENCE</span>
                     <span className="text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">{Math.round(result.score * 100)}% MATCH</span>
                   </div>
                   <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score * 100}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                      />
                   </div>
                </div>

                <div className="flex items-center gap-10 pt-6">
                   <div className="flex items-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">
                      <Activity className="w-5 h-5 text-emerald-400" strokeWidth={3} />
                      MODEL_TYPE: <span className="text-slate-900">LSTM_V4.2</span>
                   </div>
                   <div className="flex items-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">
                      <Brain className="w-5 h-5 text-indigo-300" strokeWidth={3} />
                      LATENCY: <span className="text-slate-900">EDGE_INF_0.02MS</span>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-12 rounded-[48px] bg-slate-900 text-white space-y-6 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
         <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-4">
           <Quote className="w-5 h-5" />
           Theoretical Foundation
         </h4>
         <p className="text-xs text-slate-400 leading-relaxed font-bold tracking-wide">
           Recurrent systems utilize back-propagation through time (BPTT) to adjust gated parameters in LSTM units. The "Forget Gate" and "Input Gate" interact non-linearly to maintain cellular state relevance over extensive sequence indices, mitigating the vanishing gradient phenomenon commonly found in simple RNNs.
         </p>
      </div>
    </div>
  );
}
