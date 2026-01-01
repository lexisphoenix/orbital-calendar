import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TelemetryItemProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  className?: string;
}

export const TelemetryItem: React.FC<TelemetryItemProps> = ({ label, value, unit, subValue, className }) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-bold font-mono text-zinc-200">{value}</span>
      {unit && <span className="text-[10px] text-zinc-500 font-mono">{unit}</span>}
    </div>
    {subValue && <span className="text-[10px] italic text-zinc-600 leading-tight">{subValue}</span>}
  </div>
);

interface TelemetryPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ title, children, className }) => (
  <div className={cn("bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg", className)}>
    <h3 className="text-xs font-bold text-sky-400 mb-4 tracking-[0.2em] uppercase font-mono border-b border-zinc-800 pb-2">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

