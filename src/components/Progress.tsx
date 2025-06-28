import React from 'react';

type ProgressVariant = 'linear' | 'circular';
type ProgressSize = 'small' | 'medium' | 'large';
type ProgressColor = 'default' | 'primary' | 'danger' | 'success' | 'warning';

interface BaseProgressProps {
  value?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  className?: string;
  indeterminate?: boolean;
  label?: string;
  showValue?: boolean;
}

interface LinearProgressProps extends BaseProgressProps {
  variant: 'linear';
  thickness?: 'thin' | 'medium' | 'thick';
}

interface CircularProgressProps extends BaseProgressProps {
  variant: 'circular';
  thickness?: number;
}

type ProgressProps = LinearProgressProps | CircularProgressProps;

const Progress: React.FC<ProgressProps> = (props) => {
  const {
    value = 0,
    color = 'primary',
    size = 'medium',
    className = '',
    indeterminate = false,
    label,
    showValue = false,
    variant
  } = props;

  const clampedValue = Math.min(100, Math.max(0, value));

  const getColorClasses = () => {
    const colorMap = {
      default: 'bg-gradient-to-r from-gray-500 to-gray-600',
      primary: 'bg-gradient-to-r from-primary to-primary-600',
      danger: 'bg-gradient-to-r from-red-500 to-red-600',
      success: 'bg-gradient-to-r from-green-500 to-green-600',
      warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    };

    return colorMap[color];
  };

  if (variant === 'linear') {
    const { thickness = 'medium' } = props as LinearProgressProps;
    
    const sizeClasses = {
      small: 'h-1',
      medium: 'h-2',
      large: 'h-3'
    };

    const thicknessClasses = {
      thin: 'h-1',
      medium: 'h-2',
      thick: 'h-4'
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {showValue && (
              <span className="text-sm text-gray-500">{Math.round(clampedValue)}%</span>
            )}
          </div>
        )}
        
        <div className={`w-full bg-gray-200 rounded-full ${thicknessClasses[thickness]} overflow-hidden shadow-inner`}>
          <div
            className={`
              ${getColorClasses()} 
              ${thicknessClasses[thickness]} 
              rounded-full transition-all duration-500 ease-out relative overflow-hidden
              ${indeterminate ? 'animate-pulse' : ''}
            `}
            style={{
              width: indeterminate ? '100%' : `${clampedValue}%`,
              animation: indeterminate ? 'progressIndeterminate 2s ease-in-out infinite' : undefined
            }}
          >
            {!indeterminate && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Circular Progress
  const { thickness = 4 } = props as CircularProgressProps;
  
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64
  };

  const size_px = sizeMap[size];
  const radius = (size_px - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        <svg
          width={size_px}
          height={size_px}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size_px / 2}
            cy={size_px / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={thickness}
            fill="none"
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <circle
            cx={size_px / 2}
            cy={size_px / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
            className={getColorClasses().replace('bg-', 'text-')}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: indeterminate ? 0 : strokeDashoffset,
              animation: indeterminate ? 'spin 2s linear infinite' : undefined
            }}
          />
        </svg>
        
        {/* Center content */}
        {(label || showValue) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {showValue && (
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(clampedValue)}%
                </span>
              )}
              {label && (
                <div className="text-xs text-gray-500">{label}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
