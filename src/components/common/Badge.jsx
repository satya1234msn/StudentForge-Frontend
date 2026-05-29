import React from 'react';

const Badge = ({ 
  children, 
  variant = 'indigo', 
  className = '' 
}) => {
  const baseStyles = 'px-3 py-1 text-xs font-semibold rounded-full border flex items-center justify-center w-fit';

  const variants = {
    indigo: 'bg-slate-800 text-slate-100 border-slate-700/60',
    purple: 'bg-slate-850 text-slate-200 border-slate-700/50',
    teal: 'bg-slate-800 text-slate-100 border-slate-700/60',
    orange: 'bg-slate-800 text-slate-100 border-slate-700/70',
    emerald: 'bg-slate-800 text-slate-100 border-slate-700/60',
    rose: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-900 text-slate-300 border-slate-800'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.indigo} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
