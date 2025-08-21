import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google'; // Importiamo un font pulito e moderno
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

// Configurazione del font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CVLuoghi',
    template: '%s | I Miei Viaggi',
  },
  description: 'Una collezione personale dei luoghi che ho visitato, dalle meraviglie storiche ai tesori naturali',
  keywords: ['viaggi', 'turismo', 'luoghi', 'musei', 'castelli', 'parchi', 'italia'],
  authors: [{ name: 'Il Tuo Nome' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'I Miei Viaggi | Portfolio Luoghi Visitati',
    description: 'Una collezione personale dei luoghi che ho visitato',
    siteName: 'I Miei Viaggi',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea', // Un colore coerente con il design
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-gray-50 text-gray-800 antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}