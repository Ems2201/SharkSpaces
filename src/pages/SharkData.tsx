import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Thermometer, MapPin, Waves, Mic, Clock, Tag, Fish, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import worldMap from "@/assets/world-map.png";

interface SharkDataPoint {
  timestamp: number;
  temperature: number;
  latitude: number;
  longitude: number;
  seaSurfaceHeight: number;
  deltaTime: number;
  accelerometer: { x: number; y: number; z: number };
}

interface AudioDetection {
  id: string;
  speciesName: string;
  timestamp: number;
  confidence: number;
  icon: string;
  gForce?: number;
}

interface SharkTag {
  id: string;
  species: string;
  icon: string;
  baseTemp: number;
  baseLat: number;
  baseLong: number;
  mapTop: number;
  mapLeft: number;
}

const SharkData = () => {
  const { t } = useTranslation();
  
  const sharkTags: SharkTag[] = [
    { id: 'TAG-001', species: t('sharkData.sharks.greatWhite'), icon: '🦈', baseTemp: 298, baseLat: -33.9249, baseLong: 18.4241, mapTop: 72, mapLeft: 58 },
    { id: 'TAG-002', species: t('sharkData.sharks.hammerhead'), icon: '🦈', baseTemp: 302, baseLat: -0.9538, baseLong: -90.9656, mapTop: 52, mapLeft: 18 },
    { id: 'TAG-003', species: t('sharkData.sharks.tiger'), icon: '🦈', baseTemp: 305, baseLat: 25.0343, baseLong: -77.3963, mapTop: 38, mapLeft: 23 },
    { id: 'TAG-004', species: t('sharkData.sharks.whale'), icon: '🦈', baseTemp: 307, baseLat: -20.5917, baseLong: 116.7083, mapTop: 68, mapLeft: 73 },
    { id: 'TAG-005', species: t('sharkData.sharks.reef'), icon: '🦈', baseTemp: 310, baseLat: -18.2871, baseLong: 147.6992, mapTop: 63, mapLeft: 80 },
  ];

  // Define prey species for each shark type
  const sharkPreyMap: Record<string, Array<{ name: string; icon: string }>> = {
    'Great White Shark': [
      { name: t('sharkData.prey.harborSeal'), icon: '🦭' },
      { name: t('sharkData.prey.seaLion'), icon: '🦭' },
      { name: t('sharkData.prey.dolphin'), icon: '🐬' },
      { name: t('sharkData.prey.tuna'), icon: '🐟' },
      { name: t('sharkData.prey.seaTurtle'), icon: '🐢' },
      { name: t('sharkData.prey.salmon'), icon: '🐟' },
      { name: t('sharkData.prey.mackerel'), icon: '🐟' },
    ],
    'Hammerhead Shark': [
      { name: t('sharkData.prey.stingray'), icon: '🐠' },
      { name: t('sharkData.prey.grouper'), icon: '🐠' },
      { name: t('sharkData.prey.octopus'), icon: '🐙' },
      { name: t('sharkData.prey.crab'), icon: '🦀' },
      { name: t('sharkData.prey.lobster'), icon: '🦞' },
      { name: t('sharkData.prey.sardine'), icon: '🐟' },
      { name: t('sharkData.prey.herring'), icon: '🐟' },
    ],
    'Tiger Shark': [
      { name: t('sharkData.prey.seaTurtle'), icon: '🐢' },
      { name: t('sharkData.prey.harborSeal'), icon: '🦭' },
      { name: t('sharkData.prey.dolphin'), icon: '🐬' },
      { name: t('sharkData.prey.albatross'), icon: '🕊️' },
      { name: t('sharkData.prey.pelican'), icon: '🦩' },
      { name: t('sharkData.prey.mackerel'), icon: '🐟' },
      { name: t('sharkData.prey.stingray'), icon: '🐠' },
    ],
    'Whale Shark': [
      { name: t('sharkData.prey.krill'), icon: '🦐' },
      { name: t('sharkData.prey.plankton'), icon: '🦠' },
      { name: t('sharkData.prey.anchovy'), icon: '🐟' },
      { name: t('sharkData.prey.sardine'), icon: '🐟' },
      { name: t('sharkData.prey.jellyfish'), icon: '🪼' },
      { name: t('sharkData.prey.copepods'), icon: '🔬' },
    ],
    'Reef Shark': [
      { name: t('sharkData.prey.clownfish'), icon: '🐠' },
      { name: t('sharkData.prey.parrotfish'), icon: '🐠' },
      { name: t('sharkData.prey.octopus'), icon: '🐙' },
      { name: t('sharkData.prey.crab'), icon: '🦀' },
      { name: t('sharkData.prey.lobster'), icon: '🦞' },
      { name: t('sharkData.prey.seaUrchin'), icon: '🦔' },
      { name: t('sharkData.prey.shrimp'), icon: '🦐' },
    ],
  };

  const [selectedTag, setSelectedTag] = useState<SharkTag>(sharkTags[0]);
  const [currentData, setCurrentData] = useState<SharkDataPoint>({
    timestamp: Date.now(),
    temperature: selectedTag.baseTemp,
    latitude: selectedTag.baseLat,
    longitude: selectedTag.baseLong,
    seaSurfaceHeight: 0.15,
    deltaTime: 0,
    accelerometer: { x: 0.2, y: 0.5, z: 9.8 }
  });

  const [historicalData, setHistoricalData] = useState<SharkDataPoint[]>([]);
  const [recentUpdate, setRecentUpdate] = useState<string | null>(null);
  const [audioDetections, setAudioDetections] = useState<AudioDetection[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<AudioDetection | null>(null);
  
  // Temperature tracking
  const [isSubmerged, setIsSubmerged] = useState(false);
  
  // Logs
  const [measurementLogs, setMeasurementLogs] = useState<string[]>([]);
  
  // Map position states (keeping icons in ocean areas)
  const [sharkMapPos, setSharkMapPos] = useState({ top: 40, left: 35 });
  const [fishMapPos, setFishMapPos] = useState({ top: 45, left: 38 });
  const [nextLocation, setNextLocation] = useState({ lat: 0, long: 0 });

  // Simulate real-time updates
  useEffect(() => {
    // Reset data when tag changes
    setHistoricalData([]);
    setMeasurementLogs([]);
    setCurrentData({
      timestamp: Date.now(),
      temperature: selectedTag.baseTemp,
      latitude: selectedTag.baseLat,
      longitude: selectedTag.baseLong,
      seaSurfaceHeight: 0.15,
      deltaTime: 0,
      accelerometer: { x: 0.2, y: 0.5, z: 9.8 }
    });

    const interval = setInterval(() => {
      const tempVariation = selectedTag.baseTemp * 0.04; // 4% variation range
      const newDataPoint: SharkDataPoint = {
        timestamp: Date.now(),
        temperature: selectedTag.baseTemp * 0.96 + Math.random() * tempVariation, // 0.96 to 1.0 of baseTemp
        latitude: selectedTag.baseLat + (Math.random() - 0.5) * 0.1,
        longitude: selectedTag.baseLong + (Math.random() - 0.5) * 0.1,
        seaSurfaceHeight: 0.1 + Math.random() * 0.2,
        deltaTime: 5000,
        accelerometer: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: 9.8 + (Math.random() - 0.5) * 0.5
        }
      };

      // Determine if submerged (assuming negative seaSurfaceHeight means underwater)
      const depth = -newDataPoint.seaSurfaceHeight * 10; // Convert to approximate depth in meters
      const currentlySubmerged = depth > 5;
      setIsSubmerged(currentlySubmerged);

      setCurrentData(newDataPoint);
      setHistoricalData(prev => [...prev.slice(-20), newDataPoint]);
      
      // Add measurement log with consistency value
      const consistency = Math.floor(Math.random() * 101); // 0-100
      const logEntry = `[${new Date(newDataPoint.timestamp).toLocaleTimeString()}] ${t('sharkData.log.temp')}: ${newDataPoint.temperature.toFixed(2)}K | ${t('sharkData.log.lat')}: ${newDataPoint.latitude.toFixed(4)}° | ${t('sharkData.log.long')}: ${newDataPoint.longitude.toFixed(4)}° | ${t('sharkData.log.ssh')}: ${newDataPoint.seaSurfaceHeight.toFixed(3)}m | ${t('sharkData.gForce')}: ${(Math.sqrt(newDataPoint.accelerometer.x ** 2 + newDataPoint.accelerometer.y ** 2 + newDataPoint.accelerometer.z ** 2) / 9.8).toFixed(2)}G | ${t('sharkData.log.consistency')}: ${consistency}%`;
      setMeasurementLogs(prev => [logEntry, ...prev.slice(0, 49)]); // Keep last 50 logs
      
      // Update map positions - use shark-specific coordinates with small jitter
      const baseTop = selectedTag.mapTop;
      const baseLeft = selectedTag.mapLeft;
      const jitter = () => (Math.random() - 0.5) * 0.8; // ±0.4%
      const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
      const newSharkTop = clamp(baseTop + jitter(), baseTop - 2, baseTop + 2);
      const newSharkLeft = clamp(baseLeft + jitter(), baseLeft - 2, baseLeft + 2);
      // Fish extremely close to shark - 0.15-0.65% away
      const newFishTop = clamp(newSharkTop + 0.15 + Math.random() * 0.5, baseTop - 2, baseTop + 2);
      const newFishLeft = clamp(newSharkLeft + 0.15 + Math.random() * 0.5, baseLeft - 2, baseLeft + 2);
      
      setSharkMapPos({ top: newSharkTop, left: newSharkLeft });
      setFishMapPos({ top: newFishTop, left: newFishLeft });
      
      // Calculate next predicted location
      const nextLat = newDataPoint.latitude + (Math.random() - 0.5) * 0.05;
      const nextLong = newDataPoint.longitude + (Math.random() - 0.5) * 0.05;
      setNextLocation({ lat: nextLat, long: nextLong });
      
      // Randomly update different fields
      const fields = ['temperature', 'latitude', 'longitude', 'seaSurfaceHeight', 'accelerometer', 'timestamp'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      setRecentUpdate(randomField);
      
      setTimeout(() => setRecentUpdate(null), 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedTag]);

  // Simulate audio detections based on selected shark's prey
  useEffect(() => {
    // Clear detections when tag changes
    setAudioDetections([]);

    const preySpecies = sharkPreyMap[selectedTag.species] || [];
    
    if (preySpecies.length === 0) return;

    const interval = setInterval(() => {
      const randomPrey = preySpecies[Math.floor(Math.random() * preySpecies.length)];
      // Generate varied G-force for different prey detection scenarios
      // Different hunting behaviors produce different G-forces
      const huntingScenarios = [
        { min: 0.8, max: 1.2 },   // Calm swimming/cruising
        { min: 1.5, max: 2.5 },   // Active pursuit
        { min: 2.8, max: 4.5 },   // Sharp turn/acceleration
        { min: 5.0, max: 7.5 },   // Burst speed attack
        { min: 8.0, max: 12.0 },  // Extreme maneuver
      ];
      
      const scenario = huntingScenarios[Math.floor(Math.random() * huntingScenarios.length)];
      const gForce = scenario.min + Math.random() * (scenario.max - scenario.min);
      
      const newDetection: AudioDetection = {
        id: `detection-${Date.now()}`,
        speciesName: randomPrey.name,
        timestamp: Date.now(),
        confidence: 75 + Math.random() * 25, // 75-100%
        icon: randomPrey.icon,
        gForce: gForce,
      };

      setAudioDetections(prev => [newDetection, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedTag]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getCardClass = (field: string) => {
    return `p-6 transition-all duration-300 ${
      recentUpdate === field
        ? 'bg-primary text-primary-foreground border-primary glow-yellow scale-105'
        : 'bg-card border-border hover:border-primary'
    } border-2`;
  };

  // Calculate min/max temperature from graph data
  const minTemp = historicalData.length > 0 
    ? Math.min(...historicalData.map(d => d.temperature))
    : null;
  const maxTemp = historicalData.length > 0 
    ? Math.max(...historicalData.map(d => d.temperature))
    : null;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2 animate-slide-in">
          {t('sharkData.title')}
        </h1>
        <p className="text-foreground/80 mb-6 text-lg">
          {t('sharkData.subtitle')}
        </p>

        {/* Tag Selection Menu */}
        <Card className="p-4 bg-card border-2 border-primary/20 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-primary">{t('sharkData.selectTag')}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {sharkTags.map((tag) => (
              <Button
                key={tag.id}
                onClick={() => setSelectedTag(tag)}
                variant={selectedTag.id === tag.id ? "default" : "outline"}
                className={`flex items-center gap-2 transition-all ${
                  selectedTag.id === tag.id 
                    ? 'scale-105 shadow-lg' 
                    : 'hover:scale-105'
                }`}
              >
                <span className="text-2xl">{tag.icon}</span>
                <div className="text-left">
                  <div className="font-bold text-sm">{tag.id}</div>
                  <div className="text-xs opacity-80">{tag.species}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Real-time Data Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className={getCardClass('temperature')}>
            <div className="flex items-center gap-3 mb-2">
              <Thermometer className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">{t('sharkData.temperature')}</h3>
            </div>
            <p className="text-3xl font-bold">{currentData.temperature.toFixed(2)}</p>
            <p className="text-sm opacity-80">{t('sharkData.kelvin')}</p>
          </Card>

          <Card className={getCardClass('latitude')}>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">{t('sharkData.latitude')}</h3>
            </div>
            <p className="text-3xl font-bold">{currentData.latitude.toFixed(4)}°</p>
            <p className="text-sm opacity-80">{t('sharkData.degrees')}</p>
          </Card>

          <Card className={getCardClass('longitude')}>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">{t('sharkData.longitude')}</h3>
            </div>
            <p className="text-3xl font-bold">{currentData.longitude.toFixed(4)}°</p>
            <p className="text-sm opacity-80">{t('sharkData.degrees')}</p>
          </Card>

          <Card className={getCardClass('seaSurfaceHeight')}>
            <div className="flex items-center gap-3 mb-2">
              <Waves className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">{t('sharkData.seaSurfaceHeight')}</h3>
            </div>
            <p className="text-3xl font-bold">{currentData.seaSurfaceHeight.toFixed(3)}</p>
            <p className="text-sm opacity-80">{t('sharkData.meters')}</p>
          </Card>
        </div>

        {/* Temperature Min/Max when Submerged */}
        <Card className="p-6 bg-card border-2 border-primary/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Thermometer className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-xl text-primary">{t('sharkData.temperatureRange')}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary/30 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground/70 mb-2">{t('sharkData.status')}</p>
              <p className={`text-2xl font-bold ${isSubmerged ? 'text-primary' : 'text-foreground/50'}`}>
                {isSubmerged ? t('sharkData.submerged') : t('sharkData.surface')}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                {isSubmerged ? t('sharkData.depthInfo') : t('sharkData.surfaceInfo')}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <p className="text-sm text-foreground/70 mb-2">{t('sharkData.minTemperature')}</p>
              <p className="text-3xl font-bold text-blue-400">
                {minTemp !== null ? `${minTemp.toFixed(2)}K` : '--'}
              </p>
              <p className="text-xs text-foreground/60 mt-1">{t('sharkData.coldest')}</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-sm text-foreground/70 mb-2">{t('sharkData.maxTemperature')}</p>
              <p className="text-3xl font-bold text-red-400">
                {maxTemp !== null ? `${maxTemp.toFixed(2)}K` : '--'}
              </p>
              <p className="text-xs text-foreground/60 mt-1">{t('sharkData.warmest')}</p>
            </div>
          </div>
        </Card>

        {/* Additional Data */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className={`${getCardClass('accelerometer')} p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{t('sharkData.accelerometer')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-foreground/70 mb-1">{t('sharkData.xAxis')}</p>
                <p className="text-2xl font-bold text-primary">{currentData.accelerometer.x.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">{t('sharkData.yAxis')}</p>
                <p className="text-2xl font-bold text-primary">{currentData.accelerometer.y.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">{t('sharkData.zAxis')}</p>
                <p className="text-2xl font-bold text-primary">{currentData.accelerometer.z.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className={`${getCardClass('timestamp')} p-6`}>
            <h3 className="font-bold text-lg mb-4">{t('sharkData.timestampInfo')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground/70">{t('sharkData.currentTime')}:</span>
                <span className="font-bold text-primary">{formatTimestamp(currentData.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">{t('sharkData.deltaTime')}:</span>
                <span className="font-bold text-primary">{currentData.deltaTime}{t('sharkData.millisecondsAbbr')}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Measurement Logs */}
        <Card className="p-6 bg-card border-2 border-primary/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-xl text-primary">{t('sharkData.measurementLogs')}</h3>
          </div>
          {measurementLogs.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">{t('sharkData.noMeasurements')}</p>
          ) : (
            <ScrollArea className="h-64 w-full rounded-md border border-primary/20 p-4 bg-secondary/20">
              <div className="space-y-2 font-mono text-xs">
                {measurementLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-2 bg-card/50 rounded border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>

        {/* Audio Detections */}
        <Card className="p-6 bg-card border-2 border-primary/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-xl text-primary">{t('sharkData.audioDetections')}</h3>
          </div>
          {audioDetections.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">{t('sharkData.listening')}</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {audioDetections.map((detection) => (
                <div
                  key={detection.id}
                  onClick={() => setSelectedDetection(detection)}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-primary/20 hover:border-primary hover:bg-secondary transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{detection.icon}</span>
                    <div>
                      <p className="font-bold text-foreground">{detection.speciesName}</p>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(detection.timestamp)}</span>
                      </div>
                      {selectedDetection?.id === detection.id && detection.gForce && (
                        <div className="mt-2 p-2 bg-primary/20 rounded border border-primary">
                          <p className="text-sm font-bold text-primary">
                            {t('sharkData.gForce')}: {detection.gForce.toFixed(2)} G
                          </p>
                          <p className="text-xs text-foreground/70">{t('sharkData.detectedAt')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{detection.confidence.toFixed(1)}%</p>
                    <p className="text-xs text-foreground/60">{t('sharkData.confidence')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Temperature Chart */}
          <Card className="p-6 bg-card border-2 border-primary/20">
            <h3 className="font-bold text-xl mb-4 text-primary">{t('sharkData.temperatureChart')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(() => {
                  const temperatureData = historicalData.map(d => ({
                    time: formatTimestamp(d.timestamp),
                    value: d.temperature
                  }));
                  return temperatureData;
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '2px solid hsl(var(--primary))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* G-Force Chart */}
          <Card className="p-6 bg-card border-2 border-primary/20">
            <h3 className="font-bold text-xl mb-4 text-primary">{t('sharkData.gForce')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData.map(d => ({
                  ...d,
                  gForce: Math.sqrt(d.accelerometer.x ** 2 + d.accelerometer.y ** 2 + d.accelerometer.z ** 2) / 9.8
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '2px solid hsl(var(--primary))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gForce" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Predictive Map */}
        <Card className="p-6 bg-card border-2 border-primary/20">
          <h3 className="font-bold text-xl mb-4 text-primary">{t('sharkData.predictiveMap')}</h3>
          <div className="aspect-video rounded-lg relative overflow-hidden bg-ocean">
            <img 
              src={worldMap} 
              alt={t('sharkData.worldMapAlt')} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Current Position - Shark Icon */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[5000ms] ease-in-out"
              style={{ top: `${sharkMapPos.top}%`, left: `${sharkMapPos.left}%` }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-primary/30 rounded-full animate-pulse" />
                <div className="relative bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                  <span className="text-sm">{selectedTag.icon}</span>
                </div>
              </div>
            </div>

            {/* Predicted Position - Fish/Habitat Icon */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[5000ms] ease-in-out"
              style={{ top: `${fishMapPos.top}%`, left: `${fishMapPos.left}%` }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="relative bg-accent text-accent-foreground rounded-full p-1 shadow-lg">
                  <Fish className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Connection line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line 
                x1={`${sharkMapPos.left}%`}
                y1={`${sharkMapPos.top}%`}
                x2={`${fishMapPos.left}%`}
                y2={`${fishMapPos.top}%`}
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                className="opacity-60 transition-all duration-[5000ms] ease-in-out"
              />
            </svg>

            <div className="absolute bottom-4 left-4 bg-card/90 p-3 rounded-lg border border-primary/40 backdrop-blur">
              <p className="text-xs font-bold text-primary mb-1">{t('sharkData.currentPosition')}</p>
              <p className="text-xs text-foreground">
                {currentData.latitude.toFixed(4)}°N, {Math.abs(currentData.longitude).toFixed(4)}°W
              </p>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-secondary/90 p-3 rounded-lg border border-primary/40 backdrop-blur">
              <p className="text-xs font-bold text-primary mb-1">{t('sharkData.nextLocation')}</p>
              <p className="text-xs text-foreground">
                {nextLocation.lat.toFixed(4)}°N, {Math.abs(nextLocation.long).toFixed(4)}°W
              </p>
              <p className="text-xs text-foreground/60 mt-1">{t('sharkData.realTimeUpdate')}</p>
            </div>
            
            <div className="absolute top-4 right-4 bg-accent/90 p-3 rounded-lg border border-accent backdrop-blur">
              <p className="text-xs font-bold text-accent-foreground mb-2">{t('sharkData.feedingZone')}</p>
              <p className="text-xs text-accent-foreground/80">{t('sharkData.basedOnPlanktonDensity')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SharkData;