import { Info } from 'lucide-react';

export function GoogleAdsense() {
    return (
        <div className="mt-6 p-4 border-2 border-black/10 bg-secondary/50 text-muted-foreground font-mono text-xs text-center flex flex-col items-center justify-center h-32">
            <Info className="w-4 h-4 mb-2" />
            <p>ADVERTISEMENT</p>
            <p className="mt-1">(Your Google AdSense code will go here)</p>
            {/* <!-- Placeholder for AdSense unit -->
            {/*
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="YYYYYYYYYY"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
            */}
        </div>
    );
}
