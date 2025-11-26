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
        <form onSubmit={handleSubmit} className="w-full max-w-3xl relative group mx-auto flex gap-2">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Pincode (e.g. 560001) or Branch Name..."
                    className="w-full p-8 pl-16 text-2xl bg-white border-b-4 border-black focus:border-primary outline-none transition-all font-display placeholder:font-sans placeholder:text-muted-foreground placeholder:text-xl"
                    disabled={loading}
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="absolute right-4 top-4 bottom-4 px-8 bg-black text-white font-bold hover:bg-primary disabled:opacity-50 transition-all text-sm tracking-widest"
                >
                    {loading ? 'LOCATING...' : 'SEARCH'}
                </button>
            </div>
            
            {/* GPS Button - Swiss Style Block */}
            <button
                type="button"
                onClick={onLocate}
                disabled={loading}
                className="bg-white border-b-4 border-black aspect-square h-auto flex items-center justify-center hover:bg-primary hover:text-white transition-colors group/gps relative"
                title="Locate Me"
            >
                <Crosshair className="w-8 h-8" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover/gps:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-mono">
                    USE GPS
                </span>
            </button>
        </form>
    );
}
