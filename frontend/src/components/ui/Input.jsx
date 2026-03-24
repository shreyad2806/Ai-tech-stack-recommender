import React from 'react';

export const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = 'flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm text-text-primary placeholder-text-tertiary transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorClasses = error ? 'border-pink-500 focus:ring-pink-500/50' : 'border-border';
  
  return (
    <input
      type={type}
      className={`${baseClasses} ${errorClasses} ${className}`}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = 'Input';
