import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  isLoading = false
}) => {
  const baseStyles = 'px-4 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] select-none';
  
  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs hover:shadow-sm border border-slate-900',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs',
    ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border border-transparent',
    outline: 'bg-transparent hover:bg-slate-100/70 text-slate-700 border border-slate-300',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 shadow-2xs',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs hover:shadow-sm border border-indigo-600'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
