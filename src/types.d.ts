declare module '*.css' {
  const content: any;
  export default content;
}

declare module 'sabled' {
  import React from 'react';

  export interface ButtonProps {
    children?: React.ReactNode;
    variant?: 'solid' | 'outlined' | 'dashed' | 'text' | 'link';
    color?: 'default' | 'primary' | 'danger' | 'success';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    className?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    style?: React.CSSProperties;
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  }

  export interface StyleProviderProps {
    children: React.ReactNode;
  }

  export const Button: React.FC<ButtonProps>;
  export const StyleProvider: React.FC<StyleProviderProps>;
  export const message: any;
  export const confirm: any;
}
