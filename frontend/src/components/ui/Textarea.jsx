import React from 'react';

export const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  disabled = false,
  rows = 4,
  ...props 
}, ref) => {
  const baseClasses = 'flex min-h-[80px] w-full rounded-xl border bg-card px-3 py-2 text-sm text-text-primary placeholder-text-tertiary transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none';
  
  const errorClasses = error ? 'border-pink-500 focus:ring-pink-500/50' : 'border-border';
  
  return (
    <textarea
      className={`${baseClasses} ${errorClasses} ${className}`}
      ref={ref}
      disabled={disabled}
      rows={rows}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
