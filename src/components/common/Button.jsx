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
    primary: 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-950/40 hover:shadow-cyan-500/20 hover:shadow-lg border border-emerald-500/30',
    secondary: 'bg-slate-900/90 hover:bg-slate-800 text-emerald-400 hover:text-cyan-400 border border-emerald-500/20 hover:border-cyan-500/40',
    ghost: 'bg-transparent hover:bg-slate-900/50 text-slate-400 hover:text-emerald-400 border border-transparent',
    danger: 'bg-gradient-to-r from-rose-600 to-red-650 hover:from-rose-500 hover:to-red-600 text-white shadow-rose-950/40'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 border-2 border-slate-300 border-t-emerald-400 rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
