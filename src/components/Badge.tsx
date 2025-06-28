import React from 'react';

type BadgeVariant = 'solid' | 'outlined' | 'soft';
type BadgeColor = 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
  rounded?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'solid',
  color = 'default',
  size = 'medium',
  className = '',
  dot = false,
  rounded = false
}) => {
  const sizeClasses = {
    small: dot ? 'w-2 h-2' : 'px-2 py-0.5 text-xs font-semibold',
    medium: dot ? 'w-3 h-3' : 'px-2.5 py-1 text-sm font-semibold',
    large: dot ? 'w-4 h-4' : 'px-3 py-1.5 text-base font-semibold'
  };

  const colorClasses = {
    default: {
      solid: 'bg-gray-600 text-white shadow-sm',
      outlined: 'border border-gray-600 text-gray-600 bg-white shadow-sm',
      soft: 'bg-gray-100 text-gray-700 border border-gray-200'
    },
    primary: {
      solid: 'bg-primary text-white shadow-md',
      outlined: 'border border-primary text-primary bg-white shadow-sm',
      soft: 'bg-primary/10 text-primary border border-primary/20'
    },
    danger: {
      solid: 'bg-red-500 text-white shadow-md',
      outlined: 'border border-red-500 text-red-500 bg-white shadow-sm',
      soft: 'bg-red-50 text-red-700 border border-red-200'
    },
    success: {
      solid: 'bg-green-500 text-white shadow-md',
      outlined: 'border border-green-500 text-green-500 bg-white shadow-sm',
      soft: 'bg-green-50 text-green-700 border border-green-200'
    },
    warning: {
      solid: 'bg-yellow-500 text-white shadow-md',
      outlined: 'border border-yellow-500 text-yellow-600 bg-white shadow-sm',
      soft: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    },
    info: {
      solid: 'bg-blue-500 text-white shadow-md',
      outlined: 'border border-blue-500 text-blue-500 bg-white shadow-sm',
      soft: 'bg-blue-50 text-blue-700 border border-blue-200'
    }
  };

  const baseClasses = dot 
    ? 'inline-block rounded-full animate-pulse' 
    : 'inline-flex items-center justify-center font-medium transition-all duration-200 hover:scale-105';

  const roundedClasses = dot ? '' : (rounded ? 'rounded-full' : 'rounded-md');

  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${colorClasses[color][variant]}
        ${roundedClasses}
        ${className}
      `}
    >
      {!dot && children}
    </span>
  );
};

export default Badge;
