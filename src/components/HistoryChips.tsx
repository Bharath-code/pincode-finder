import { Clock } from 'lucide-react';

interface HistoryChipsProps {
    history: string[];
    onSelect: (query: string) => void;
    onClear: () => void;
}

export function HistoryChips({ history, onSelect, onClear }: HistoryChipsProps) {
    if (history.length === 0) return null;

    return (
        <div className="mt-6 border-t-2 border-dashed border-black/20 pt-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent Memory
                </h2>
                <button 
                    onClick={onClear}
                    aria-label="Clear all search history"
                    className="text-[10px] font-mono uppercase hover:text-destructive transition-colors"
                >
                    Clear All
                </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {history.map((item, idx) => (
                    <button
                        key={`${item}-${idx}`}
                        onClick={() => onSelect(item)}
                        className="bg-white border border-black px-3 py-1 text-sm font-mono hover:bg-black hover:text-white transition-colors flex items-center gap-2 group"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}
