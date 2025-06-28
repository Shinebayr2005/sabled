declare module '*.css' {
  const content: any;
  export default content;
}

declare module 'sabled' {
  import React from 'react';

  // Button Component
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

  // Input Component
  export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium' | 'large';
    color?: 'default' | 'primary' | 'danger' | 'success';
    label?: string;
    helperText?: string;
    error?: boolean;
    errorText?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    fullWidth?: boolean;
  }

  // Card Component
  export interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    hoverable?: boolean;
    clickable?: boolean;
    onClick?: () => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
  }

  // Modal Component
  export interface ModalProps {
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

  // Badge Component
  export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'solid' | 'outlined' | 'soft';
    color?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    dot?: boolean;
    rounded?: boolean;
  }

  // StyleProvider Component
  export interface StyleProviderProps {
    children: React.ReactNode;
  }

  // Component Exports
  export const Button: React.FC<ButtonProps>;
  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
  export const Textarea: React.ForwardRefExoticComponent<any>;
  export const Select: React.FC<any>;
  export const Checkbox: React.ForwardRefExoticComponent<any>;
  export const Radio: React.ForwardRefExoticComponent<any>;
  export const Card: React.FC<CardProps>;
  export const Modal: React.FC<ModalProps>;
  export const Badge: React.FC<BadgeProps>;
  export const Toast: React.FC<any>;
  export const ToastContainer: React.FC<any>;
  export const Progress: React.FC<any>;
  export const StyleProvider: React.FC<StyleProviderProps>;
  
  // Utils
  export const message: any;
  export const confirm: any;
}
