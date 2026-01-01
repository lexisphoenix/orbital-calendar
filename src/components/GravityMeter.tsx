'use client';

import React from 'react';

interface GravityMeterProps {
  velocity: number;
  acceleration: number;
  isAccelerating: boolean;
}

export const GravityMeter: React.FC<GravityMeterProps> = ({ velocity, acceleration, isAccelerating }) => {
  const minV = 29.29;
  const maxV = 30.29;
  const progress = ((velocity - minV) / (maxV - minV)) * 100;

  return (
    <div className="w-full space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Inercia (Velocidad)</span>
          <span className="text-xl font-bold font-mono text-white">{velocity.toFixed(2)} <span className="text-xs font-normal text-zinc-500 uppercase">km/s</span></span>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Aceleración (Gravedad)</span>
          <span className="text-xl font-bold font-mono text-sky-400">{acceleration.toFixed(2)} <span className="text-xs font-normal text-zinc-500 uppercase">mm/s²</span></span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Vector de Empuje</span>
          <div className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border ${isAccelerating ? 'border-sky-500/50 text-sky-400 bg-sky-500/5' : 'border-amber-500/50 text-amber-400 bg-amber-500/5'}`}>
            {isAccelerating ? 'Acelerando (Caída)' : 'Desacelerando (Ascenso)'}
          </div>
        </div>
        <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out ${isAccelerating ? 'bg-sky-500' : 'bg-amber-500'}`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-700" />
        </div>
      </div>
      
      <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
        <span>Mín (Afelio)</span>
        <span>Velocidad Media</span>
        <span>Máx (Perihelio)</span>
      </div>
    </div>
  );
};

