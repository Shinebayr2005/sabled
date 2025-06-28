import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarVariant = 'circular' | 'rounded' | 'square';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  fallback?: string;
  className?: string;
  onClick?: () => void;
  status?: 'online' | 'offline' | 'away' | 'busy';
  badge?: React.ReactNode;
  loading?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  variant = 'circular',
  fallback,
  className = '',
  onClick,
  status,
  badge,
  loading = false
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
          ${loading ? 'animate-pulse bg-gray-300' : 'bg-gradient-to-br from-primary/20 to-primary/40'}
          flex items-center justify-center font-semibold text-gray-700
          transition-all duration-200 ease-in-out
          shadow-lg hover:shadow-xl
          border-2 border-white
          ${className}
        `}
        onClick={onClick}
      >
        {!loading && (
          <>
            {src && (
              <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${variantClasses[variant]}`}
                onError={handleImageError}
              />
            )}
            
            {!src && fallback && (
              <span className="text-gray-600 font-bold select-none">
                {getInitials(fallback)}
              </span>
            )}
            
            {!src && !fallback && (
              <svg className="w-2/3 h-2/3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <div
          className={`
            absolute bottom-0 right-0 ${statusSizes[size]} ${statusClasses[status]}
            border-2 border-white rounded-full
          `}
        />
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute -top-1 -right-1">
          {badge}
        </div>
      )}
    </div>
  );
};

export default Avatar;
