export interface LocaleStrings {
  appName: string;
  appSub: string;
  MLTitle: string;
  bannerTitle: string;
  bannerDesc: string;
  tabScanner: string;
  tabAdvisor: string;
  tabMonitor: string;
  
  scannerTitle: string;
  scannerSub: string;
  resetScanner: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  dragDropText: string;
  orChooseText: string;
  selectImageBtn: string;
  useCameraBtn: string;
  runDiagBtn: string;
  processingText: string;
  imgLoadedText: string;
  plantHintLabel: string;
  plantHintPlaceholder: string;
  
  certTitle: string;
  certLogPrefix: string;
  certHealthy: string;
  certPathogen: string;
  certConfidence: string;
  labelPlantGroup: string;
  labelClassCondition: string;
  labelSeverity: string;
  labelSymptoms: string;
  labelCause: string;
  labelMitigations: string;
  labelOrganic: string;
  labelPreventive: string;
  labelChemical: string;
  labelExpertChecklist: string;
  zeroStateTitle: string;
  zeroStateDesc: string;
  
  metricsTitle: string;
  metricsSub: string;
  metricsModel: string;
  metricsAccuracy: string;
  metricsScopes: string;
  metricsLogs: string;
  archiveTitle: string;
  archiveSub: string;
  archiveEmpty: string;
  ruleTitle: string;
  ruleDesc: string;
  
  chatTitle: string;
  chatSub: string;
  chatReset: string;
  chatDrafting: string;
  chatPlaceholder: string;
  chatWelcomeInit: string;
  chatResetWelcome: string;
  chatPresetTomato: string;
  chatPresetPest: string;
  chatPresetWater: string;
  chatPresetNpk: string;
  
  simTitle: string;
  simSub: string;
  simZoneLabel: string;
  simFactorsTitle: string;
  simFactorMoisture: string;
  simFactorTemp: string;
  simFactorPh: string;
  simFactorN: string;
  simFactorP: string;
  simFactorK: string;
  simBtnIrrigate: string;
  simBtnCompost: string;
  simBtnReset: string;
  simStatusOptimal: string;
  simStatusWarning: string;
  simStatusCritical: string;
  simTipMoisture: string;
  simTipTemp: string;
  simTipPh: string;
}

export const englishTranslations: LocaleStrings = {
  appName: "Crop Disease Detection",
  appSub: "Easy and friendly AI crop disease detection and agriculture companion",
  MLTitle: "Machine Learning Agronomist Agent",
  bannerTitle: "Instantly scan and mitigate domestic crop threats",
  bannerDesc: "Based on specialized botanical databases. Snap direct foliage photographs, consult our intelligent advisory chatbot, or simulate ideal soil macro-nutrients.",
  tabScanner: "Leaf Scanner & Cures",
  tabAdvisor: "Ask Botanist Chatbot",
  tabMonitor: "Soil & Climate Simulator",
  
  scannerTitle: "Agricultural Foliage Scanner",
  scannerSub: "Provide a clear close-up picture of the plant leaves showing signs of worry.",
  resetScanner: "Reset Scanner",
  step1Title: "Upload Leaf Image",
  step1Desc: "Drop a photo of yellowed or spotted leaves.",
  step2Title: "Add Plant Name (Optional)",
  step2Desc: "Type what plant it is (e.g. Tomato or Potato).",
  step3Title: "Get Organic Cure",
  step3Desc: "Tap diagnosis to see instant remedies!",
  dragDropText: "Drag & drop plant leaf picture",
  orChooseText: "Or choose an image from storage",
  selectImageBtn: "Select Image file",
  useCameraBtn: "Use Live Camera",
  runDiagBtn: "Run Intelligent Diagnosis",
  processingText: "Processing Soil & Foliage patterns...",
  imgLoadedText: "Image Loaded Successfully",
  plantHintLabel: "Plant Species Hint (Optional)",
  plantHintPlaceholder: "e.g. Tomato, Potato, Pepper, Squash",
  
  certTitle: "Agronomy Botanical Certificate",
  certLogPrefix: "Diagnosis Logged at",
  certHealthy: "Healthy Specimen",
  certPathogen: "Pathogen Detected",
  certConfidence: "Confidence",
  labelPlantGroup: "Identified Plant Group",
  labelClassCondition: "Class / Condition",
  labelSeverity: "Severity Level",
  labelSymptoms: "Identified Symptoms",
  labelCause: "Biological or Environmental Cause",
  labelMitigations: "Prescribed Cultivation Mitigations",
  labelOrganic: "Organic remedies",
  labelPreventive: "Preventive maintenance",
  labelChemical: "Chemical remedies (Standard)",
  labelExpertChecklist: "Agronomist Guidance Checklist",
  zeroStateTitle: "No active scan certificate shown.",
  zeroStateDesc: "Upload a photograph or snap one using your camera to view professional plant pathogen treatments.",
  
  metricsTitle: "Agri-Metrics standard",
  metricsSub: "Real-time active botanical factors",
  metricsModel: "Model Framework",
  metricsAccuracy: "Accuracy Index target",
  metricsScopes: "Permitted Scopes",
  metricsLogs: "Local History Log count",
  archiveTitle: "Diagnosis Archive",
  archiveSub: "Recent diagnostic sweeps on details",
  archiveEmpty: "No registered scan logs yet. Your diagnostic sweeps will be listed here.",
  ruleTitle: "Gardening Rule of Thumb",
  ruleDesc: "Water plants deep down at root levels instead of overhead spraying. Foliage moisture left on leaves from late spraying is the primary vector for fungal spore growth such as early blight or powdery mildew.",
  
  chatTitle: "Botany & Agro Consult Chat",
  chatSub: "Powered by server-side Generative AI. Ask our bot about organic fertilizer compositions, insect deterrence, companion herbs, and watering volume metrics.",
  chatReset: "Reset Chat",
  chatDrafting: "Drafting advisor report...",
  chatPlaceholder: "Ask about crops, soils, watering volume...",
  chatWelcomeInit: "Welcome to **PlantCare AI Advisor**! I am your companion agronomist expert. Ask me anything about crop planting, organic soil compositions, organic pest control formulations, irrigation volumes, or companion planting. What guidelines can I provide for your agricultural targets today?",
  chatResetWelcome: "Consultation log cleared. I am ready to advise you on organic soil enrichment, crop diagnostics, irrigation rates, or optimal companion harvesting practices. How can I guide you?",
  chatPresetTomato: "🍂 Yellow tomato leaves help?",
  chatPresetPest: "🐛 Best organic ways to stop pests?",
  chatPresetWater: "💧 How much watering is too much?",
  chatPresetNpk: "🍀 What is N-P-K fertilizer?",
  
  simTitle: "Soil & Climate Simulator",
  simSub: "Simulate soil qualities and ambient temperatures to observe crop health impacts instantly.",
  simZoneLabel: "Selected Crop Zone (Plot)",
  simFactorsTitle: "Active Simulation Factors",
  simFactorMoisture: "Soil Moisture (RH%)",
  simFactorTemp: "Simulated Temperature (°C)",
  simFactorPh: "Soil pH Balance",
  simFactorN: "Nitrogen (N) Fertilizer",
  simFactorP: "Phosphorus (P) Fertilizer",
  simFactorK: "Potassium (K) Fertilizer",
  simBtnIrrigate: "💧 Irrigate Field",
  simBtnCompost: "🍃 Add Organic Compost",
  simBtnReset: "🔄 Reset Defaults",
  simStatusOptimal: "OPTIMAL HEALTHY",
  simStatusWarning: "MINOR ATTENTION",
  simStatusCritical: "CRITICAL ACTION REQUIRED",
  simTipMoisture: "Tomatoes and cabbages thrive best at 60-70% soil moisture.",
  simTipTemp: "Warm environment promotes quick cell division but raises insect threat risks.",
  simTipPh: "Tomato and cabbage plants love slightly sweet soil between 6.0 and 7.0 pH to absorb fertilizer feeds easily."
};

export const teluguTranslations: LocaleStrings = {
  appName: "పంట తెగుళ్ల గుర్తింపు",
  appSub: "సులువుగా వాడగలిగే వ్యవసాయ కృత్రిమ మేధో పంట తెగుళ్ల గుర్తింపు సహాయకారి",
  MLTitle: "మెషిన్ లెర్నింగ్ వ్యవసాయ నిపుణుడు",
  bannerTitle: "పంటల తెగుళ్లను గుర్తించి వెంటనే నివారణోపాయాలు పొందండి",
  bannerDesc: "విశిష్ట వృక్షశాస్త్ర డేటాబేస్ ఆధారంగా పనిచేస్తుంది. ఆకుల ఫోటోలను స్క్యాన్ చేయండి, మా వ్యవసాయ చాట్‌బాట్ సలహా తీసుకోండి లేదా మట్టి పోషణను పరీక్షించుకోండి.",
  tabScanner: "ఆకుల స్కానర్ & చికిత్స",
  tabAdvisor: "వ్యవసాయ చాట్‌బాట్ సలహాదారు",
  tabMonitor: "నేల & సిమ్యులేటర్",
  
  scannerTitle: "వ్యవసాయ పంట ఆకుల స్కానర్",
  scannerSub: "సమస్య ఉన్న లేదా తెగులు సోకిన ఆకుల స్పష్టమైన ఫోటోను ఇక్కడ అప్‌లోడ్ చేయండి.",
  resetScanner: "స్కానర్ రీసెట్ చేయండి",
  step1Title: "ఆకు ఫోటో అప్‌లోడ్ చేయండి",
  step1Desc: "పసుపు రంగు లేదా మచ్చలు గల ఆకుల ఫోటోను ఎంచుకోండి.",
  step2Title: "మొక్క పేరు రాయండి (ఐచ్ఛికం)",
  step2Desc: "మొక్క ఏ రకమో టైప్ చేయండి (ఉదా: టమోటా లేదా బంగాళాదుంప).",
  step3Title: "నివారణను పొందండి",
  step3Desc: "తక్షణ ఉపాయాల కోసం డయాగ్నసిస్ బటన్ నొక్కండి!",
  dragDropText: "ఆకు ఫోటోను ఇక్కడకు లాగి వదలండి (Drag & Drop)",
  orChooseText: "లేదా గ్యాలరీ / స్టోరేజ్ నుండి ఫోటోను ఎంచుకోండి",
  selectImageBtn: "ఫోటో ఫైల్ ఎంచుకోండి",
  useCameraBtn: "లైవ్ కెమెరా వాడండి",
  runDiagBtn: "కృత్రిమ మేధ పరీక్షను రన్ చేయండి",
  processingText: "ఆకుల రంగులను, మట్టి వివరాలను పరిశీలిస్తోంది...",
  imgLoadedText: "ఫోటో విజయవంతంగా లోడ్ చేయబడింది",
  plantHintLabel: "మొక్క రకం హింట్ (ఐచ్ఛికం)",
  plantHintPlaceholder: "ఉదా: టమోటా, బంగాళాదుంప, మిరప, క్యాబేజీ",
  
  certTitle: "వ్యవసాయ వృక్షశాస్త్ర ఆరోగ్య నివేదిక",
  certLogPrefix: "పరీక్షించిన సమయం",
  certHealthy: "ఆరోగ్యమైన చెట్టు",
  certPathogen: "తెగులు/వ్యాధి గుర్తించబడింది",
  certConfidence: "ఖచ్చితత్వం",
  labelPlantGroup: "గుర్తించిన మొక్క కుటుంబం",
  labelClassCondition: "గుర్తించిన వ్యాధి / తెగులు",
  labelSeverity: "తీవ్రత స్థాయి",
  labelSymptoms: "గుర్తించిన వ్యాధి लक्षणాలు",
  labelCause: "జీవ లేదా పర్యావరణ కారణాలు",
  labelMitigations: "సూచించబడిన నివారణా చర్యలు",
  labelOrganic: "సేంద్రీయ నివారణలు (సహజ పద్ధతులు)",
  labelPreventive: "ముందు జాగ్రత్త చర్యలు",
  labelChemical: "రసాయన నివారణలు (స్టాండర్డ్)",
  labelExpertChecklist: "వ్యవసాయ క్షేత్ర నిపుణుల సలహాలు",
  zeroStateTitle: "ఆరోగ్య నివేదిక ఏదీ సిద్ధంగా లేదు.",
  zeroStateDesc: "వ్యవసాయ నిపుణులు సూచించే నివారణ పద్ధతులు చూడటానికి పైన ఆకుల ఫోటోను అప్‌లోడ్ చేయండి లేదా తీయండి.",
  
  metricsTitle: "వ్యవసాయ కొలమానాలు",
  metricsSub: "పంటకు అవసరమైన చురుకైన కారకాలు",
  metricsModel: "కృత్రిమ మేధో మోడల్",
  metricsAccuracy: "ఖచ్చితత్వ శాతం లక్ష్యం",
  metricsScopes: "అనుమతించబడిన పరికరాలు",
  metricsLogs: "గతంలో పరీక్షించిన వివరాల సంఖ్య",
  archiveTitle: "నివేదికల నిల్వ (Archive)",
  archiveSub: "ఇటీవల పరీక్షించిన పంటల చరిత్ర",
  archiveEmpty: "ఇంకా పరీక్షల చరిత్ర ఏదీ లేదు. మీరు స్కాన్ చేసిన వివరాలు ఇక్కడ కనిపిస్తాయి.",
  ruleTitle: "ఉపయోగకరమైన వ్యవసాయ సూత్రం",
  ruleDesc: "మొక్కలకు నీరు పెట్టేటప్పుడు ఆకులపై చల్లడం కంటే నేరుగా వేర్ల వద్ద తడిచేలా నీరు పెట్టడం మంచిది. ఆలస్యంగా ఆకులపై పడే తేమ వల్ల బూజు లేదా శిలీంధ్ర తెగుళ్లు వ్యాపించే ప్రమాదం ఎక్కువ.",
  
  chatTitle: "వ్యవసాయ సంప్రదింపు చాట్",
  chatSub: "సర్వర్ అనుసంధానిత జనరేటివ్ AI సహాయంతో పనిచేస్తుంది. సేంద్రీయ ఎరువుల తయారీ, పురుగుల నివారణ, సహజ తోడు పంటలు, నీటి పరిమాణాల గురించి మాతో మాట్లాడండి.",
  chatReset: "చాట్ రీసెట్",
  chatDrafting: "సమాధానాన్ని సిద్ధం చేస్తోంది...",
  chatPlaceholder: "తెగుళ్లు, నేలలు, నీరు మరియు ఎరువుల గురించి ఇక్కడ అడగండి...",
  chatWelcomeInit: "పంట తెగుళ్ల గుర్తింపు మరియు సలహా కేంద్రానికి స్వాగతం! నేను మీ తోడు వ్యవసాయ శాస్త్ర నిపుణుడిని. పంటల వేయడం, సేంద్రీయ ఎరువుల తయారీ, పురుగుల నివారణ మరియు తోడు పంటల సాగు గురించి నన్ను ఏదైనా అడగండి. మీకు ఎలాంటి వ్యవసాయ సలహాలు కావాలి?",
  chatResetWelcome: "చాట్ చరిత్ర శుభ్రం చేయబడింది. సేంద్రీయ ఎరువులు, నేల ఆరోగ్యం, నీటి పారుదల లేదా పంట కోత గురించి సలహాలు ఇవ్వడానికి నేను సిద్ధంగా ఉన్నాను. అడగండి!",
  chatPresetTomato: "🍂 టమోటా ఆకులు ఎండి పసుపు రంగులోకి మారితే ఏం చేయాలి?",
  chatPresetPest: "🐛 పురుగుల నివారణకు సేంద్రీయ చిట్కాలు చెప్పండి?",
  chatPresetWater: "💧 పంటకు నీరు ఎక్కువైందని ఎలా తెలుస్తుంది?",
  chatPresetNpk: "🍀 N-P-K ఎరువులు అంటే ఏంటి, ఎలా వాడాలి?",
  
  simTitle: "నేల & వాతావరణ సిమ్యులేటర్",
  simSub: "పంటల ఆరోగ్యంపై ప్రభావాలను తక్షణమే గమనించడానికి నేల లక్షణాలు మరియు స్థానిక ఉష్ణోగ్రతలను అనుకరించండి.",
  simZoneLabel: "ఎంచుకున్న పంట ప్రాంతం (ప్లాట్)",
  simFactorsTitle: "చురుకైన సిమ్యులేషన్ కారకాలు",
  simFactorMoisture: "నేల తేమ (RH%)",
  simFactorTemp: "అనుకరణ చేసిన ఉష్ణోగ్రత (°C)",
  simFactorPh: "నేల పిహెచ్ (pH) సంతులనం",
  simFactorN: "నత్రజని (N) ఎరువు",
  simFactorP: "భాస్వరం (P) ఎరువు",
  simFactorK: "పొటాషియం (K) ఎరువు",
  simBtnIrrigate: "💧 నీటి పారుదల చేయండి",
  simBtnCompost: "🍃 సేంద్రీయ కంపోస్ట్ జోడించండి",
  simBtnReset: "🔄 రీసెట్ చేయండి",
  simStatusOptimal: "ఆరోగ్యకరమైన పరిస్థితి (OPTIMAL)",
  simStatusWarning: "కొద్దిపాటి శ్రద్ధ అవసరం (WARNING)",
  simStatusCritical: "తక్షణ చర్య అవసరం (CRITICAL)",
  simTipMoisture: "టమోటాలు మరియు క్యాబేజీలు కొరకు 60-70% మట్టి తేమ బాగా సహాయపడుతుంది.",
  simTipTemp: "వెచ్చని వాతావరణం కణాల త్వరగా విభజనను ప్రోత్సహిస్తుంది కానీ పురుగుల ముప్పును పెంచుతుంది.",
  simTipPh: "టమోటా మరియు క్యాబేజీ మొక్కలు ఎరువులను సులభంగా గ్రహించడానికి 6.0 మరియు 7.0 pH మధ్య కొద్దిగా తీపి నేలలను ఇష్టపడతాయి."
};
