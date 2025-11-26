import { Filter } from 'lucide-react';

interface FilterBarProps {
    states: string[];
    districts: string[];
    selectedState: string;
    selectedDistrict: string;
    onStateChange: (state: string) => void;
    onDistrictChange: (district: string) => void;
}

export function FilterBar({ 
    states, 
    districts, 
    selectedState, 
    selectedDistrict, 
    onStateChange, 
    onDistrictChange 
}: FilterBarProps) {
    
    if (states.length <= 1 && districts.length <= 1) return null;

    return (
        <div className="flex gap-2 p-3 border-y border-black bg-white sticky top-0 z-20 overflow-x-auto scrollbar-hide">
            <div className="flex items-center px-2 pointer-events-none">
                <Filter className="w-4 h-4" />
            </div>
            
            <div className="relative group min-w-[140px]">
                <select 
                    value={selectedState}
                    onChange={(e) => onStateChange(e.target.value)}
                    className="w-full appearance-none bg-transparent border border-black px-3 py-2 pr-8 text-xs font-bold font-mono uppercase cursor-pointer hover:bg-black hover:text-white transition-colors rounded-none focus:outline-none"
                >
                    <option value="" className="bg-white text-black">All States</option>
                    {states.map(state => (
                        <option key={state} value={state} className="bg-white text-black">{state}</option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">▼</div>
            </div>

            <div className="relative group min-w-[140px]">
                <select 
                    value={selectedDistrict}
                    onChange={(e) => onDistrictChange(e.target.value)}
                    disabled={!selectedState && districts.length > 20} // Disable if too many districts and no state selected (optional UX choice, but let's keep it simple)
                    className="w-full appearance-none bg-transparent border border-black px-3 py-2 pr-8 text-xs font-bold font-mono uppercase cursor-pointer hover:bg-black hover:text-white transition-colors rounded-none focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <option value="" className="bg-white text-black">All Districts</option>
                    {districts.map(district => (
                        <option key={district} value={district} className="bg-white text-black">{district}</option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">▼</div>
            </div>
        </div>
    );
}
