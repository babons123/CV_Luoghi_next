// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const baseClasses =
    'bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out';
  const hoverClasses = onClick ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}