import React, { useState } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type AvatarColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  radius?: AvatarRadius;
  color?: AvatarColor;
  name?: string;
  className?: string;
  onClick?: () => void;
  isBordered?: boolean;
  isDisabled?: boolean;
  showFallback?: boolean;
  fallback?: React.ReactNode;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  radius = 'full',
  color = 'default',
  name,
  className = '',
  onClick,
  isBordered = false,
  isDisabled = false,
  showFallback = true,
  fallback,
  imgProps,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const colorClasses = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-purple-100 text-purple-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const shouldShowFallback = !src || imgError;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        font-medium select-none overflow-hidden
        ${sizeClasses[size]}
        ${radiusClasses[radius]}
        ${shouldShowFallback ? colorClasses[color] : ''}
        ${isBordered ? 'ring-2 ring-white ring-offset-2' : ''}
        ${onClick && !isDisabled ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-transform duration-200 ease-out
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      onClick={!isDisabled ? onClick : undefined}
    >
      {src && !imgError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${radiusClasses[radius]}`}
          onError={handleImageError}
          {...imgProps}
        />
      )}
      
      {shouldShowFallback && (
        <>
          {fallback || (name && (
            <span className="font-semibold">
              {getInitials(name)}
            </span>
          )) || (showFallback && (
            <svg 
              className="w-2/3 h-2/3 text-current" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ))}
        </>
      )}
    </div>
  );
};

export default Avatar;
