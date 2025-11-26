import { Search, Crosshair } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onLocate: () => void;
    loading: boolean;
}

export function SearchBar({ onSearch, onLocate, loading }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Pincode or Branch..."
                    className="w-full h-12 sm:h-14 pl-12 pr-4 text-lg bg-white border-2 border-black focus:border-primary outline-none transition-all font-display placeholder:font-sans placeholder:text-muted-foreground placeholder:text-base rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px]"
                    disabled={loading}
                />
            </div>
            
            <div className="flex gap-3 sm:gap-4 h-12 sm:h-14">
                <button 
                    type="submit"
                    disabled={loading}
                    aria-label={loading ? 'Searching' : 'Search Pincode or Branch Name'}
                    className="flex-1 sm:flex-none px-6 bg-black text-white font-bold hover:bg-primary disabled:opacity-50 transition-all text-sm tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none"
                >
                    {loading ? '...' : 'SEARCH'}
                </button>

                <button
                    type="button"
                    onClick={onLocate}
                    disabled={loading}
                    aria-label="Use GPS Location" // Added accessibility label
                    className="aspect-square h-full flex items-center justify-center bg-white border-2 border-black hover:bg-primary hover:text-white transition-all group/gps relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px]"
                    title="Locate Me"
                >
                    <Crosshair className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
}
