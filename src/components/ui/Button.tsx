import type { ReactNode, MouseEventHandler } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg',
  secondary: 'bg-surface-secondary text-gray-700 hover:bg-surface-tertiary border border-gray-200',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger: 'bg-danger text-white hover:bg-red-600 shadow-md',
  gold: 'bg-gold text-gray-900 hover:bg-gold-light shadow-md',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
