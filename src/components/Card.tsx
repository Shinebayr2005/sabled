import React from 'react';

export type CardVariant = 'flat' | 'faded' | 'bordered' | 'shadow';
export type CardSize = 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  radius?: CardRadius;
  className?: string;
  isHoverable?: boolean;
  isPressable?: boolean;
  isBlurred?: boolean;
  isFooterBlurred?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disableAnimation?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'flat',
  size = 'md',
  radius = 'lg',
  className = '',
  isHoverable = false,
  isPressable = false,
  isBlurred = false,
  isFooterBlurred = false,
  onClick,
  header,
  footer,
  shadow = 'sm',
  fullWidth = false,
  disableAnimation = false,
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const variantClasses = {
    flat: 'bg-white border border-gray-200',
    faded: 'bg-white/70 border border-gray-200 backdrop-blur-md',
    bordered: 'bg-transparent border-2 border-gray-200',
    shadow: 'bg-white border border-gray-200'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const hoverClasses = isHoverable && !disableAnimation 
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' 
    : '';
    
  const pressableClasses = isPressable 
    ? 'cursor-pointer active:scale-[0.97] transition-transform duration-150' 
    : '';

  const blurClasses = isBlurred ? 'backdrop-blur-md bg-white/70' : '';

  return (
    <div
      className={`
        overflow-hidden
        ${fullWidth ? 'w-full' : ''}
        ${radiusClasses[radius]}
        ${variantClasses[variant]}
        ${variant === 'shadow' ? shadowClasses[shadow] : ''}
        ${hoverClasses}
        ${pressableClasses}
        ${blurClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      onClick={isPressable ? onClick : undefined}
    >
      {header && (
        <div className={`border-b border-gray-200/80 px-4 py-3 ${isFooterBlurred ? 'backdrop-blur-md bg-white/70' : 'bg-gray-50/50'}`}>
          {header}
        </div>
      )}
      
      <div className={sizeClasses[size]}>
        {children}
      </div>
      
      {footer && (
        <div className={`border-t border-gray-200/80 px-4 py-3 ${isFooterBlurred ? 'backdrop-blur-md bg-white/70' : 'bg-gray-50/50'}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
