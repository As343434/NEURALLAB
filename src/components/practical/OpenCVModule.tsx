import { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, Users, Target, Activity, AlertCircle, Loader2, Camera, Shield, Zap, Terminal, Power } from 'lucide-react';
import { cn } from '../../lib/utils';
import * as faceapi from 'face-api.js';

export default function OpenCVModule() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceCount, setFaceCount] = useState<number | null>(null);
  const [faces, setFaces] = useState<{ x: number, y: number, w: number, h: number }[]>([]);
  const [isLiveEnabled, setIsLiveEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 40;
    const y = (e.clientY - rect.top - rect.height / 2) / 40;
    setMousePos({ x, y: -y });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
        setError("Inference engine failure. Check network connectivity.");
      }
    };
    loadModels();
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLiveEnabled(false);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsLiveEnabled(true);
        setImage(null);
        setError(null);
      }
    } catch (err) {
      setError("Camera access denied. Please check permissions.");
      console.error(err);
    }
  };

  const captureAndDetect = useCallback(async () => {
    if (processingRef.current || !videoRef.current || !isLiveEnabled || !modelsLoaded) return;
    
    processingRef.current = true;
    setIsProcessing(true);

    const video = videoRef.current;
    
    try {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      
      setFaceCount(detections.length);
      
      const boxes = detections.map(det => ({
        x: (det.box.x / video.videoWidth) * 100,
        y: (det.box.y / video.videoHeight) * 100,
        w: (det.box.width / video.videoWidth) * 100,
        h: (det.box.height / video.videoHeight) * 100
      }));
      setFaces(boxes);

      // Render boxes if canvas visible
      if (canvasRef.current) {
        const mainCanvas = canvasRef.current;
        mainCanvas.width = video.videoWidth;
        mainCanvas.height = video.videoHeight;
        const mainCtx = mainCanvas.getContext('2d');
        if (mainCtx) {
          mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
          mainCtx.strokeStyle = '#00f3ff';
          mainCtx.lineWidth = 2;
          
          detections.forEach((det, i) => {
            const { x, y, width, height } = det.box;
            mainCtx.strokeRect(x, y, width, height);
            
            // Decorative corners
            const len = 15;
            mainCtx.fillStyle = '#00f3ff';
            mainCtx.fillRect(x, y, len, 2);
            mainCtx.fillRect(x, y, 2, len);
            mainCtx.fillRect(x + width - len, y, len, 2);
            mainCtx.fillRect(x + width, y, 2, len);
            
            mainCtx.font = '8px "JetBrains Mono"';
            mainCtx.fillText(`TRK_0${i+1}`, x, y - 5);
          });
        }
      }
    } catch (err) {
      console.error("Auto detect failed:", err);
    }
    
    setIsProcessing(false);
    processingRef.current = false;
  }, [isLiveEnabled, modelsLoaded]);

  useEffect(() => {
    let animationFrame: number;
    const loop = () => {
      captureAndDetect();
      animationFrame = requestAnimationFrame(loop);
    };
    if (isLiveEnabled && modelsLoaded) {
      animationFrame = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isLiveEnabled, captureAndDetect, modelsLoaded]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setFaceCount(null);
        setFaces([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const runManualDetection = async () => {
    if (!image || !modelsLoaded) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = image;
      await new Promise(resolve => img.onload = resolve);
      
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
      
      const boxes = detections.map(det => ({
        x: (det.box.x / img.width) * 100,
        y: (det.box.y / img.height) * 100,
        w: (det.box.width / img.width) * 100,
        h: (det.box.height / img.height) * 100
      }));
      
      setFaceCount(detections.length);
      setFaces(boxes);
    } catch (err) {
      console.error(err);
      setError("Detection cycle failed. Input matrix corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans perspective-3d">
      <div className="grid lg:grid-cols-[1fr_420px] gap-12">
        <div className="space-y-8">
           {/* Primary Detection Frame */}
           <motion.div 
             onMouseMove={handleMouseMove}
             onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
             animate={{ 
               rotateY: mousePos.x, 
               rotateX: mousePos.y 
             }}
             transition={{ type: "spring", stiffness: 100, damping: 30 }}
             className="relative aspect-video rounded-[48px] border-4 border-white bg-slate-900 overflow-hidden group shadow-2xl shadow-indigo-200/40 perspective-3d card-3d"
           >
              {/* HUD Elements */}
              <div className="absolute top-8 left-10 z-20 flex items-center gap-4" style={{ transform: 'translateZ(50px)' }}>
                 <div className={cn(
                   "w-3 h-3 rounded-full",
                   isLiveEnabled ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse" : "bg-slate-700"
                 )} />
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em]">
                    {isLiveEnabled ? "STREAM_CONNECTED" : "FEED_OFLINE"}
                 </span>
              </div>

              <div className="absolute bottom-10 right-10 z-20 text-[10px] text-white/30 font-black uppercase tracking-[0.2em] text-right leading-relaxed" style={{ transform: 'translateZ(30px)' }}>
                 SYS_ID: 9412-TINY<br />
                 ENC_LYR: EDGE_CASCADE
              </div>

              {/* Video/Image Container */}
              <div className="w-full h-full flex items-center justify-center relative">
                 {isLiveEnabled ? (
                   <>
                     <video 
                       ref={videoRef} 
                       autoPlay 
                       playsInline 
                       muted 
                       className="w-full h-full object-cover scale-x-[-1] opacity-60" 
                     />
                     <canvas 
                       ref={canvasRef} 
                       className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-x-[-1] z-10" 
                       style={{ filter: 'drop-shadow(0 0 10px rgba(0,243,255,0.4))' }}
                     />
                   </>
                 ) : image ? (
                   <div className="relative w-full h-full bg-slate-950">
                      <img src={image} className="w-full h-full object-contain opacity-50" alt="Target" />
                      {faces.map((face, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute border-2 border-cyan-400 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                          style={{
                            left: `${face.x}%`,
                            top: `${face.y}%`,
                            width: `${face.w}%`,
                            height: `${face.h}%`,
                            transform: 'translateZ(100px)'
                          }}
                        >
                           <span className="absolute -top-8 left-0 text-[10px] bg-cyan-400 text-slate-950 px-3 py-1 rounded-full font-black tracking-widest">
                              TRK_0{i+1}
                           </span>
                        </motion.div>
                      ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center gap-8 text-slate-700">
                      <div className="p-8 rounded-full bg-slate-800/50 border border-slate-700 shadow-inner">
                        <Shield className="w-24 h-24 stroke-[1]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Feed Restricted</p>
                        <p className="text-[11px] mt-3 italic font-bold text-slate-600">Initialize sensory input matrix</p>
                      </div>
                   </div>
                 )}
              </div>

              {/* Scanning Line Overlay */}
              {isLiveEnabled && (
                <motion.div 
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 w-full h-1 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.5)] z-20 pointer-events-none"
                />
              )}

              {/* HUD Accents */}
              <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-[32px] pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/20 rounded-br-[32px] pointer-events-none" />
           </motion.div>

           {/* Controls Container */}
           <div className="grid grid-cols-2 gap-6">
              <button
                onClick={isLiveEnabled ? stopCamera : startCamera}
                className={cn(
                  "h-20 rounded-[32px] flex items-center justify-center gap-4 border-2 transition-all uppercase text-[12px] font-black tracking-[0.2em] active:scale-95 shadow-xl",
                  isLiveEnabled 
                    ? "bg-rose-500 border-rose-400 text-white shadow-rose-200" 
                    : "bg-indigo-600 border-indigo-500 text-white shadow-indigo-200"
                )}
              >
                <Power className="w-5 h-5" />
                {isLiveEnabled ? "Terminate Session" : "Initialize Link"}
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-[32px] bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  Load Image
                </button>
                {image && (
                   <button
                    onClick={runManualDetection}
                    disabled={isProcessing}
                    className="h-20 px-10 rounded-[32px] bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center shadow-2xl shadow-indigo-200 active:scale-95"
                   >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                   </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
           </div>
        </div>

        {/* Info Sidebar */}
        <aside className="space-y-8 pt-4">
           <div className="p-10 rounded-[48px] bg-white border border-slate-100 space-y-8 shadow-2xl shadow-indigo-100/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl -mr-24 -mt-24" />
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em] relative z-10 flex items-center gap-3">
                 <Terminal className="w-4 h-4 text-indigo-400" />
                 LIV_TELEMETRY_MAP
              </p>
              
              <div className="space-y-8 relative z-10">
                 <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">
                       <span>Identified_Targets</span>
                       <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Active_Lp</span>
                    </div>
                    <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                       {faceCount !== null ? (faceCount < 10 ? `0${faceCount}` : faceCount) : "---"}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Core_Engine</p>
                       <p className={cn(
                         "text-xs font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-xl border w-fit",
                         isProcessing ? "text-amber-500 bg-amber-50 border-amber-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
                       )}>
                          {isProcessing ? "COMPUTING" : "STABLE"}
                       </p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Confidence</p>
                       <p className="text-xs text-indigo-600 font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 w-fit">
                          BIAS_AUTO
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-10 rounded-[48px] border border-indigo-50 bg-indigo-50/30 space-y-6 shadow-sm">
              <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.25em] flex items-center gap-3">
                 <Shield className="w-4 h-4 text-indigo-400" />
                 Protocol HAAR-V4
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 font-bold tracking-tight">
                 Utilizing temporal frame differencing and cascading feature weights to lock onto facial landmarks in variable lighting conditions. System calibrated for high-throughput edge inference.
              </p>
           </div>

           {error && (
              <div className="p-8 rounded-[32px] bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black uppercase tracking-widest flex items-start gap-4 shadow-lg shadow-rose-100">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                {error}
              </div>
           )}
        </aside>
      </div>
    </div>
  );
}
