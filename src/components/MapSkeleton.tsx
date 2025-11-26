import { Globe2 } from 'lucide-react';

export function MapSkeleton() {
    return (
        <div className="h-full w-full bg-secondary/30 flex flex-col items-center justify-center animate-pulse relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10" 
                style={{ 
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }} 
            />
            
            <Globe2 className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <div className="font-display text-xl text-muted-foreground tracking-widest opacity-50">
                LOADING MAP...
            </div>
            
            {/* Swiss overlay mock */}
            <div className="absolute top-4 right-4 bg-white/50 p-2 border-2 border-black/10 w-32 h-12" />
        </div>
    );
}
