import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'dots' | 'spinner' | 'pulse' | 'bars';
type SpinnerColor = 'default' | 'primary' | 'danger' | 'success' | 'warning';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: SpinnerColor;
  className?: string;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className = '',
  label
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const colorClasses = {
    default: 'text-gray-600',
    primary: 'text-primary',
    danger: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-yellow-500'
  };

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3'
  };

  const barSizes = {
    xs: 'w-0.5 h-3',
    sm: 'w-0.5 h-4',
    md: 'w-1 h-5',
    lg: 'w-1 h-6',
    xl: 'w-1.5 h-8'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${dotSizes[size]} ${colorClasses[color]} bg-current rounded-full animate-bounce`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-pulse`}
            style={{
              animationDuration: '1s'
            }}
          />
        );

      case 'bars':
        return (
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${barSizes[size]} ${colorClasses[color]} bg-current rounded-sm animate-pulse`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        );

      case 'spinner':
      default:
        return (
          <svg
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {renderSpinner()}
      {label && (
        <span className={`mt-2 text-sm ${colorClasses[color]} font-medium`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Spinner;
