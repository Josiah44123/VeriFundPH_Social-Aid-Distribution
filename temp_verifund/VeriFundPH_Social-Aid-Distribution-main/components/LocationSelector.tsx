import React, { useState, useEffect } from 'react';
import { LocationContextType } from '../types';
import { ShieldCheck, ArrowRight, Lock, MapPin, Loader2, ChevronLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface LocationSelectorProps {
  onComplete: (location: LocationContextType) => void;
  onBack: () => void;
}

const REGIONS = [
  { id: 'ncr', group: 'luzon', name: 'National Capital Region', sub: ['Manila', 'Quezon City', 'Taguig', 'Makati', 'Pasig'], center: { lat: 14.5995, lng: 120.9842 }, zoom: 11 },
  { id: 'car', group: 'luzon', name: 'Cordillera Admin Region', sub: ['Baguio', 'Benguet', 'Abra'], center: { lat: 16.4023, lng: 120.5960 }, zoom: 9 },
  { id: 'r1', group: 'luzon', name: 'Region I - Ilocos', sub: ['Ilocos Norte', 'La Union', 'Pangasinan'], center: { lat: 16.6159, lng: 120.3186 }, zoom: 9 },
  { id: 'r7', group: 'visayas', name: 'Region VII - Central Visayas', sub: ['Cebu City', 'Lapu-Lapu', 'Mandaue', 'Dumaguete', 'Tagbilaran'], center: { lat: 10.3157, lng: 123.8854 }, zoom: 9 },
  { id: 'r11', group: 'mindanao', name: 'Region XI - Davao', sub: ['Davao City', 'Digos', 'Panabo', 'Samal', 'Tagum'], center: { lat: 7.1907, lng: 125.4553 }, zoom: 9 },
];

const DEFAULT_CENTER = { lat: 12.8797, lng: 121.7740 };
const DEFAULT_ZOOM = 5.5;

const customIcon = (isSelected: boolean) => L.divIcon({
  className: 'custom-pin',
  html: `<div style="background-color: ${isSelected ? '#CE1126' : '#002878'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid ${isSelected ? '#FCD116' : '#001848'}; box-shadow: 0 0 10px rgba(206,17,38,0.5);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const MapController = ({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const LocationSelector: React.FC<LocationSelectorProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRegion, setSelectedRegion] = useState<typeof REGIONS[0] | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRegionClick = (regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion(region);
      setTimeout(() => {
        setStep(2);
      }, 400);
    }
  };

  const handleBackStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) {
      setStep(1);
      setSelectedRegion(null);
      setSelectedCity('');
    } else {
      onBack();
    }
  };

  const handleCitySubmit = () => {
    if (selectedCity) {
      setStep(3);
    }
  };

  const handleAdminAuth = () => {
    setIsVerifying(true);
    setError('');
    
    setTimeout(() => {
      // Allow 'ADMIN' or standard code length for demo accessibility
      if (adminCode.toUpperCase() === 'ADMIN' || adminCode.length >= 4) {
        setIsVerifying(false);
        onComplete({
            region: selectedRegion?.name || '',
            province: selectedRegion?.group.toUpperCase() || '', 
            city: selectedCity
        });
      } else {
        setIsVerifying(false);
        setError('INVALID ACCESS CODE');
      }
    }, 1500);
  };

  return (
    <div className="h-screen overflow-y-auto bg-gov-900 flex flex-col items-center justify-center relative font-sans">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(2,6,23,0.9),rgba(2,6,23,0.9)),url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-6xl px-6 h-full flex flex-col justify-center">
        
        {/* Header Navigation */}
        <div className="absolute top-8 left-8 flex items-center gap-4 z-50">
           <button onClick={handleBackStep} className="p-2 rounded-full bg-gov-800 text-slate-400 hover:text-white hover:bg-gov-500 transition-colors border border-gov-500">
              <ChevronLeft className="w-6 h-6" />
           </button>
           <div className="text-white">
              <h1 className="text-xl font-bold tracking-tight">VeriFund PH <span className="text-brand-yellow">LGU ACCESS</span></h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-brand-yellow' : 'bg-gov-800'}`}></span>
                REGION
                <span className="w-4 h-px bg-gov-800"></span>
                <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-brand-yellow' : 'bg-gov-800'}`}></span>
                CITY
                <span className="w-4 h-px bg-gov-800"></span>
                <span className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-brand-yellow' : 'bg-gov-800'}`}></span>
                AUTH
              </div>
           </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-center h-auto min-h-[600px]">
           
           {/* Visual Map Side */}
           <div className="w-full md:w-1/2 h-[500px] md:h-[600px] relative flex items-center justify-center overflow-hidden rounded-2xl border border-gov-800 bg-gov-900/50 backdrop-blur-sm shadow-[0_0_30px_rgba(0,56,168,0.2)]">
              <div className="w-full h-full relative">
                <MapContainer
                  center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
                  zoom={DEFAULT_ZOOM}
                  zoomControl={false}
                  style={{ width: '100%', height: '100%', background: '#020617' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <MapController 
                    center={selectedRegion ? selectedRegion.center : DEFAULT_CENTER} 
                    zoom={selectedRegion ? selectedRegion.zoom : DEFAULT_ZOOM} 
                  />
                  {REGIONS.map(region => (
                    <Marker 
                      key={region.id} 
                      position={[region.center.lat, region.center.lng]}
                      icon={customIcon(selectedRegion?.id === region.id || !selectedRegion)}
                      eventHandlers={{
                        click: () => handleRegionClick(region.id)
                      }}
                    />
                  ))}
                </MapContainer>

                {step === 1 && (
                  <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center pointer-events-none z-[1000]">
                     <div className="bg-gov-900/90 backdrop-blur px-6 py-3 rounded-full border border-brand-yellow/50 text-brand-yellow font-mono text-sm font-bold animate-pulse shadow-[0_0_20px_rgba(252,209,22,0.3)]">
                        CLICK REGION TO INITIALIZE
                     </div>
                  </div>
                )}
              </div>
           </div>

           {/* Interaction Side */}
           <div className="w-full md:w-1/2 max-w-md h-[500px] flex flex-col justify-center">
              
              {/* Step 1: Region Info */}
              {step === 1 && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-3">Regional Command</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">Select the autonomous region or major island group for this deployment unit.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {REGIONS.map(r => (
                            <button 
                                key={r.id}
                                onClick={() => handleRegionClick(r.id)}
                                className="flex items-center justify-between p-5 bg-gov-800 border border-gov-500 rounded-xl hover:border-brand-yellow hover:bg-gov-500/80 transition-all group text-left shadow-lg"
                            >
                                <div>
                                    <div className="text-white font-bold group-hover:text-brand-yellow transition-colors text-lg">{r.name}</div>
                                    <div className="text-xs text-slate-400 font-mono mt-1">STATUS: <span className="text-emerald-400">ONLINE</span></div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                 </div>
              )}

              {/* Step 2: City Input */}
              {step === 2 && selectedRegion && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div>
                        <div className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2 border border-brand-yellow/30 px-2 py-1 rounded inline-block bg-brand-yellow/10">{selectedRegion.name}</div>
                        <h2 className="text-4xl font-bold text-white mb-3">Local Unit Identity</h2>
                        <p className="text-slate-400 text-lg">Specify the LGU (Local Government Unit) city or municipality for data partitioning.</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-4 w-6 h-6 text-slate-500 group-focus-within:text-brand-yellow transition-colors" />
                            <select 
                                value={selectedCity} 
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full bg-gov-800 border border-gov-500 text-white pl-14 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none appearance-none text-lg font-medium cursor-pointer hover:bg-gov-500 transition-colors shadow-xl"
                            >
                                <option value="" disabled>Select Municipality / City</option>
                                {selectedRegion.sub.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-5 w-2 h-2 bg-brand-yellow rounded-full animate-pulse"></div>
                        </div>

                        {selectedCity && (
                            <div className="bg-gov-800/50 p-5 rounded-xl border border-gov-500 animate-in fade-in slide-in-from-bottom-2">
                               <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs text-slate-400 uppercase font-bold">Estimated Beneficiaries</span>
                                  <span className="text-white font-mono font-bold text-lg">~14,200</span>
                               </div>
                               <div className="w-full bg-gov-900 h-2 rounded-full overflow-hidden">
                                  <div className="bg-brand-red w-[65%] h-full relative">
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20"></div>
                                  </div>
                               </div>
                            </div>
                        )}

                        <button 
                           onClick={handleCitySubmit}
                           disabled={!selectedCity}
                           className="w-full py-5 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-brand-blue/20"
                        >
                           Confirm Location
                           <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                 </div>
              )}

              {/* Step 3: Admin Auth */}
              {step === 3 && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gov-800 rounded-3xl flex items-center justify-center text-brand-yellow mb-6 border border-gov-500 shadow-2xl shadow-brand-yellow/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-brand-yellow/5 animate-pulse"></div>
                            <Lock className="w-10 h-10 relative z-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Security Clearance</h2>
                        <p className="text-slate-400">Enter your Field Commander access code to unlock the main console.</p>
                    </div>

                    <div className="bg-gov-800/50 p-8 rounded-3xl border border-gov-500 space-y-6 shadow-2xl">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Access Code</label>
                            <input 
                                type="password" 
                                value={adminCode}
                                onChange={(e) => setAdminCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                                className="w-full bg-gov-900 border border-gov-500 text-white text-center text-3xl font-mono tracking-[0.5em] py-5 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition-all placeholder-slate-600"
                                placeholder="••••"
                                maxLength={8}
                            />
                        </div>

                        {error && (
                            <div className="text-brand-red text-xs font-bold text-center bg-brand-red/10 py-3 rounded-lg border border-brand-red/20 animate-pulse flex items-center justify-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-mono bg-gov-900/50 inline-block px-3 py-1 rounded">HINT: USE CODE "ADMIN"</p>
                        </div>

                        <button 
                           onClick={handleAdminAuth}
                           disabled={isVerifying || !adminCode}
                           className="w-full py-5 bg-brand-yellow text-gov-900 rounded-xl font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                           {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                           AUTHENTICATE
                        </button>
                    </div>
                 </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
};

export default LocationSelector;