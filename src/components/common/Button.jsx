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
  const baseStyles = 'px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] font-mono text-xs uppercase tracking-wider';
  
  const variants = {
    primary: 'bg-black hover:bg-zinc-900 text-white shadow-sm border border-black',
    secondary: 'bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-sm',
    ghost: 'bg-transparent hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 border border-transparent',
    danger: 'bg-red-650 hover:bg-red-700 text-white shadow-sm'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 border-2 border-slate-350 border-t-black rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
