import { Helmet } from 'react-helmet-async';

interface MetaHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
}

export function MetaHead({ 
    title = "Pincode Finder India - Locate Post Offices & Pincodes", 
    description = "Instantly find All India Pincodes and Post Office details. Search by pincode, branch name, or use GPS to locate your nearest post office. Fast, accurate, and works offline.",
    keywords = "pincode finder, india post, post office search, zip code india, postal code india, find pincode, locate post office, gps pincode"
}: MetaHeadProps) {
    const fullTitle = title.includes("Pincode Finder") ? title : `${title} | Pincode Finder India`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content="Pincode Finder India" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            
            {/* Theme Color (Matches PWA) */}
            <meta name="theme-color" content="#E62020" />
        </Helmet>
    );
}
