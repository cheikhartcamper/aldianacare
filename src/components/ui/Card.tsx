import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, padding = 'md', onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' } : undefined}
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        ${paddings[padding]}
        ${hover ? 'cursor-pointer transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
