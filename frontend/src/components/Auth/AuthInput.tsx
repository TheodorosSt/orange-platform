import type { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, className = '', ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-text-secondary text-sm font-sans">{label}</label>
      <input
        className={`input-premium ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
