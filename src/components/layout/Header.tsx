// src/components/layout/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
          Portfolio Luoghi
        </Link>
      </div>
    </header>
  );
}