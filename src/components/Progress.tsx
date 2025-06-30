import React from 'react';

type ProgressVariant = 'solid' | 'bordered' | 'light' | 'flat';
type ProgressSize = 'sm' | 'md' | 'lg';
type ProgressColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ProgressRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface BaseProgressProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  radius?: ProgressRadius;
  variant?: ProgressVariant;
  className?: string;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  label?: string;
  showValueLabel?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  valueLabel?: string;
}

interface LinearProgressProps extends BaseProgressProps {
  orientation?: 'horizontal' | 'vertical';
  isStriped?: boolean;
  disableAnimation?: boolean;
}

interface CircularProgressProps extends BaseProgressProps {
  strokeWidth?: number;
  trackStroke?: string;
}

type ProgressProps = (LinearProgressProps & { type?: 'linear' }) | (CircularProgressProps & { type: 'circular' });

const Progress: React.FC<ProgressProps> = (props) => {
  const {
    value = 0,
    minValue = 0,
    maxValue = 100,
    color = 'primary',
    size = 'md',
    radius = 'full',
    variant = 'solid',
    className = '',
    isIndeterminate = false,
    isDisabled = false,
    label,
    showValueLabel = false,
    valueLabel,
    type = 'linear'
  } = props;

  const clampedValue = Math.min(maxValue, Math.max(minValue, value));
  const percentage = ((clampedValue - minValue) / (maxValue - minValue)) * 100;

  const getColorClasses = () => {
    const colorMap = {
      default: {
        solid: 'bg-gray-400',
        bordered: 'border-gray-400 bg-transparent',
        light: 'bg-gray-100 text-gray-600',
        flat: 'bg-gray-200'
      },
      primary: {
        solid: 'bg-primary',
        bordered: 'border-primary bg-transparent',
        light: 'bg-primary/10 text-primary',
        flat: 'bg-primary/20'
      },
      secondary: {
        solid: 'bg-gray-500',
        bordered: 'border-gray-500 bg-transparent',
        light: 'bg-gray-100 text-gray-700',
        flat: 'bg-gray-200'
      },
      success: {
        solid: 'bg-green-500',
        bordered: 'border-green-500 bg-transparent',
        light: 'bg-green-100 text-green-700',
        flat: 'bg-green-200'
      },
      warning: {
        solid: 'bg-yellow-500',
        bordered: 'border-yellow-500 bg-transparent',
        light: 'bg-yellow-100 text-yellow-700',
        flat: 'bg-yellow-200'
      },
      danger: {
        solid: 'bg-red-500',
        bordered: 'border-red-500 bg-transparent',
        light: 'bg-red-100 text-red-700',
        flat: 'bg-red-200'
      }
    };

    return colorMap[color][variant];
  };

  const getRadiusClasses = () => {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    };
    return radiusMap[radius];
  };

  const getSizeClasses = () => {
    if (type === 'circular') {
      const sizeMap = {
        sm: 32,
        md: 48,
        lg: 64
      };
      return sizeMap[size];
    } else {
      const sizeMap = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
      };
      return sizeMap[size];
    }
  };

  if (type === 'circular') {
    const { strokeWidth = 4, trackStroke } = props as CircularProgressProps;
    const sizePx = getSizeClasses() as number;
    const radius = (sizePx - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`inline-flex items-center justify-center ${className} ${isDisabled ? 'opacity-50' : ''}`}>
        <div className="relative">
          <svg
            width={sizePx}
            height={sizePx}
            className="transform -rotate-90"
          >
            {/* Background track */}
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={radius}
              stroke={trackStroke || "currentColor"}
              strokeWidth={strokeWidth}
              fill="none"
              className="text-gray-200"
            />
            
            {/* Progress circle */}
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              className={getColorClasses().replace('bg-', 'text-')}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: isIndeterminate ? 0 : strokeDashoffset,
                transition: 'stroke-dashoffset 0.5s ease-in-out',
                animation: isIndeterminate ? 'spin 2s linear infinite' : undefined
              }}
            />
          </svg>
          
          {/* Center content */}
          {(label || showValueLabel || valueLabel) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {(showValueLabel || valueLabel) && (
                  <span className="text-xs font-medium text-gray-700">
                    {valueLabel || `${Math.round(percentage)}%`}
                  </span>
                )}
                {label && (
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Linear Progress
  const { orientation = 'horizontal', isStriped = false, disableAnimation = false } = props as LinearProgressProps;
  const heightClasses = getSizeClasses() as string;
  const isVertical = orientation === 'vertical';

  return (
    <div className={`${isVertical ? 'h-full w-fit' : 'w-full'} ${className} ${isDisabled ? 'opacity-50' : ''}`}>
      {label && (
        <div className={`flex ${isVertical ? 'flex-col items-center' : 'justify-between items-center'} mb-2`}>
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {(showValueLabel || valueLabel) && (
            <span className="text-sm text-gray-500">
              {valueLabel || `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}
      
      <div className={`
        ${isVertical ? `w-2 h-full ${getRadiusClasses()}` : `w-full ${heightClasses} ${getRadiusClasses()}`}
        bg-gray-200 overflow-hidden shadow-inner relative
      `}>
        <div
          className={`
            ${getColorClasses()}
            ${isVertical ? `w-full ${getRadiusClasses()}` : `${heightClasses} ${getRadiusClasses()}`}
            ${!disableAnimation ? 'transition-all duration-500 ease-out' : ''}
            ${isIndeterminate ? 'animate-pulse' : ''}
            ${isStriped ? 'bg-stripes' : ''}
            relative overflow-hidden
          `}
          style={{
            [isVertical ? 'height' : 'width']: isIndeterminate ? '100%' : `${percentage}%`,
            animation: isIndeterminate ? 'progressIndeterminate 2s ease-in-out infinite' : undefined
          }}
        >
          {!isIndeterminate && !disableAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
