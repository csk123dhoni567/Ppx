import React, { useState } from "react";
import { Droplet, Thermometer, Flame, HelpCircle, RefreshCw, Layers, Sparkles, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { CropItem } from "../types";
import { englishTranslations, teluguTranslations } from "../locales";

interface CropMonitoringProps {
  language: "en" | "te";
}

export default function CropMonitoring({ language }: CropMonitoringProps) {
  const t = language === "te" ? teluguTranslations : englishTranslations;

  // Configured target monitor blocks
  const [crops, setCrops] = useState<CropItem[]>([
    {
      id: "crop-1",
      name: language === "te" ? "ఉత్తర భాగం టమోటాలు (Plot 1)" : "North Plot Tomatoes",
      type: "Tomato (Roma)",
      status: "optimal",
      moisture: 65,
      temperature: 24,
      soilPh: 6.4,
      npkRatio: { n: 120, p: 45, k: 110 },
      sowingDate: "2026-04-12"
    },
    {
      id: "crop-2",
      name: language === "te" ? "పశ్చిమ మేడ క్యాబేజీలు (Plot 2)" : "West Terrace Cabbages",
      type: "Cabbage",
      status: "warning",
      moisture: 38,
      temperature: 28,
      soilPh: 6.8,
      npkRatio: { n: 140, p: 55, k: 90 },
      sowingDate: "2026-05-01"
    },
    {
      id: "crop-3",
      name: language === "te" ? "పాక పక్క బంగాళాదుంపలు (Plot 3)" : "Shed Row Potato Rows",
      type: "Potato (Russet)",
      status: "critical",
      moisture: 22,
      temperature: 31,
      soilPh: 5.2,
      npkRatio: { n: 70, p: 25, k: 60 },
      sowingDate: "2026-04-20"
    }
  ]);

  const [selectedCropId, setSelectedCropId] = useState<string>("crop-1");
  const activeCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  // Helper to re-evaluate health status based on current simulated sliders
  const calculateSimulationStatus = (
    m: number,
    t: number,
    ph: number,
    n: number
  ): "optimal" | "warning" | "critical" => {
    let strikes = 0;

    // Moisture limits
    if (m < 30 || m > 85) strikes += 2;
    else if (m < 45 || m > 75) strikes += 1;

    // Temperature limits
    if (t < 15 || t > 35) strikes += 2;
    else if (t < 18 || t > 29) strikes += 1;

    // Soil pH limits
    if (ph < 5.5 || ph > 7.5) strikes += 2;
    else if (ph < 6.0 || ph > 7.0) strikes += 1;

    // Nitrogen N level limits
    if (n < 80) strikes += 1;

    if (strikes >= 3) return "critical";
    if (strikes >= 1) return "warning";
    return "optimal";
  };

  // Modify metrics of the selected crop
  const updateActiveMetric = (key: string, value: any) => {
    setCrops(prev =>
      prev.map(c => {
        if (c.id !== selectedCropId) return c;
        
        let updatedCrop = { ...c };
        if (key === "moisture") updatedCrop.moisture = value;
        if (key === "temperature") updatedCrop.temperature = value;
        if (key === "soilPh") updatedCrop.soilPh = value;
        if (key === "n") updatedCrop.npkRatio.n = value;
        if (key === "p") updatedCrop.npkRatio.p = value;
        if (key === "k") updatedCrop.npkRatio.k = value;

        // Recalculate status
        updatedCrop.status = calculateSimulationStatus(
          updatedCrop.moisture,
          updatedCrop.temperature,
          updatedCrop.soilPh,
          updatedCrop.npkRatio.n
        );

        return updatedCrop;
      })
    );
  };

  // Action: Trigger Irrigation block
  const handleIrrigate = () => {
    updateActiveMetric("moisture", 68);
  };

  // Action: Add Organic Soil compost
  const handleFortifyCompost = () => {
    setCrops(prev =>
      prev.map(c => {
        if (c.id !== selectedCropId) return c;
        return {
          ...c,
          soilPh: 6.5,
          npkRatio: { n: 130, p: 50, k: 120 },
          status: calculateSimulationStatus(c.moisture, c.temperature, 6.5, 130)
        };
      })
    );
  };

  // Action: Reset standard values
  const handleResetDefaults = () => {
    setCrops([
      {
        id: "crop-1",
        name: language === "te" ? "ఉత్తర భాగం టమోటాలు (Plot 1)" : "North Plot Tomatoes",
        type: "Tomato (Roma)",
        status: "optimal",
        moisture: 65,
        temperature: 24,
        soilPh: 6.4,
        npkRatio: { n: 120, p: 45, k: 110 },
        sowingDate: "2026-04-12"
      },
      {
        id: "crop-2",
        name: language === "te" ? "పశ్చిమ మేడ క్యాబేజీలు (Plot 2)" : "West Terrace Cabbages",
        type: "Cabbage",
        status: "warning",
        moisture: 38,
        temperature: 28,
        soilPh: 6.8,
        npkRatio: { n: 140, p: 55, k: 90 },
        sowingDate: "2026-05-01"
      },
      {
        id: "crop-3",
        name: language === "te" ? "పాక పక్క బంగాళాదుంపలు (Plot 3)" : "Shed Row Potato Rows",
        type: "Potato (Russet)",
        status: "critical",
        moisture: 22,
        temperature: 31,
        soilPh: 5.2,
        npkRatio: { n: 70, p: 25, k: 60 },
        sowingDate: "2026-04-20"
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-5">
      
      {/* Header section with Reset trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-950 font-sans text-md flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-emerald-600" />
            {t.simTitle}
          </h3>
          <p className="text-slate-500 text-xs">{t.simSub}</p>
        </div>
        <button
          onClick={handleResetDefaults}
          title={t.simBtnReset}
          className="p-1 px-2 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          {t.simBtnReset}
        </button>
      </div>

      {/* Target crop block selector row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {crops.map((cr) => {
          const isSelected = cr.id === selectedCropId;
          const isOptimal = cr.status === "optimal";
          const isWarning = cr.status === "warning";

          return (
            <button
              key={cr.id}
              onClick={() => setSelectedCropId(cr.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                  : "border-slate-200 hover:border-slate-350 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">{cr.type}</span>
                {isOptimal ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" title="Optimal Area Status"></span>
                ) : isWarning ? (
                  <span className="h-2 w-2 rounded-full bg-amber-500" title="Warning Action Triggered"></span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-rose-500" title="Critical Conditions"></span>
                )}
              </div>
              <h4 className="font-semibold text-slate-900 text-xs truncate">{cr.name}</h4>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                {language === "te" ? "తేమ" : "Moisture"}: {cr.moisture}%
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Area Details with Simulated Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3.5 border-t border-slate-100">
        
        {/* Left Side: Parameters sliders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              {language === "te" ? "పర్యావరణ సిమ్యులేషన్ కంట్రోల్" : "Environmental Simulation Control"}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm font-mono uppercase">
              {t.simZoneLabel}: {activeCrop.type}
            </span>
          </div>

          {/* Moisture slider */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100/60">
            <div className="flex justify-between items-center">
              <label className="text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-sky-500" />
                {t.simFactorMoisture}
              </label>
              <span className={`text-xs font-mono font-bold ${
                activeCrop.moisture < 35 ? "text-rose-600" : activeCrop.moisture > 75 ? "text-amber-600" : "text-emerald-700"
              }`}>
                {activeCrop.moisture}% {activeCrop.moisture < 35 
                  ? (language === "te" ? "(చాలా ఎండిపోయింది)" : "(Too Dry)") 
                  : activeCrop.moisture > 75 
                  ? (language === "te" ? "(చాలా తడిగా ఉంది)" : "(Too Wet)") 
                  : (language === "te" ? "(ఆరోగ్యకరం)" : "(Healthy)")}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={activeCrop.moisture}
              onChange={(e) => updateActiveMetric("moisture", parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>{language === "te" ? "ఎండిన నేల (10%)" : "Dry Soil (10%)"}</span>
              <span>{language === "te" ? "ఆదర్శ పరిమితి (45-75%)" : "Ideal Range (45-75%)"}</span>
              <span>{language === "te" ? "బురదగా ఉంది (95%)" : "Muddy Soil (95%)"}</span>
            </div>
          </div>

          {/* Temperature slider */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100/60">
            <div className="flex justify-between items-center">
              <label className="text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-orange-500" />
                {t.simFactorTemp}
              </label>
              <span className={`text-xs font-mono font-bold ${
                activeCrop.temperature > 30 || activeCrop.temperature < 15 ? "text-rose-600" : "text-emerald-700"
              }`}>
                {activeCrop.temperature}°C {activeCrop.temperature < 15 
                  ? (language === "te" ? "(చాలా చల్లగా ఉంది)" : "(Too Cold)") 
                  : activeCrop.temperature > 30 
                  ? (language === "te" ? "(చాలా వేడిగా ఉంది)" : "(Too Hot)") 
                  : (language === "te" ? "(అద్భుతం)" : "(Excellent)")}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={activeCrop.temperature}
              onChange={(e) => updateActiveMetric("temperature", parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>{language === "te" ? "చలి (5°C)" : "Cold (5°C)"}</span>
              <span>{language === "te" ? "అnuకూలం (18-29°C)" : "Comfortable (18-29°C)"}</span>
              <span>{language === "te" ? "అత్యంత వేడి (45°C)" : "Hot Summer (45°C)"}</span>
            </div>
          </div>

          {/* Soil pH slider */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100/60">
            <div className="flex justify-between items-center">
              <label className="text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-500" />
                {t.simFactorPh}
              </label>
              <span className={`text-xs font-mono font-bold ${
                activeCrop.soilPh < 5.5 || activeCrop.soilPh > 7.5 ? "text-rose-600" : "text-emerald-700"
              }`}>
                {activeCrop.soilPh} pH {activeCrop.soilPh < 5.5 
                  ? (language === "te" ? "(ఆమ్లయుతం/పుల్లటి నేల)" : "(Sour/Acidic)") 
                  : activeCrop.soilPh > 7.5 
                  ? (language === "te" ? "(క్షారయుతం/చేదు నేల)" : "(Bitter/Alkaline)") 
                  : (language === "te" ? "(సమతుల్యం)" : "(Balanced)")}
              </span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.1"
              value={activeCrop.soilPh}
              onChange={(e) => updateActiveMetric("soilPh", parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>{language === "te" ? "ఆమ్లం (4.0)" : "Acidic (4.0)"}</span>
              <span>{language === "te" ? "తీపి మట్టి (6.0 - 7.0)" : "Optimal Sweet Soil (6.0 - 7.0)"}</span>
              <span>{language === "te" ? "క్షారం (9.0)" : "Alkaline (9.0)"}</span>
            </div>
            <p className="text-[10px] text-slate-500 italic leading-relaxed mt-1">
              💡 {t.simTipPh}
            </p>
          </div>
        </div>

        {/* Right Side: Dashboard status report */}
        <div className="bg-slate-900 text-white rounded-2xl p-4.5 flex flex-col justify-between border border-slate-950 shadow-inner">
          
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-400 tracking-wider">
                {language === "te" ? "ఆరోగ్య నివేదిక & పరిస్థితి" : "HEALTH SCORE & DIAGNOSIS"}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1 ${
                activeCrop.status === "optimal"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900"
                  : activeCrop.status === "warning"
                  ? "bg-amber-950/80 text-amber-400 border border-amber-900"
                  : "bg-rose-950/80 text-rose-400 border border-rose-900"
              }`}>
                {activeCrop.status === "optimal" && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                {activeCrop.status === "warning" && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                {activeCrop.status === "critical" && <XCircle className="h-3.5 w-3.5 shrink-0" />}
                
                {activeCrop.status === "optimal" 
                  ? (language === "te" ? "అద్భుతం" : "EXCELLENT") 
                  : activeCrop.status === "warning" 
                  ? (language === "te" ? "శ్రద్ధ అవసరం" : "ATTENTION NEEDED") 
                  : (language === "te" ? "ప్రమాదం" : "DANGER")}
              </span>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-md font-bold text-slate-100">{activeCrop.name}</h4>
              <p className="text-xs text-slate-400">
                {language === "te" ? "నాటిన తేదీ" : "Sown on"}{" "}
                <span className="text-slate-200 font-mono font-medium">{activeCrop.sowingDate}</span>.{" "}
                {language === "te" ? "పంట తెగుళ్ల గుర్తింపు సులభ నియమాలకు అనుగుణంగా తనిఖీ చేయబడింది." : "Checked using simple crop disease agronomy guidelines."}
              </p>

              {/* Dynamic alert notices based on state */}
              <div className="p-3 rounded-lg text-xs bg-slate-950/80 border border-slate-800 text-slate-300">
                {activeCrop.status === "optimal" && (
                  <span className="text-emerald-400/90 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />{" "}
                    {language === "te" 
                      ? "మీ పంట నేల తేమ, ఉష్ణోగ్రత మరియు pH విలువలు పూర్తిగా సమతుల్యంగా ఉన్నాయి. పంట ఆరోగ్యకరమైన దిగుబడ్రికి అనుకూలంగా ఉంది!" 
                      : "Your soil moisture, temperature, and pH are fully balanced. The crop environment is perfect for healthy yields!"}
                  </span>
                )}
                {activeCrop.status === "warning" && (
                  <span className="text-amber-400/95 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{" "}
                    {language === "te" 
                      ? `మట్టి ఎండిపోతోంది (${activeCrop.moisture}%). వాతావరణాన్ని తగిన విధంగా మార్చడానికి క్రింది "పంటకు నీరు పెట్టండి" బటన్ నొక్కండి.` 
                      : `Soil is dry (${activeCrop.moisture}%). Please tap the "Irrigate / Water Plot" button below to hydrate the roots.`}
                  </span>
                )}
                {activeCrop.status === "critical" && (
                  <div className="space-y-1">
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />{" "}
                      {language === "te" ? "పంట ఎదుగుదల ప్రమాదకరమైన స్థితిలో ఉంది!" : "Highly Stressed Crop Environment!"}
                    </span>
                    <p className="text-[11px] text-slate-300 pl-4.5 font-sans leading-relaxed">
                      {language === "te" 
                        ? "మట్టి చాలా పొడిగా ఉంది లేదా సమతుల్యత దెబ్బతింది, వేళ్లకు పోషకాలు అందక పంట వాడిపోతుంది. నేల పోషణకు వెంటనే క్రింద 'నీటి సరఫరా' లేదా 'ఎరువులు' బటన్ నొక్కండి!" 
                        : "This soil is dangerously dry or has unstable pH. This blocks root nutrition and causes wilting. Tap 'Water Plot' or 'Add Compost' below to restore vital minerals!"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Nutrients N-P-K status bar segment */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <h5 className="text-[10px] font-mono font-medium text-slate-400 mb-2 uppercase tracking-wide">
                {language === "te" ? "మట్టి లోని ప్రధాన ద్రావకాలు (NPK ನಿష్పత్తి)" : "Macro-nutrient Ratio Index (NPK Plant Nutrition)"}
              </h5>
              
              <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
                <div className="bg-slate-950/40 border border-slate-800/60 p-2 rounded-lg">
                  <div className="text-[11px] text-emerald-400 font-bold font-mono">N - {language === "te" ? "నైట్రోజన్" : "Nitrogen"}</div>
                  <div className="font-semibold text-xs font-mono text-slate-200 mt-0.5">{activeCrop.npkRatio.n} <span className="text-[9px] text-slate-500 font-sans font-normal">mg/kg</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                    {language === "te" ? "ఆకులు బలంగా పచ్చగా పెరగడానికి" : "Grows lush green foliage & leaves"}
                  </div>
                </div>
                <div className="bg-slate-950/40 border border-slate-800/60 p-2 rounded-lg">
                  <div className="text-[11px] text-sky-400 font-bold font-mono">P - {language === "te" ? "భాస్వరం" : "Phosphorus"}</div>
                  <div className="font-semibold text-xs font-mono text-slate-200 mt-0.5">{activeCrop.npkRatio.p} <span className="text-[9px] text-slate-500 font-sans font-normal">mg/kg</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                    {language === "te" ? "వేర్లు మరియు పూల ఎదుగుదలకు" : "Builds strong roots & bright flowers"}
                  </div>
                </div>
                <div className="bg-slate-950/40 border border-slate-800/60 p-2 rounded-lg">
                  <div className="text-[11px] text-orange-400 font-bold font-mono">K - {language === "te" ? "పొటాషియం" : "Potassium"}</div>
                  <div className="font-semibold text-xs font-mono text-slate-200 mt-0.5">{activeCrop.npkRatio.k} <span className="text-[9px] text-slate-500 font-sans font-normal">mg/kg</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                    {language === "te" ? "రోగ నిరోధక శక్తి పెంచడానికి" : "Boosts plant disease immunity"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick correctional actions */}
          <div className="mt-5 pt-3.5 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              onClick={handleIrrigate}
              className="text-xs bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex-1 text-center min-w-[125px] h-9 flex items-center justify-center gap-1.5"
            >
              <Droplet className="h-3.5 w-3.5" />
              {t.simBtnIrrigate}
            </button>
            <button
              onClick={handleFortifyCompost}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex-1 text-center min-w-[125px] h-9 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.simBtnCompost}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
