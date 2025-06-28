import React from 'react';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardSize = 'small' | 'medium' | 'large';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  size = 'medium',
  className = '',
  hoverable = false,
  clickable = false,
  onClick,
  header,
  footer
}) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const variantClasses = {
    elevated: 'bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300',
    outlined: 'bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200',
    filled: 'bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200'
  };

  const hoverClasses = hoverable ? 'hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out' : '';
  const clickableClasses = clickable ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : '';

  return (
    <div
      className={`
        rounded-xl overflow-hidden backdrop-blur-sm
        ${variantClasses[variant]}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
    >
      {header && (
        <div className="border-b border-gray-200/80 p-4 bg-gradient-to-r from-gray-50/50 to-white/50">
          {header}
        </div>
      )}
      
      <div className={sizeClasses[size]}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200/80 p-4 bg-gradient-to-r from-gray-50/50 to-white/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
