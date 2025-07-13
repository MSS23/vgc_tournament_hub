import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
        />
        {text && (
          <p className={`text-sm ${variantClasses[variant]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton loading component for content placeholders
interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 1,
  variant = 'text'
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    card: 'h-32',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

// Full page loading component
interface FullPageLoadingProps {
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  text = 'Loading...',
  variant = 'primary'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" variant={variant} text={text} />
      </div>
    </div>
  );
};

// Inline loading component
interface InlineLoadingProps {
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'Loading...',
  variant = 'default'
}) => {
  return (
    <div className="inline-flex items-center space-x-2">
      <LoadingSpinner size="sm" variant={variant} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Loading...',
  variant = 'primary',
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" variant={variant} text={text} />
      </div>
    </div>
  );
};

// Table loading skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} variant="text" className="flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="text" 
              className="flex-1" 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Card loading skeleton
interface CardSkeletonProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = '',
  showAvatar = false,
  lines = 3
}) => {
  return (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex items-start space-x-3">
        {showAvatar && (
          <Skeleton variant="avatar" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton lines={lines} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 