import type { PostOffice } from '@/types';
import { Building2 } from 'lucide-react';

interface ResultListProps {
    results: PostOffice[];
    onSelect: (item: PostOffice) => void;
    selectedItem: PostOffice | null;
}

export function ResultList({ results, onSelect, selectedItem }: ResultListProps) {
    return (
        <div className="grid grid-cols-1 gap-0 border-t-2 border-black w-full">
            {results.map((po, idx) => {
                const isSelected = selectedItem === po;
                return (
                    <div 
                        key={`${po.Name}-${idx}`}
                        onClick={() => onSelect(po)}
                        className={`
                            group p-4 sm:p-6 cursor-pointer transition-all relative border-b border-border hover:bg-secondary/50
                            ${isSelected ? 'bg-secondary border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
                        `}
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="w-full">
                                <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-primary transition-colors font-display tracking-tight break-words">
                                    {po.Name}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground font-mono mb-4">
                                    {po.District}, {po.State}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm font-mono opacity-70 group-hover:opacity-100 transition-opacity">
                                    <div className="truncate">TYPE: {po.BranchType}</div>
                                    <div className="truncate">CIRCLE: {po.Circle}</div>
                                    <div className="truncate">
                                        DELIVERY: 
                                        <span className={po.DeliveryStatus === 'Delivery' ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                            {po.DeliveryStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Building2 className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
