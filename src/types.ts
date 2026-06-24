export interface DiagnosisReport {
  scannedAt: string;
  imageSrc?: string;
  healthy: boolean;
  confidence: number;
  plantName: string;
  diseaseName: string;
  symptoms: string[];
  cause: string;
  severity: string;
  treatment: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  cropAdvice: string;
}

export interface CropItem {
  id: string;
  name: string;
  type: string;
  status: 'optimal' | 'warning' | 'critical';
  moisture: number; // percentage
  temperature: number; // °C
  soilPh: number; // 0-14
  npkRatio: {
    n: number; // Nitrogen (mg/kg)
    p: number; // Phosphorus (mg/kg)
    k: number; // Potassium (mg/kg)
  };
  sowingDate: string;
}

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface AgriWeather {
  temp: number;
  condition: string;
  humidity: number;
  uvIndex: number;
  rainfallRisk: number;
  locationName: string;
}
