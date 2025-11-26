import { Bike, Truck, Package, ExternalLink } from 'lucide-react';

interface CourierEstimatesProps {
    distanceKm: number;
}

export function CourierEstimates({ distanceKm }: CourierEstimatesProps) {
    // Pricing Models (Approximate Indian Market Rates)
    // These are static estimates for demo purposes. In a real app, these would be API calls.
    const services = [
        {
            name: 'Bike Delivery',
            provider: 'Instant App', // Generic name for Borzo/Dunzo
            icon: Bike,
            price: Math.round(40 + (distanceKm * 14)), // Base 40 + 14/km
            time: Math.round(30 + (distanceKm * 3)), // 30min prep + 3min/km
            color: 'text-green-600',
            link: 'https://borzodelivery.com/in' 
        },
        {
            name: 'Mini Truck',
            provider: 'Porter',
            icon: Truck,
            price: Math.round(200 + (distanceKm * 22)), // Base 200 + 22/km
            time: Math.round(60 + (distanceKm * 4)),
            color: 'text-blue-600',
            link: 'https://porter.in/'
        },
        {
            name: 'Speed Post',
            provider: 'India Post',
            icon: Package,
            price: 45, // Flat rate estimate for local/intra-city
            time: 2880, // 2 days (in minutes)
            color: 'text-red-600',
            link: 'https://www.indiapost.gov.in/'
        }
    ];

    // Format duration
    const formatTime = (mins: number) => {
        if (mins >= 1440) return `${Math.round(mins/1440)} Days`;
        if (mins >= 60) return `${Math.floor(mins/60)}h ${mins%60}m`;
        return `${mins} Mins`;
    };

    return (
        <div className="mt-4 pt-4 border-t-2 border-black/10">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest mb-3 flex justify-between items-center">
                <span>Est. Shipping Cost</span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    FOR {distanceKm} KM
                </span>
            </h3>
            
            <div className="space-y-2">
                {services.map((service, idx) => (
                    <a 
                        key={idx} 
                        href={service.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 hover:bg-secondary transition-colors group border border-transparent hover:border-black/5 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-secondary/50 rounded-full ${service.color}`}>
                                <service.icon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="font-bold text-sm leading-none">{service.provider}</div>
                                <div className="text-[10px] text-muted-foreground font-mono mt-1">
                                    ~ {formatTime(service.time)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold font-display text-lg leading-none">₹{service.price}</div>
                            <div className="text-[10px] font-bold text-primary flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                BOOK <ExternalLink className="w-2 h-2" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            <div className="text-[9px] text-center text-muted-foreground mt-2 font-mono">
                *Prices are approximate estimates.
            </div>
        </div>
    );
}
