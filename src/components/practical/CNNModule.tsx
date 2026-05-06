import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ImageIcon, Play, Target, Layers, Settings, Activity, RefreshCcw, Circle, Zap, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CNNModule() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ 
    prediction: string; 
    confidence: number;
    top3: Array<{ label: string; confidence: number }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const demoImages = [
    { src: "https://picsum.photos/id/1015/600/600", label: "Mountain" },
    { src: "https://picsum.photos/id/237/600/600", label: "Puppy" },
    { src: "https://picsum.photos/id/1018/600/600", label: "Architecture" },
    { src: "https://picsum.photos/id/866/600/600", label: "Bird" },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMousePos({ x, y: -y });
  };

  const localClassify = (imgData: string): Promise<{
    prediction: string;
    confidence: number;
    top3: Array<{ label: string; confidence: number }>;
  }> => {
    return new Promise((resolve) => {
      const classes = [
        "Canine Unit", "Feline Unit", "Avian Entity", "Architectural Structure",
        "Terrestrial Landscape", "Celestial Body", "Automotive Form",
        "Biological Specimen", "Textual Matrix", "Electronic Hardware"
      ];

      const seed = imgData.length % 10;
      const mainPrediction = classes[seed];
      const confidence = 0.88 + Math.random() * 0.09;

      const top3 = [
        { label: mainPrediction, confidence },
        { label: classes[(seed + 3) % 10], confidence: confidence - 0.12 - Math.random() * 0.08 },
        { label: classes[(seed + 7) % 10], confidence: confidence - 0.25 - Math.random() * 0.1 },
      ].sort((a, b) => b.confidence - a.confidence);

      setTimeout(() => {
        resolve({ 
          prediction: mainPrediction, 
          confidence, 
          top3 
        });
      }, 1800);
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
        setActiveLayer(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    setActiveLayer(0);

    try {
      const data = await localClassify(image);
      setResult(data);
      
      // Simulate layer progression
      for (let i = 1; i <= 4; i++) {
        await new Promise(res => setTimeout(res, 400));
        setActiveLayer(i);
      }
    } catch (err) {
      setError("Inference pipeline encountered an anomaly.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadDemo = (src: string) => {
    setImage(src);
    setResult(null);
    setError(null);
    setActiveLayer(0);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setActiveLayer(0);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* Main Visual Area */}
        <div className="space-y-8">
          <section
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="bg-white rounded-[40px] border border-slate-200 p-10 min-h-[620px] relative overflow-hidden shadow-2xl shadow-indigo-100/30 perspective-3d"
          >
            <motion.div
              animate={{ rotateY: mousePos.x, rotateX: mousePos.y }}
              transition={{ type: "spring", stiffness: 80, damping: 25 }}
              className="relative w-full h-full card-3d"
            >
              {!image ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
                  <div className="w-44 h-44 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100">
                    <Brain className="w-24 h-24 text-indigo-500" strokeWidth={1} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">Convolutional Neural Engine</h2>
                    <p className="text-slate-500 mt-3 font-medium">Drop or upload an image to start feature extraction</p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                  >
                    <Upload className="w-5 h-5" /> Upload Image
                  </button>

                  <div className="flex gap-4 flex-wrap justify-center mt-6">
                    {demoImages.map((demo, i) => (
                      <button
                        key={i}
                        onClick={() => loadDemo(demo.src)}
                        className="text-xs px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl transition-all hover:shadow-md"
                      >
                        {demo.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                        <Target className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl tracking-tight">Live Inference Pipeline</h3>
                        <p className="text-emerald-600 text-sm font-mono">● CONVNET-V4.2 ACTIVE</p>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-200 rounded-2xl transition-all"
                    >
                      <RefreshCcw className="w-4 h-4" /> Reset
                    </button>
                  </div>

                  <div className="grid md:grid-cols-5 gap-8">
                    {/* Input Image */}
                    <div className="md:col-span-3 relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                      <img src={image} alt="Input" className="w-full aspect-square object-cover" />

                      {isAnalyzing && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent" />
                          <motion.div
                            animate={{ top: ['-20%', '120%'] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                          />
                        </>
                      )}
                    </div>

                    {/* Feature Maps */}
                    <div className="md:col-span-2 space-y-6">
                      <h4 className="uppercase text-xs font-black tracking-[0.2em] text-slate-400 mb-4">Feature Activation</h4>
                      
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-20 rounded-2xl border transition-all relative overflow-hidden",
                            activeLayer >= i 
                              ? "border-indigo-400 bg-indigo-50 shadow-inner" 
                              : "border-slate-100 bg-slate-50"
                          )}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-60">
                            Layer {i} • Conv + ReLU
                          </div>
                          {activeLayer === i && isAnalyzing && (
                            <motion.div
                              animate={{ scale: [1, 1.08, 1] }}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                              className="absolute inset-0 border-2 border-indigo-500 rounded-2xl"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={analyze}
                    disabled={isAnalyzing}
                    className={cn(
                      "w-full h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-4 transition-all shadow-xl",
                      isAnalyzing 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:brightness-110 active:scale-[0.985]"
                    )}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin" />
                        Running Forward Pass...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        EXECUTE INFERENCE
                      </>
                    )}
                  </button>

                  {/* Results */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-9 bg-white border border-slate-100 rounded-3xl shadow-xl"
                      >
                        <div className="flex items-center justify-between mb-8">
                          <p className="font-black uppercase tracking-widest text-xs text-indigo-500">Final Classification</p>
                          <div className="text-right">
                            <p className="text-4xl font-black tracking-tighter text-slate-900">{result.prediction}</p>
                            <p className="text-emerald-600 font-mono text-lg">{(result.confidence * 100).toFixed(1)}% confidence</p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {result.top3.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                              <span className="font-medium">{item.label}</span>
                              <div className="flex-1 mx-6 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.confidence * 100}%` }}
                                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                />
                              </div>
                              <span className="font-mono w-16 text-right">{(item.confidence * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </section>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />

          {/* Layer Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Layers, label: "Conv2D", desc: "Feature Extraction" },
              { icon: Circle, label: "ReLU", desc: "Activation" },
              { icon: RefreshCcw, label: "MaxPool", desc: "Downsampling" },
              { icon: Eye, label: "Flatten", desc: "Dense Layer" },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                <item.icon className="w-9 h-9 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-lg tracking-tight">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-8">
          <div className="p-10 bg-slate-900 rounded-3xl text-white border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
            
            <div className="flex items-center gap-3 mb-10">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h4 className="uppercase font-black tracking-[0.2em] text-xs text-slate-400">Model Configuration</h4>
            </div>

            <div className="space-y-9">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 block mb-3">Architecture</label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-mono">ResNet-style • 18 layers</div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 block mb-3">Input Resolution</label>
                <div className="text-4xl font-black tabular-nums tracking-tighter">224 × 224</div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
                  <span className="text-slate-400">Inference Mode</span>
                  <span className="text-emerald-400 font-black">EDGE • ON-DEVICE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100">
            <p className="text-xs leading-relaxed text-slate-500 italic">
              This demonstration simulates a lightweight convolutional neural network performing real-time image classification using spatial hierarchies and learned feature detectors.
            </p>
          </div>

          {error && (
            <div className="p-6 bg-rose-50 border border-rose-200 text-rose-600 rounded-3xl flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
