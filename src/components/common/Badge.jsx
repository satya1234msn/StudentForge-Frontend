import React from 'react';

const Badge = ({ 
  children, 
  variant = 'indigo', 
  className = '' 
}) => {
  const baseStyles = 'px-2.5 py-0.5 text-[11px] font-semibold rounded-full border flex items-center justify-center w-fit tracking-tight select-none transition-colors duration-150';

  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100/90',
    lavender: 'bg-indigo-50 text-indigo-700 border-indigo-100/90',
    teal: 'bg-teal-50 text-teal-700 border-teal-100/90',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100/90',
    mint: 'bg-emerald-50 text-emerald-700 border-emerald-100/90',
    amber: 'bg-amber-50 text-amber-800 border-amber-100/90',
    orange: 'bg-orange-50 text-orange-800 border-orange-100/90',
    peach: 'bg-orange-50/80 text-orange-700 border-orange-100/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-100/90',
    purple: 'bg-purple-50 text-purple-700 border-purple-100/90',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100/90',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/80'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.indigo} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
