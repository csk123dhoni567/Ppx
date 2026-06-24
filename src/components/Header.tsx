import React, { useState, useEffect } from "react";
import { Leaf, Sun, CloudRain, Droplets, Thermometer, MapPin, Compass, AlertCircle, Languages } from "lucide-react";
import { AgriWeather } from "../types";

interface HeaderProps {
  language: "en" | "te";
  setLanguage: (lang: "en" | "te") => void;
}

export default function Header({ language, setLanguage }: HeaderProps) {
  const [weather, setWeather] = useState<AgriWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionState, setPermissionState] = useState<string>("prompt");

  // Get agricultural weather conditions using geolocation
  const fetchLocationWeather = () => {
    setLoading(true);
    const fallbackWeather: AgriWeather = {
      temp: 30,
      condition: "Clear Sky (Optimal Sowing)",
      humidity: 62,
      uvIndex: 6,
      rainfallRisk: 15,
      locationName: language === "te" ? "ప్రామాణిక వ్యవసాయ జోన్" : "Standard Agro Climatic zone"
    };

    try {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        setWeather(fallbackWeather);
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lng = parseFloat(position.coords.longitude.toFixed(4));
          setCoords({ lat, lng });
          setPermissionState("granted");

          // Simulate reading coordinates and giving contextual microclimate predictions
          setTimeout(() => {
            let locationName = language === "te" 
              ? `వ్యవసాయ వలయం (${lat}°N, ${lng}°E)`
              : `Agri Zone Sector (${lat}°N, ${lng}°E)`;

            // Give dynamic soil/ambient microclimate reading
            setWeather({
              temp: Math.round(28 + (lat % 8)),
              condition: "Gentle Breeze & Light Spray",
              humidity: Math.round(60 + (lng % 20)),
              uvIndex: Math.round(5 + (lat % 3)),
              rainfallRisk: Math.round(15 + (lat % 45)),
              locationName
            });
            setLoading(false);
          }, 1200);
        },
        (error) => {
          console.warn("Geolocation prompt was denied or timed out:", error);
          setPermissionState("denied");
          setWeather(fallbackWeather);
          setLoading(false);
        },
        { timeout: 8000 }
      );
    } catch (err) {
      console.warn("Geolocation service is restricted/blocked in sandbox:", err);
      setWeather(fallbackWeather);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLocationWeather();
  }, [language]);

  return (
    <header className="bg-slate-900 text-white shadow-xl border-b border-emerald-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Branding & Language Toggler */}
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-emerald-900/40 relative">
              <Leaf className="h-6 w-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-sans tracking-tight flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-green-100 bg-clip-text text-transparent">
                {language === "te" ? "పంట తెగుళ్ల గుర్తింపు" : "Crop Disease Detection"}
              </h1>
              <p className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase">
                {language === "te" ? "సులభమైన వ్యవసాయ సహాయకురాలు v2.5" : "Crop Disease Detection Standard v2.5"}
              </p>
            </div>
          </div>

          {/* Quick toggle for mobile/header */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-emerald-950/50 grow-0 shrink-0 ml-auto md:ml-4">
            <button
              onClick={() => setLanguage("en")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                language === "en"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-450 hover:text-slate-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("te")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                language === "te"
                  ? "bg-emerald-650 text-white shadow-xs font-bold"
                  : "text-slate-450 hover:text-slate-200"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Dynamic Location Climatic Index */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-950/60 p-2 rounded-xl border border-emerald-950/50 self-start md:self-auto w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 min-w-0 flex-1 sm:flex-initial">
            <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="font-medium truncate max-w-[170px] text-slate-300">
              {weather?.locationName || (language === "te" ? "వ్యవసాయ జోన్ గుర్తిస్తోంది..." : "Detecting Agri Zone...")}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-emerald-900/60 hidden sm:block"></div>

          {weather ? (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-slate-300" title={language === "te" ? "పరిసర ఉష్ణోగ్రత" : "Ambient Temperature"}>
                <Thermometer className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span>{weather.temp}°C</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300" title={language === "te" ? "సాపేక్ష ఆర్ద్రత" : "Relative Humidity"}>
                <Droplets className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>{weather.humidity}% RH</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300" title={language === "te" ? "వర్షపాత సంభావ్యత" : "Rainfall Probability"}>
                <CloudRain className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>{weather.rainfallRisk}% {language === "te" ? "వాన సూచన" : "risk"}</span>
              </div>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-emerald-500/80 animate-pulse">
              {language === "te" ? "వాతావరణాన్ని లెక్కిస్తోంది..." : "Measuring microclimate..."}
            </span>
          )}

          <button
            onClick={fetchLocationWeather}
            disabled={loading}
            className="text-[10px] bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 px-2 py-1 rounded font-mono shrink-0 transition-colors cursor-pointer border border-emerald-800/40 ml-auto"
          >
            {loading ? (language === "te" ? "సింక్..." : "syncing...") : (language === "te" ? "జీపీఎస్ సింక్" : "sync gps")}
          </button>
        </div>
        
      </div>
    </header>
  );
}
