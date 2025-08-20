// src/app/layout.tsx
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'I Miei Viaggi | Portfolio Luoghi Visitati',
  description: 'Una collezione personale dei luoghi che ho visitato, dalle meraviglie storiche ai tesori naturali',
  keywords: ['viaggi', 'turismo', 'luoghi', 'musei', 'castelli', 'parchi', 'italia'],
  authors: [{ name: 'Il Tuo Nome' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#667eea',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'I Miei Viaggi | Portfolio Luoghi Visitati',
    description: 'Una collezione personale dei luoghi che ho visitato',
    siteName: 'I Miei Viaggi',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <div className="app-container">
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}