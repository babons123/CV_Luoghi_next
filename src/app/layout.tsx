// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'; // Importa Viewport
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

// L'oggetto Metadata principale
export const metadata: Metadata = {
  title: {
    default: 'I Miei Viaggi | Portfolio Luoghi Visitati',
    template: '%s | I Miei Viaggi', // Utile per i titoli delle pagine interne
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

// Il nuovo oggetto Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-gray-50 text-gray-800"> {/* Aggiunto stile di base */}
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