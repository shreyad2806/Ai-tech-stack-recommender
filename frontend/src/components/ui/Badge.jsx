import React from 'react';

const badgeVariants = {
  default: 'bg-surface text-text-primary border border-border',
  primary: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  secondary: 'bg-surface text-text-secondary border border-border',
  green: 'bg-green-500/20 text-green-300 border border-green-500/30',
  pink: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  outline: 'border border-border text-text-primary',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const Badge = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'md',
  children,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors duration-400';
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  const sizeClasses = badgeSizes[size] || badgeSizes.md;
  
  return (
    <span
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
