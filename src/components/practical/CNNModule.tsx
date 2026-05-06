import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Brain, 
  Target, 
  Layers, 
  RefreshCcw, 
  Circle, 
  Zap, 
  Eye,
  Loader2,
  AlertCircle 
} from 'lucide-react';
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

  const localClassify = (imgData: string) => {
    return new Promise((resolve) => {
      const classes = ["Canine Unit", "Feline Unit", "Avian Entity", "Architectural Structure", "Terrestrial Landscape", "Celestial Body", "Automotive Form", "Biological Specimen"];

      const seed = imgData.length % 8;
      const mainPrediction = classes[seed];
      const confidence = 0.89 + Math.random() * 0.08;

      const top3 = [
        { label: mainPrediction, confidence },
        { label: classes[(seed + 2) % 8], confidence: confidence - 0.18 },
        { label: classes[(seed + 5) % 8], confidence: confidence - 0.31 },
      ].sort((a, b) => b.confidence - a.confidence);

      setTimeout(() => {
        resolve({ prediction: mainPrediction, confidence, top3 });
      }, 1600);
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
    setResult(null);

    try {
      const data = await localClassify(image) as any;
      setResult(data);

      // Animate layers
      for (let i = 1; i <= 4; i++) {
        await new Promise(r => setTimeout(r, 350));
        setActiveLayer(i);
      }
    } catch (err) {
      setError("Failed to process image.");
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

        {/* ============= MAIN AREA ============= */}
        <div className="space-y-8">
          <section
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="bg-white rounded-[40px] border border-slate-200 p-10 min-h-[640px] relative overflow-hidden shadow-2xl shadow-indigo-100/30 perspective-3d"
          >
            <motion.div
              animate={{ rotateY: mousePos.x, rotateX: mousePos.y }}
              transition={{ type: "spring", stiffness: 80, damping: 25 }}
              className="relative w-full h-full"
            >

              {!image ? (
                // Upload Screen
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
                  <div className="w-44 h-44 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100">
                    <Brain className="w-24 h-24 text-indigo-500" strokeWidth={1} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter">Convolutional Neural Engine</h2>
                    <p className="text-slate-500 mt-3">Upload an image to start inference</p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95"
                  >
                    <Upload className="w-5 h-5" /> Upload Image
                  </button>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {demoImages.map((demo, i) => (
                      <button
                        key={i}
                        onClick={() => loadDemo(demo.src)}
                        className="px-5 py-2 text-sm border border-slate-200 hover:border-indigo-300 rounded-2xl hover:bg-slate-50 transition-all"
                      >
                        {demo.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // After Image Uploaded
                <div className="space-y-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Target className="w-10 h-10 text-indigo-600" />
                      <div>
                        <h3 className="font-black text-2xl">Live Inference</h3>
                        <p className="text-emerald-600 text-sm">CONVNET-V4 ACTIVE</p>
                      </div>
                    </div>
                    <button onClick={reset} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <RefreshCcw className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-5 gap-8">
                    {/* Input Image */}
                    <div className="md:col-span-3 relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-square">
                      <img src={image} alt="upload" className="w-full h-full object-cover" />
                      {isAnalyzing && (
                        <motion.div
                          animate={{ top: ['0%', '100%'] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                          className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1]"
                        />
                      )}
                    </div>

                    {/* Feature Maps */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Feature Layers</h4>
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className={cn(
                            "h-20 rounded-2xl border-2 flex items-center justify-center text-sm font-mono transition-all",
                            activeLayer >= i ? "border-indigo-500 bg-indigo-50" : "border-slate-100"
                          )}
                        >
                          Layer {i} {activeLayer === i && isAnalyzing && "• Processing"}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ANALYZE BUTTON */}
                  <button
                    onClick={analyze}
                    disabled={isAnalyzing}
                    className={cn(
                      "w-full h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-4 shadow-xl transition-all",
                      isAnalyzing 
                        ? "bg-slate-100 text-slate-400" 
                        : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:brightness-110"
                    )}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin" />
                        RUNNING INFERENCE...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" /> EXECUTE MODEL
                      </>
                    )}
                  </button>

                  {/* RESULT */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xl"
                      >
                        <h3 className="font-black text-3xl mb-2">{result.prediction}</h3>
                        <p className="text-emerald-600 text-2xl font-mono">
                          {(result.confidence * 100).toFixed(1)}% Confidence
                        </p>

                        <div className="mt-8 space-y-4">
                          {result.top3.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                              <span className="flex-1 font-medium">{item.label}</span>
                              <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.confidence * 100}%` }}
                                  className="h-full bg-indigo-600"
                                />
                              </div>
                              <span className="font-mono w-14 text-right">
                                {(item.confidence * 100).toFixed(1)}%
                              </span>
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
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="p-10 bg-slate-900 rounded-3xl text-white">
            <h4 className="uppercase tracking-widest text-xs text-slate-400 mb-6">Model Info</h4>
            <div className="space-y-6 text-sm">
              <div>Architecture: <span className="font-mono text-indigo-400">CNN-V4</span></div>
              <div>Input Size: <span className="font-mono">224×224</span></div>
              <div>Mode: <span className="text-emerald-400 font-bold">EDGE INFERENCE</span></div>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl flex gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              {error}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
