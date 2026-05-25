import React from 'react';

const Badge = ({ 
  children, 
  variant = 'indigo', 
  className = '' 
}) => {
  const baseStyles = 'px-3 py-1 text-xs font-semibold rounded-full border flex items-center justify-center w-fit';

  const variants = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.indigo} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
