// app/pincode/[code]/page.tsx
import { getPincodeDetails } from '@/api/postal';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

// This is a Server Component. It fetches data and renders.
export async function generateStaticParams() {
  // For demonstration, use a few common Indian pincodes
  // In a real application, you would fetch these from a database or a file
  const popularPincodes = [
    '110001', // Delhi
    '400001', // Mumbai
    '700001', // Kolkata
    '600001', // Chennai
    '560001', // Bengaluru
    '302001', // Jaipur
    '380001', // Ahmedabad
    '500001', // Hyderabad
    '208001', // Kanpur
    '411001', // Pune
  ];

  return popularPincodes.map((code) => ({
    code: code,
  }));
}

// Generate dynamic metadata for each pincode page
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code: pincode } = await params;
  const response = await getPincodeDetails(pincode);

  if (response.Status === "Success" && response.PostOffice && response.PostOffice.length > 0) {
    const po = response.PostOffice[0];
    const title = `${po.Name} (${pincode}) - Pincode Finder India`;
    const description = `Find details for Post Office ${po.Name} in ${po.District}, ${po.State}, with Pincode ${pincode}. Branch Type: ${po.BranchType}, Delivery Status: ${po.DeliveryStatus}.`;
    
    return {
      title: title,
      description: description,
      keywords: `pincode ${pincode}, ${po.Name}, ${po.District}, ${po.State}, india post, post office details`,
      openGraph: {
        title: title,
        description: description,
        siteName: 'Pincode Finder India',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
      },
    };
  }

  return {
    title: `Pincode ${pincode} - Details Not Found | Pincode Finder India`,
    description: `Details for pincode ${pincode} not found. Search for other Indian pincodes and post offices.`,
  };
}

export default async function PincodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: pincode } = await params;

  const response = await getPincodeDetails(pincode);

  if (response.Status === "Error" || !response.PostOffice || response.PostOffice.length === 0) {
    notFound(); // Next.js built-in 404
  }

  const firstPostOffice = response.PostOffice[0];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b-4 border-black p-6 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter font-display">
                PINCODE<span className="text-primary">FINDER</span>
            </h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="container mx-auto p-8 max-w-3xl">
        <h2 className="text-4xl font-display mb-4">{firstPostOffice.Name} ({pincode})</h2>
        <p className="text-lg mb-6">{firstPostOffice.District}, {firstPostOffice.State}, {firstPostOffice.Country}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md font-mono mb-8">
            <div className="bg-secondary p-4 border border-black">
                <p className="font-bold">Branch Type:</p>
                <p>{firstPostOffice.BranchType}</p>
            </div>
            <div className="bg-secondary p-4 border border-black">
                <p className="font-bold">Delivery Status:</p>
                <p>{firstPostOffice.DeliveryStatus}</p>
            </div>
            <div className="bg-secondary p-4 border border-black">
                <p className="font-bold">Circle:</p>
                <p>{firstPostOffice.Circle}</p>
            </div>
            <div className="bg-secondary p-4 border border-black">
                <p className="font-bold">Division:</p>
                <p>{firstPostOffice.Division}</p>
            </div>
        </div>

        <p className="text-muted-foreground text-sm mt-8">
          For interactive map, courier estimates, and more features, visit the main <Link href="/" className="text-primary hover:underline">Pincode Finder app</Link>.
        </p>
      </main>
    </div>
  );
}
