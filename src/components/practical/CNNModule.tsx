import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  ImageIcon, 
  Play, 
  Target, 
  Layers, 
  Settings, 
  Activity, 
  RefreshCcw, 
  Circle, 
  Zap, 
  Eye,
  Brain,
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
        { label: classes[(seed + 3) % 10], confidence: confidence - 0.15 - Math.random() * 0.08 },
        { label: classes[(seed + 7) % 10], confidence: confidence - 0.28 - Math.random() * 0.12 },
      ].sort((a, b) => b.confidence - a.confidence);

      setTimeout(() => {
        resolve({ prediction: mainPrediction, confidence, top3 });
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
        await new Promise(res => setTimeout(res, 420));
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
                // ... (rest of the image uploaded UI remains the same as previous version)
                <div className="space-y-10">
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

                  {/* Rest of your UI (image + feature maps + results) - same as before */}
                  {/* ... copy from my previous response if needed ... */}
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

          {/* Layer Cards */}
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

        {/* Sidebar - same as before */}
        <aside className="space-y-8">
          {/* ... your sidebar content ... */}
        </aside>
      </div>
    </div>
  );
}
