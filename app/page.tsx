"use client";

import { useState, useEffect, useMemo } from 'react';
import { getPincodeDetails, getPostOfficeDetails, getCoordinates, getPincodeFromCoordinates } from '@/api/postal';
import type { PostOffice } from '@/types';
// Dynamically import client-side components
import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/MapSkeleton';

const SearchBar = dynamic(() => import('@/components/SearchBar').then(mod => mod.SearchBar), { ssr: false });
const ResultList = dynamic(() => import('@/components/ResultList').then(mod => mod.ResultList), { ssr: false });
const MapView = dynamic(() => import('@/components/MapView').then(mod => mod.MapView), { 
    ssr: false,
    loading: () => <MapSkeleton />
});
const HistoryChips = dynamic(() => import('@/components/HistoryChips').then(mod => mod.HistoryChips), { ssr: false });
const FilterBar = dynamic(() => import('@/components/FilterBar').then(mod => mod.FilterBar), { ssr: false });
const CourierEstimates = dynamic(() => import('@/components/CourierEstimates').then(mod => mod.CourierEstimates), { ssr: false });
const HolidayCalendar = dynamic(() => import('@/components/HolidayCalendar').then(mod => mod.HolidayCalendar), { ssr: false });
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense').then(mod => mod.GoogleAdsense), { ssr: false });

import { checkIsOpen } from '@/components/HolidayCalendar'; // checkIsOpen is a pure function, can be imported directly
import { Globe2, Info, Copy, Check, Navigation } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const HISTORY_KEY = 'pincode_finder_history';
const MAX_HISTORY = 8;

// Haversine Formula for Distance Calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export default function Page() { // Changed function name
  const [results, setResults] = useState<PostOffice[]>([]);
  const [selectedItem, setSelectedItem] = useState<PostOffice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  
  // Filtering State
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Locations
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
  // Default to Center of India approx
  const [location, setLocation] = useState({ lat: 20.5937, lon: 78.9629, displayName: 'India' });

  const searchParams = useSearchParams(); // Hook for URL params
  const router = useRouter(); // Hook for URL navigation

  // Computed Filters
  const availableStates = useMemo(() => {
      const states = new Set(results.map(r => r.State));
      return Array.from(states).sort();
  }, [results]);

  const availableDistricts = useMemo(() => {
      let filtered = results;
      if (selectedState) {
          filtered = results.filter(r => r.State === selectedState);
      }
      const districts = new Set(filtered.map(r => r.District));
      return Array.from(districts).sort();
  }, [results, selectedState]);

  const filteredResults = useMemo(() => {
      return results.filter(item => {
          if (selectedState && item.State !== selectedState) return false;
          if (selectedDistrict && item.District !== selectedDistrict) return false;
          return true;
      });
  }, [results, selectedState, selectedDistrict]);

  const distanceToTarget = useMemo(() => {
      if (!userLocation || !location) return null;
      // Don't show distance if we are looking at the user's own location (approx check)
      if (Math.abs(userLocation.lat - location.lat) < 0.001 && Math.abs(userLocation.lon - location.lon) < 0.001) {
          return null;
      }
      return calculateDistance(userLocation.lat, userLocation.lon, location.lat, location.lon).toFixed(1);
  }, [userLocation, location]);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Check URL Params for deep linking on mount
    // We only want to run this ONCE on mount, or if the user navigates backwards/forwards
    // NOT every time the component re-renders or router updates
    const query = searchParams.get('q');
    if (query && query !== lastSearchQuery) {
        handleSearch(query, false); // Pass false to avoid pushing URL again
    }
  }, []); // Empty dependency array to run only on mount

  // Separate effect to handle back/forward navigation if needed, but for now simple mount check is safer against loops
  
  useEffect(() => {
    if (copied) {
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [copied]);

  const saveHistory = (query: string) => {
    setHistory(prev => {
      // Remove duplicate if exists, add to front, slice to max
      const filtered = prev.filter(item => item !== query);
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleSearch = async (query: string, updateUrl = true) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedItem(null);
    setLastSearchQuery(query);
    
    // Update URL using Next.js router ONLY if requested
    if (updateUrl) {
        router.push(`/?q=${encodeURIComponent(query)}`, { scroll: false });
    }

    // Reset filters on new search
    setSelectedState('');
    setSelectedDistrict('');

    try {
      const isPincode = /^\d{6}$/.test(query);
      const response = isPincode 
        ? await getPincodeDetails(query) 
        : await getPostOfficeDetails(query);

      if (response.Status === "Success" && response.PostOffice) {
        setResults(response.PostOffice);
        saveHistory(query); // Save successful search
        
        // Auto-select first item
        if (response.PostOffice.length > 0) {
            handleSelect(response.PostOffice[0], isPincode ? query : undefined);
        }
      } else {
        setError(response.Message || "No records found.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocateMe = () => {
      if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser.");
          return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Store User Location
          setUserLocation({ lat: latitude, lon: longitude });

          // 1. Update map immediately
          setLocation({
              lat: latitude,
              lon: longitude,
              displayName: "Current Location"
          });

          // 2. Reverse Geocode to find Pincode
          const pincode = await getPincodeFromCoordinates(latitude, longitude);
          
          if (pincode) {
              // Clean pincode (remove whitespace)
              const cleanPincode = pincode.replace(/\s/g, '');
              // Trigger search
              handleSearch(cleanPincode); // Use handleSearch to update URL
          } else {
              setLoading(false);
              setError("Could not determine Pincode for this location.");
          }
      }, (err) => {
          console.error(err);
          setLoading(false);
          setError("Unable to retrieve your location. Please enable permissions.");
      });
  };

  const handleSelect = async (item: PostOffice, pincodeOverride?: string) => {
    setSelectedItem(item);
    setCopied(false); // Reset copy state on new selection
    
    const pincode = item.Pincode || pincodeOverride || ( /^\d{6}$/.test(lastSearchQuery) ? lastSearchQuery : '');
    
    // Strategy:
    // 1. Try precise Pincode query first (most accurate for general area)
    // 2. Try Name + District + State
    // 3. Fallback to District + State
    
    let geo = null;

    if (pincode) {
        geo = await getCoordinates(`${pincode}, India`);
    }

    if (!geo) {
        const query = `${item.Name} Post Office, ${item.District}, ${item.State}, India`;
        geo = await getCoordinates(query);
    }
    
    if (!geo) {
        geo = await getCoordinates(`${item.District}, ${item.State}, India`);
    }

    if (geo) {
        setLocation({
            lat: parseFloat(geo.lat),
            lon: parseFloat(geo.lon),
            displayName: geo.display_name
        });
    }
  };

  // Determine display pincode for the selected item
  const getDisplayPincode = () => {
      if (!selectedItem) return '';
      if (selectedItem.Pincode) return selectedItem.Pincode;
      if (/^\d{6}$/.test(lastSearchQuery)) return lastSearchQuery;
      return 'N/A';
  }

  const handleCopyAddress = () => {
      if (!selectedItem) return;
      const pincode = getDisplayPincode();
      const address = `${selectedItem.Name} (${selectedItem.BranchType})\n${selectedItem.District}, ${selectedItem.State} - ${pincode}\nIndia`;
      
      navigator.clipboard.writeText(address);
      setCopied(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="border-b-4 border-black p-6 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <Globe2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black tracking-tighter font-display">
                PINCODE<span className="text-primary">FINDER</span>
            </h1>
        </div>
        <div className="font-mono text-xs hidden sm:block text-right leading-tight">
            POSTAL INDEX NUMBER SERVICE<br/>
            INDIA POST DATA ACCESS
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:h-[calc(100vh-88px)]">
        
        {/* Left Panel: Search & Results */}
        <div className="w-full lg:w-1/2 flex flex-col border-r-0 lg:border-r-4 border-black bg-white relative z-10">
            <div className="p-4 sm:p-8 bg-secondary/30 shrink-0">
                <SearchBar onSearch={handleSearch} onLocate={handleLocateMe} loading={loading} />
                
                <HistoryChips 
                    history={history} 
                    onSelect={handleSearch} 
                    onClear={clearHistory} 
                />
                
                <GoogleAdsense />

                {error && (
                    <div className="mt-6 p-4 border-2 border-destructive bg-destructive/5 text-destructive font-bold flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </div>

            {/* Results Area - Scrolls window on mobile, internal on desktop */}
            <div className="flex-1 lg:overflow-y-auto min-h-[300px]">
                {results.length > 0 ? (
                    <>
                        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 border-y border-black bg-black text-white font-bold font-mono text-sm flex justify-between items-center">
                            <span>RESULTS: {filteredResults.length}</span>
                            <span className="text-xs opacity-70">SELECT TO LOCATE</span>
                        </div>
                        
                        {/* Filter Bar */}
                        <FilterBar 
                            states={availableStates}
                            districts={availableDistricts}
                            selectedState={selectedState}
                            selectedDistrict={selectedDistrict}
                            onStateChange={(state) => {
                                setSelectedState(state);
                                setSelectedDistrict(''); // Reset district when state changes
                            }}
                            onDistrictChange={setSelectedDistrict}
                        />

                        <ResultList 
                            results={filteredResults} 
                            onSelect={(item) => handleSelect(item)} 
                            selectedItem={selectedItem} 
                        />
                    </>
                ) : (
                    !loading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-50">
                            <Globe2 className="w-24 h-24 mb-4 text-black" />
                            <p className="font-display text-2xl text-black">ENTER DATA</p>
                            <p className="font-mono mt-2 text-sm">Search by 6-digit Pincode or Branch Name.</p>
                        </div>
                    )
                )}
            </div>
        </div>

        {/* Right Panel: Map */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-auto border-t-4 lg:border-t-0 border-black relative z-0">
            <MapView lat={location.lat} lon={location.lon} displayName={location.displayName} />
            
            {/* Map Overlay Info */}
            {selectedItem && (
                 <div className="absolute bottom-4 left-4 right-4 lg:left-8 lg:right-auto lg:w-80 bg-white/95 backdrop-blur-sm p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[400]">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-bold text-xl font-display leading-none">{selectedItem.Name}</h2>
                        <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-none">
                            {selectedItem.BranchType}
                        </div>
                    </div>
                    
                    {distanceToTarget && (
                        <div className="flex items-center gap-2 my-3 text-primary font-bold font-mono text-sm">
                            <Navigation className="w-4 h-4 fill-current" />
                            {distanceToTarget} KM AWAY
                        </div>
                    )}
                    
                    <div className="space-y-2 text-sm font-mono border-t-2 border-black/10 pt-2 mt-2 mb-4">
                        <div className="flex justify-between">
                            <span className="opacity-60">PINCODE</span>
                            <span className="font-bold">{getDisplayPincode()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-60">DISTRICT</span>
                            <span className="font-bold text-right">{selectedItem.District}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="opacity-60">STATE</span>
                            <span className="font-bold">{selectedItem.State}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-60">STATUS</span>
                            <span className={selectedItem.DeliveryStatus === 'Delivery' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {selectedItem.DeliveryStatus}
                            </span>
                        </div>
                    </div>

                    <HolidayCalendar isOpen={checkIsOpen()} />

                    <button 
                        onClick={handleCopyAddress}
                        className={`
                            w-full mt-4 py-3 font-bold text-sm tracking-widest flex items-center justify-center gap-2 border-2 border-black transition-all
                            ${copied ? 'bg-green-500 text-white border-green-700' : 'bg-white hover:bg-black hover:text-white text-black'}
                        `}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'ADDRESS COPIED' : 'COPY ADDRESS'}
                    </button>

                    {distanceToTarget && (
                        <CourierEstimates distanceKm={parseFloat(distanceToTarget)} />
                    )}
                 </div>
            )}
        </div>
      </main>
    </div>
  );
}
