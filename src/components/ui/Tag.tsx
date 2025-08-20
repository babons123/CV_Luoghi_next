// src/components/ui/Tag.tsx
import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className = '' }: TagProps) {
  const baseClasses = 
    'bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full';
  
  return (
    <span className={`${baseClasses} ${className}`}>
      {children}
    </span>
  );
}