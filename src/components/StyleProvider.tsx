import React from 'react';

interface StyleProviderProps {
  children: React.ReactNode;
}

/**
 * StyleProvider component that wraps your components to ensure proper styling.
 * This is optional - styles are automatically injected with the components.
 */
const StyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  return (
    <div className="sabled-provider">
      {children}
    </div>
  );
};

export default StyleProvider;
