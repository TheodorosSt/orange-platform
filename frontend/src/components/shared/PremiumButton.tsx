import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function PremiumButton({
  children,
  variant = 'gold',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: PremiumButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    gold: 'btn-premium text-bg-primary',
    outline: 'border border-gold text-gold hover:bg-gold/10 rounded-lg transition-colors',
    ghost: 'text-gold hover:bg-gold/10 rounded-lg transition-colors',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`font-sans font-semibold transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
