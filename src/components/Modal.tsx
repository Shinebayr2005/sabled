import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  };

  // Handle open animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Disable body scroll immediately
      document.body.style.overflow = 'hidden';
      
      // Start with closed state
      setIsAnimating(true);
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false);
        });
      });
    } else if (!isOpen && isVisible) {
      // Handle close from parent
      handleClose();
    }
  }, [isOpen]);

  // Handle close animation
  const handleClose = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
      onClose();
    }, 300); // Match animation duration
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (!isVisible) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isVisible, closeOnEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        !isAnimating 
          ? 'bg-black/60 backdrop-blur-md' 
          : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] bg-white rounded-xl shadow-2xl
          border border-gray-200/50 transition-all duration-300 ease-out
          ${!isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
          }
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200/80 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-t-xl">
            {title && (
              <h2 className={`text-xl font-bold text-gray-900 transition-all duration-400 ease-out ${
                !isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: !isAnimating ? '100ms' : '0ms' }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className={`text-gray-400 hover:text-gray-600 transition-all duration-400 ease-out p-1 rounded-full hover:bg-gray-100 active:scale-95 ${
                  !isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: !isAnimating ? '150ms' : '0ms' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-8rem)] custom-scrollbar transition-all duration-400 ease-out ${
          !isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: !isAnimating ? '200ms' : '0ms' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`border-t border-gray-200/80 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-b-xl transition-all duration-400 ease-out ${
            !isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: !isAnimating ? '250ms' : '0ms' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
