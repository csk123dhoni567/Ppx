import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, Upload, Leaf, AlertCircle, CheckCircle2, AlertTriangle, 
  Sparkles, ArrowRight, ChevronRight, Clock, Trash2, ShieldCheck, 
  Loader2, Info, RefreshCw, Layers, Compass
} from "lucide-react";
import Header from "./components/Header";
import AgriAdvisor from "./components/AgriAdvisor";
import CropMonitoring from "./components/CropMonitoring";
import { DiagnosisReport } from "./types";
import { englishTranslations, teluguTranslations } from "./locales";

export default function App() {
  const [language, setLanguage] = useState<"en" | "te">("en");
  const t = language === "te" ? teluguTranslations : englishTranslations;

  const [activeTab, setActiveTab] = useState<"scan" | "advisor" | "monitoring">("scan");
  
  // Scanner states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [plantHint, setPlantHint] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<DiagnosisReport | null>(null);
  
  // Geolocation/Camera streams
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scan History
  const [scanHistory, setScanHistory] = useState<DiagnosisReport[]>([]);

  // Load history on mount with safety checks for sandbox iframes
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const cached = localStorage.getItem("plantcare_scan_history");
        if (cached) {
          try {
            setScanHistory(JSON.parse(cached));
          } catch (e) {
            console.error("Failed to parse scan history cache", e);
          }
        }
      }
    } catch (e) {
      console.warn("localStorage is not accessible in this context:", e);
    }
  }, []);

  // Update history cache
  const saveScanToHistory = (report: DiagnosisReport) => {
    const updated = [report, ...scanHistory].slice(0, 20); // Keep max 20 entries
    setScanHistory(updated);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("plantcare_scan_history", JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("localStorage item write blocked:", e);
    }
  };

  const deleteHistoryItem = (timestamp: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = scanHistory.filter(item => item.scannedAt !== timestamp);
    setScanHistory(updated);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("plantcare_scan_history", JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("localStorage item write blocked:", e);
    }
  };

  // Drag and Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

  const setupFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanError(null);
    setActiveReport(null);
    stopCamera();
  };

  // Activate capture stream
  const startCamera = async () => {
    setCameraError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveReport(null);

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices) {
        throw new Error("Local devices camera API not loaded in this browser sandbox.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });

      streamRef.current = stream;
      setCameraActive(true);

      // Bind source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => {
            console.error("Video play failed", e);
          });
        }
      }, 300);

    } catch (err: any) {
      console.error("Camera hook failed", err);
      setCameraError(
        language === "te"
          ? "కెమెరాను తెరవలేకపోయాము. దయచేసి ఫోటో ఫైలును అప్‌లోడ్ చేయండి లేదా బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతి ఇవ్వండి."
          : "Could not access video input. Please ensure browser permissions permit camera access, or upload a captured image instead."
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Captures current frames from video canvas
  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setPreviewUrl(dataUrl);
        
        // Form standard dummy file
        const blobBin = atob(dataUrl.split(",")[1]);
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        const fileObj = new File([new Uint8Array(array)], `CameraCapture_${Date.now()}.jpg`, { type: "image/jpeg" });
        setSelectedFile(fileObj);
        stopCamera();
      }
    } catch (err) {
      console.error("Capture err", err);
      setCameraError("Failed to freeze current frame. Please select manual files.");
    }
  };

  // Run Gemini model analysis on backend
  const runDiagnosis = async () => {
    if (!previewUrl) return;
    setScanning(true);
    setScanError(null);

    try {
      let base64Data = "";
      if (previewUrl.startsWith("data:")) {
        base64Data = previewUrl.split(",")[1];
      } else {
        const bResult = await fetch(previewUrl);
        const bData = await bResult.blob();
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const raw = reader.result as string;
            resolve(raw.split(",")[1]);
          };
          reader.readAsDataURL(bData);
        });
      }

      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Data,
          mimeType: selectedFile ? selectedFile.type : "image/jpeg",
          plantHint: plantHint,
          language
        })
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        throw new Error(errPayload.error || "Communication failure to backend diagnostic API.");
      }

      const rawResult = await response.json();
      
      const formattedTimestamp = new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const parsedReport: DiagnosisReport = {
        scannedAt: formattedTimestamp,
        imageSrc: previewUrl,
        plantName: rawResult.plantName || plantHint || (language === "te" ? "గుర్తించబడని మొక్క" : "Identified Plant specimen"),
        diseaseName: rawResult.diseaseName || (language === "te" ? "సాధారణ ఆకు మచ్చల వ్యాధి" : "General Foliation Spotting"),
        severity: rawResult.severity || "Medium",
        confidence: rawResult.confidence || 0.88,
        healthy: rawResult.healthy ?? false,
        symptoms: rawResult.symptoms || [],
        cause: rawResult.cause || (language === "te" ? "ఫంగస్ లేదా బ్యాక్టీరియా మూలంగా ఆకుల కంటి కణాలు దెబ్బతిన్నాయి." : "Foliar pathogen activity or high microclimate moisture causing organic stress."),
        treatment: {
          organic: rawResult.treatment?.organic || [],
          chemical: rawResult.treatment?.chemical || [],
          preventive: rawResult.treatment?.preventive || []
        },
        cropAdvice: rawResult.cropAdvice || (language === "te" ? "సేంద్రీయ నియంత్రణ పద్ధతులు పాటించండి." : "Continue standard maintenance guidelines.")
      };

      setActiveReport(parsedReport);
      saveScanToHistory(parsedReport);
    } catch (err: any) {
      console.error("Scanning failed", err);
      setScanError(
        language === "te"
          ? "పంట విశ్లేషణను పూర్తి చేయలేకపోయాము. నెట్‌వర్క్ కనెక్షన్‌ను సరిచూసి మళ్ళీ ప్రయత్నిచండి."
          : "Failed to process plant diagnosis. Please verify connection and retry."
      );
    } finally {
      setScanning(false);
    }
  };

  const selectHistoryItem = (report: DiagnosisReport) => {
    setActiveReport(report);
    setPreviewUrl(report.imageSrc || null);
    setSelectedFile(null);
    stopCamera();
  };

  const triggerResetScanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanError(null);
    setActiveReport(null);
    setPlantHint("");
    stopCamera();
  };

  // Clean-up camera on component destruction
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header language={language} setLanguage={setLanguage} />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Agricultural Status Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 opacity-10 w-96 h-96 -mr-16 -mt-16 pointer-events-none leaf-bg-glow">
            <Leaf className="w-full h-full" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/60 rounded-full border border-emerald-500/30 text-xs text-emerald-300 font-mono mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              {t.MLTitle}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
              {t.bannerTitle}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              {t.bannerDesc}
            </p>
          </div>

          {/* Core App Navigation Tabs block */}
          <div className="flex flex-wrap gap-2.5 mt-6 border-t border-emerald-700/40 pt-4.5">
            <button
               id="tab-btn-scan"
               onClick={() => { setActiveTab("scan"); stopCamera(); }}
               className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                 activeTab === "scan"
                   ? "bg-white text-emerald-950 font-bold shadow-xs"
                   : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/70"
               }`}
            >
              <Camera className="h-4 w-4" />
              {t.tabScanner}
            </button>
            <button
               id="tab-btn-advisor"
               onClick={() => { setActiveTab("advisor"); stopCamera(); }}
               className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                 activeTab === "advisor"
                   ? "bg-white text-emerald-950 font-bold shadow-xs"
                   : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/70"
               }`}
            >
              <Sparkles className="h-4 w-4" />
              {t.tabAdvisor}
            </button>
            <button
               id="tab-btn-monitoring"
               onClick={() => { setActiveTab("monitoring"); stopCamera(); }}
               className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                 activeTab === "monitoring"
                   ? "bg-white text-emerald-950 font-bold shadow-xs"
                   : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/70"
               }`}
            >
              <Layers className="h-4 w-4" />
              {t.tabMonitor}
            </button>
          </div>
        </div>

        {/* Tab view containers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Area based on tab active selection */}
          <div className="lg:col-span-8 space-y-6">
            
            {activeTab === "scan" && (
              <div id="scan-container" className="space-y-6">
                
                {/* Diagnostic Scanner Interface Card */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Camera className="h-5 w-5 text-emerald-600" />
                        {t.scannerTitle}
                      </h3>
                      <p className="text-xs text-slate-500">{t.scannerSub}</p>
                    </div>
                    {previewUrl && (
                      <button
                        onClick={triggerResetScanner}
                        disabled={scanning}
                        className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-sm border border-rose-200 transition-colors cursor-pointer"
                      >
                        {t.resetScanner}
                      </button>
                    )}
                  </div>

                  {/* Easy 3-Step Guide */}
                  <div className="mb-5 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700">
                    <div className="flex gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                      <div className="text-[11.5px] leading-relaxed">
                        <p className="font-bold text-slate-950">{t.step1Title}</p>
                        <p className="text-slate-500 text-[11px]">{t.step1Desc}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                      <div className="text-[11.5px] leading-relaxed">
                        <p className="font-bold text-slate-950">{t.step2Title}</p>
                        <p className="text-slate-500 text-[11px]">{t.step2Desc}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                      <div className="text-[11.5px] leading-relaxed">
                        <p className="font-bold text-slate-950">{t.step3Title}</p>
                        <p className="text-slate-500 text-[11px]">{t.step3Desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Input Drop zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                      dragActive ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    
                    {/* Live Camera Feed active */}
                    {cameraActive ? (
                      <div className="relative aspect-video bg-black flex items-center justify-center">
                        <video 
                          ref={videoRef}
                          playsInline 
                          muted 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3">
                          <button
                            onClick={capturePhoto}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg cursor-pointer"
                          >
                            {language === "te" ? "ఫోటో తీయండి" : "Capture Photo Frame"}
                          </button>
                          <button
                            onClick={stopCamera}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl cursor-pointer"
                          >
                            {language === "te" ? "రద్దు చేయి" : "Cancel Stream"}
                          </button>
                        </div>
                      </div>
                    ) : previewUrl ? (
                      /* Preview block */
                      <div className="relative border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 p-4 bg-white">
                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-900">
                          <img 
                            src={previewUrl} 
                            alt="Crop Preview" 
                            className="w-full h-full object-cover"
                          />
                          {scanning && (
                            <>
                              {/* Glowing scanner line animation */}
                              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-green-300 shadow-lg scanner-line z-20"></div>
                              <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-xs flex items-center justify-center z-10">
                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Scanner hint setup */}
                        <div className="flex-1 space-y-3.5 w-full">
                          <div>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono px-2 py-0.5 rounded-sm font-semibold uppercase">
                              {t.imgLoadedText}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mt-1">{selectedFile?.name || "photo_capture.jpg"}</h4>
                            <p className="text-xs text-slate-500">
                              {language === "te" ? "ఫైల్ సైజు" : "File size"}: {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB" : "0.45 MB"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-slate-600 flex items-center gap-1">
                              <Info className="h-3 w-3" /> {t.plantHintLabel}
                            </label>
                            <input 
                              type="text" 
                              value={plantHint}
                              onChange={(e) => setPlantHint(e.target.value)}
                              placeholder={t.plantHintPlaceholder}
                              disabled={scanning}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500 font-sans"
                            />
                          </div>

                          <button
                            onClick={runDiagnosis}
                            disabled={scanning}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            {scanning ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t.processingText}
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                {t.runDiagBtn}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop Standard state */
                      <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                        <div className="h-14 w-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                          <Upload className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-slate-800 text-sm font-semibold">{t.dragDropText}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{t.orChooseText}</p>
                        </div>
                        <div className="flex flex-wrap gap-2.5 justify-center mt-2.5">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                          >
                            {t.selectImageBtn}
                          </button>
                          <button
                            onClick={startCamera}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-sm cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            {t.useCameraBtn}
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div className="mt-2.5 p-2 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-100 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  {scanError && (
                    <div className="mt-2.5 p-3 bg-red-50 text-red-900 border border-red-100 rounded-xl text-xs flex items-center gap-2">
                       <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                       <span>{scanError}</span>
                    </div>
                  )}
                </div>

                {/* active Diagnosis Report panel */}
                {activeReport ? (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100/60 overflow-hidden relative">
                    
                    {/* Header segment with badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full animate-ping bg-emerald-500"></div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-sm">
                            {t.certLogPrefix}: {activeReport.scannedAt}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base font-sans mt-1">
                          {t.certTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeReport.healthy ? (
                          <span className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" /> {t.certHealthy}
                          </span>
                        ) : (
                          <span className="bg-amber-50 border border-amber-250 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4" /> {t.certPathogen}
                          </span>
                        )}
                        <span className="bg-slate-900 text-emerald-400 text-xs font-mono px-2.5 py-1 rounded">
                          Conf: {Math.round(activeReport.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Scientific Diagnosis Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-4">
                      
                      {/* Left: General metadata */}
                      <div className="bg-slate-50 border border-slate-100/70 rounded-xl p-4 space-y-3.5">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">{t.labelPlantGroup}</span>
                          <span className="font-bold text-slate-800 text-sm">{activeReport.plantName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">{t.labelClassCondition}</span>
                          <span className="font-bold text-slate-900 text-sm leading-snug block">{activeReport.diseaseName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">{t.labelSeverity}</span>
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                            activeReport.severity === "High" ? "bg-red-100 text-red-800" :
                            activeReport.severity === "Medium" ? "bg-amber-100 text-amber-800" :
                            "bg-green-100 text-green-800"
                          }`}>{activeReport.severity}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/55">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">{t.labelSymptoms}</span>
                          <div className="space-y-1">
                            {activeReport.symptoms.length > 0 ? (
                              activeReport.symptoms.map((sym, idx) => (
                                <p key={idx} className="text-[11px] text-slate-600 font-sans leading-relaxed flex items-start gap-1">
                                  <span className="text-emerald-500 font-bold shrink-0">•</span> {sym}
                                </p>
                              ))
                            ) : (
                              <p className="text-[11px] text-slate-450 italic">{language === "te" ? "లక్షణాలు లేవు" : "No specific symptoms logged"}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Pathogen Cause + Expert agronomist recommendations */}
                      <div className="col-span-2 space-y-4">
                        
                        {/* Cause statement */}
                        <div>
                          <h4 className="font-semibold text-slate-850 text-xs font-mono uppercase tracking-wide text-slate-500">{t.labelCause}</h4>
                          <p className="text-slate-700 text-xs md:text-sm leading-relaxed mt-1">{activeReport.cause}</p>
                        </div>

                        {/* Remedies split lists */}
                        <div className="border-t border-slate-100 pt-3.5">
                          <h4 className="font-semibold text-slate-850 text-xs font-mono uppercase tracking-wide text-indigo-500 mb-2">{t.labelMitigations}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                            {/* Organic Remedies */}
                            <div className="bg-emerald-50/30 border border-emerald-100/60 p-3 rounded-lg">
                              <span className="text-[11px] font-bold text-emerald-800 block mb-1.5 uppercase tracking-wider font-mono">{t.labelOrganic}</span>
                              <ul className="space-y-1">
                                {activeReport.treatment.organic.length > 0 ? (
                                  activeReport.treatment.organic.map((org, oIdx) => (
                                    <li key={oIdx} className="text-[11px] text-slate-700 leading-normal flex items-start gap-1">
                                      <span className="text-emerald-600 shrink-0">✔</span> {org}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[11.5px] italic text-slate-400">{language === "te" ? "నియమిత నివారణలు లేవు" : "No organic treatments needed"}</li>
                                )}
                              </ul>
                            </div>

                            {/* Preventive */}
                            <div className="bg-indigo-50/20 border border-indigo-100/60 p-3 rounded-lg">
                              <span className="text-[11px] font-bold text-indigo-800 block mb-1.5 uppercase tracking-wider font-mono">{t.labelPreventive}</span>
                              <ul className="space-y-1">
                                {activeReport.treatment.preventive.length > 0 ? (
                                  activeReport.treatment.preventive.map((pre, pIdx) => (
                                    <li key={pIdx} className="text-[11px] text-slate-700 leading-normal flex items-start gap-1">
                                      <span className="text-indigo-600 shrink-0">★</span> {pre}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[11.5px] italic text-slate-450">{language === "te" ? "నివారణలు లేవు" : "No preventive remedies logged"}</li>
                                )}
                              </ul>
                            </div>

                          </div>

                          {/* Chemical Remedies */}
                          {activeReport.treatment.chemical && activeReport.treatment.chemical.length > 0 && (
                            <div className="mt-3 bg-rose-50/20 border border-rose-100/60 p-3 rounded-lg">
                              <span className="text-[11px] font-bold text-rose-800 block mb-1 uppercase tracking-wider font-mono">{t.labelChemical}</span>
                              <ul className="space-y-1">
                                {activeReport.treatment.chemical.map((chem, cIdx) => (
                                  <li key={cIdx} className="text-[11px] text-slate-700 leading-normal flex items-start gap-1">
                                    <span className="text-rose-500 shrink-0">⚠️</span> {chem}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>

                    {/* General agronomist wrap up advice */}
                    <div className="mt-4.5 pt-4 border-t border-slate-100 bg-emerald-50/20 px-4 py-3 rounded-xl border border-emerald-200/40">
                      <h4 className="font-semibold text-slate-800 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" /> {t.labelExpertChecklist}
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed mt-1 font-sans">{activeReport.cropAdvice}</p>
                    </div>

                  </div>
                ) : (
                  /* Zero State when no report is parsed yet */
                  <div className="bg-slate-100/75 rounded-2xl p-8 border border-dashed border-slate-200 text-center text-slate-500 text-xs space-y-1">
                     <p className="font-semibold text-slate-700">{t.zeroStateTitle}</p>
                     <p>{t.zeroStateDesc}</p>
                  </div>
                )}

              </div>
            )}

            {activeTab === "advisor" && (
              <div id="advisor-container" className="space-y-5">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base mb-1">{t.chatTitle}</h3>
                  <p className="text-slate-500 text-xs mb-3">{t.chatSub}</p>
                  <AgriAdvisor language={language} />
                </div>
              </div>
            )}

            {activeTab === "monitoring" && (
              <div id="monitoring-container" className="space-y-5">
                <CropMonitoring language={language} />
              </div>
            )}

          </div>

          {/* Right Sidebar: Historical entries & Tips list */}
          <div className="lg:col-span-4 space-y-6">

            {/* Quick Consultation Presets or Stats */}
            <div className="bg-white rounded-2xl p-4.5 shadow-xs border border-slate-100 space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide font-mono">{t.metricsTitle}</h4>
                <p className="text-slate-500 text-[11px]">{t.metricsSub}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
                  <span className="text-slate-600">{t.metricsModel}</span>
                  <span className="font-mono text-emerald-600 font-semibold uppercase">Gemini 3.5 Flash</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
                  <span className="text-slate-600">{t.metricsAccuracy}</span>
                  <span className="font-mono text-slate-800 font-semibold">95% (Foliage Pattern)</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
                  <span className="text-slate-600">{t.metricsScopes}</span>
                  <span className="font-mono text-slate-800">Camera / Location</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{t.metricsLogs}</span>
                  <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                    {scanHistory.length} {language === "te" ? "లాగ్‌లు" : "logs"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Historical Diagnoses lists */}
            <div className="bg-white rounded-2xl p-4.5 shadow-xs border border-slate-100 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide font-mono">{t.archiveTitle}</h4>
                  <p className="text-slate-500 text-[10px]">{t.archiveSub}</p>
                </div>
                <Clock className="h-3.5 w-3.5 text-slate-400" />
              </div>

              {scanHistory.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-[11px] italic">
                  {t.archiveEmpty}
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {scanHistory.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => selectHistoryItem(item)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex gap-2.5 items-center hover:bg-slate-50 ${
                        activeReport?.scannedAt === item.scannedAt
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-100"
                      }`}
                    >
                      {item.imageSrc ? (
                        <div className="h-10 w-10 rounded overflow-hidden shrink-0 border border-slate-150 bg-slate-100">
                          <img src={item.imageSrc} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Leaf className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono block truncate">{item.scannedAt.split(",")[0]}</span>
                          <button 
                            onClick={(e) => deleteHistoryItem(item.scannedAt, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                            title={language === "te"? "తుడిచివేయి" : "Delete log"}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <h5 className="font-medium text-slate-800 text-[11.5px] truncate">{item.plantName}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{item.diseaseName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Companion Agricultural Tips panel */}
            <div className="bg-slate-900 text-white rounded-2xl p-4.5 border border-slate-950 relative overflow-hidden">
               <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
               <h4 className="text-yellow-400 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                 <ShieldCheck className="h-3.5 w-3.5" /> {t.ruleTitle}
               </h4>
               <p className="text-slate-350 text-[11.5px] mt-1.5 leading-relaxed">
                 {t.ruleDesc}
               </p>
            </div>

          </div>

        </div>

      </main>

      {/* Humble professional credit line */}
      <footer className="bg-white border-t border-slate-150 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            PlantCare AI • Companion Farming Standard • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
