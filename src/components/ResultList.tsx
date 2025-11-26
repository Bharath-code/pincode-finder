import type { PostOffice } from '../types';
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
                            group p-6 cursor-pointer transition-all relative border-b border-border hover:bg-secondary/50
                            ${isSelected ? 'bg-secondary border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
                        `}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors font-display tracking-tight">
                                    {po.Name}
                                </h3>
                                <p className="text-sm text-muted-foreground font-mono mb-4">
                                    {po.District}, {po.State}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono opacity-70 group-hover:opacity-100 transition-opacity">
                                    <div>TYPE: {po.BranchType}</div>
                                    <div>CIRCLE: {po.Circle}</div>
                                    <div>
                                        DELIVERY: 
                                        <span className={po.DeliveryStatus === 'Delivery' ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                            {po.DeliveryStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Building2 className={`w-8 h-8 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
