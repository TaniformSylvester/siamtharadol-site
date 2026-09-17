import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { hotel } from "@/content/hotel";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://siamtharadol.com"),
  title: {
    default: `${hotel.fullName} | Boutique Hotel in Bangkok`,
    template: `%s | ${hotel.fullName}`,
  },
  description:
    "Siam Tharadol Hotel is a boutique hotel on Sukhumvit 97/1, Bangkok, with an infinity-edge pool, in-house Thai dining, and a free shuttle to BTS Bang Chak.",
  openGraph: {
    type: "website",
    siteName: hotel.fullName,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: hotel.fullName,
    image: "https://siamtharadol.com/media/hero/exterior-facade-dusk.jpg",
    telephone: hotel.phone.primary,
    email: hotel.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address.line1,
      addressLocality: "Bangkok",
      addressRegion: "Phrakhanong",
      postalCode: "10260",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    },
    sameAs: Object.values(hotel.social),
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="h-full bg-ivory text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
