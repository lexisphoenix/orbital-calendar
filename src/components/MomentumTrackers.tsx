'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MomentumTrackersProps {
  orbitalVelocity: number; // km/s
  isAccelerating: boolean;
}

export const MomentumTrackers: React.FC<MomentumTrackersProps> = ({ orbitalVelocity, isAccelerating }) => {
  // Constants for relative speeds
  // Rotational speed at equator: ~0.46 km/s
  // Orbital speed: ~29.3 to 30.3 km/s
  
  const rotationSpeedKms = 0.46;
  
  return (
    <div className="w-full space-y-12 py-8 border-t border-zinc-900 mt-12">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-sky-500 uppercase tracking-[0.3em]">Momento Angular (Rotación)</span>
            <span className="text-[8px] text-zinc-600 font-mono italic">Velocidad constante: 0.46 km/s (1,670 km/h)</span>
          </div>
          <span className="text-[10px] font-mono text-white bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">GIRO CONTINUO</span>
        </div>
        
        {/* Rotation Tracker */}
        <div className="relative h-8 w-full bg-zinc-950 rounded border border-zinc-900 overflow-hidden group">
          {/* Background grid */}
          <div className="absolute inset-0 flex justify-between px-4 opacity-5 pointer-events-none">
            {[...Array(20)].map((_, i) => <div key={i} className="w-px h-full bg-white" />)}
          </div>
          
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-2"
            animate={{ x: ["-100%", "100vw"] }}
            transition={{ 
              duration: 15, // Fixed duration for constant rotation speed
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-4 h-4 rounded-full border border-sky-400 flex items-center justify-center">
              <motion.div 
                className="w-2 h-0.5 bg-sky-400" 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-[8px] font-mono text-sky-400/60 uppercase whitespace-nowrap tracking-tighter">Nave Tierra: Spin Mode</span>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.3em]">Momento Lineal (Órbita)</span>
            <span className="text-[8px] text-zinc-600 font-mono italic">Velocidad variable: {orbitalVelocity.toFixed(2)} km/s</span>
          </div>
          <span className={`text-[10px] font-mono ${isAccelerating ? 'text-sky-400' : 'text-amber-400'} uppercase tracking-widest`}>
            {isAccelerating ? 'Ganando Inercia' : 'Perdiendo Inercia'}
          </span>
        </div>

        {/* Orbital Tracker */}
        <div className="relative h-12 w-full bg-zinc-950 rounded border border-zinc-900 overflow-hidden">
          {/* Velocity Scale */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-900/50 flex justify-between px-2">
            <span className="text-[6px] text-zinc-700">29.3 km/s</span>
            <span className="text-[6px] text-zinc-700">30.3 km/s</span>
          </div>

          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-3"
            animate={{ x: ["-100%", "100vw"] }}
            transition={{ 
              // Duration changes based on current orbital velocity
              // Lower velocity (29.3) -> longer duration
              // Higher velocity (30.3) -> shorter duration
              duration: 10 * (30 / orbitalVelocity), 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="relative flex items-center justify-center">
              <motion.div 
                className="w-6 h-2 bg-gradient-to-r from-sky-500/0 to-sky-500 rounded-full blur-[2px]"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-white font-bold leading-none">{orbitalVelocity.toFixed(2)} km/s</span>
              <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest leading-none mt-1">Trayectoria Solar</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.4em]">
          Comparativa de Magnitudes Cinéticas • Sistema Tierra-Sol
        </p>
      </div>
    </div>
  );
};

