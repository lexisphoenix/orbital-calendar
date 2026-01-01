'use client';

import React, { useState, useEffect } from 'react';
import { calculateOrbitalStatus, OrbitalStatus } from '@/lib/orbital-mechanics';
import { OrbitalRing } from '@/components/OrbitalRing';
import { TelemetryPanel, TelemetryItem } from '@/components/TelemetryPanel';
import { EarthVisualV1, EarthVisualV2, EarthVisualV3 } from '@/components/EarthVisual';
import { GravityMeter } from '@/components/GravityMeter';
import { MoonVisual } from '@/components/MoonVisual';
import { MomentumTrackers } from '@/components/MomentumTrackers';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Satellite, RotateCw, Calendar, Globe, Compass, Play, Pause } from 'lucide-react';
import { getDayOfYear } from 'date-fns';

export default function Home() {
  const [status, setStatus] = useState<OrbitalStatus | null>(null);
  const [date, setDate] = useState(new Date());
  const [isManual, setIsManual] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate day of year for the slider
  const currentDayOfYear = getDayOfYear(date);

  useEffect(() => {
    setStatus(calculateOrbitalStatus(date));
    
    if (!isManual && !isPlaying) {
      const timer = setInterval(() => {
        setDate(new Date());
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [date, isManual, isPlaying]);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (isPlaying) {
        setDate(prevDate => {
          const nextDate = new Date(prevDate);
          nextDate.setDate(nextDate.getDate() + 1);
          if (nextDate.getFullYear() > new Date().getFullYear()) {
             return new Date(new Date().getFullYear(), 0, 1);
          }
          return nextDate;
        });
        animationFrameId = window.setTimeout(() => {
          requestAnimationFrame(animate);
        }, 100); 
      }
    };

    if (isPlaying) {
      requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        window.clearTimeout(animationFrameId);
      }
    };
  }, [isPlaying]);

  const handleTimeTravel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManual(true);
    setIsPlaying(false);
    const day = parseInt(e.target.value);
    const newDate = new Date(new Date().getFullYear(), 0, day);
    setDate(newDate);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setIsManual(true);
  };

  const resetToToday = () => {
    setIsManual(false);
    setIsPlaying(false);
    setDate(new Date());
  };

  if (!status) return null;

  return (
    <main className="min-h-screen bg-black text-zinc-300 selection:bg-sky-500/30 font-serif">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
        
        {/* UPDATED HERO SECTION: MODERN HIERARCHY */}
        <header className="mb-24 space-y-16 relative">
          {/* Top Left Title & Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="relative group">
              <div className="absolute -inset-2 bg-sky-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <Globe size={28} className="text-sky-500 relative animate-[spin_20s_linear_infinite]" />
            </div>
            <h1 className="text-[10px] md:text-xs font-mono tracking-[0.6em] uppercase text-sky-500/40">
              Navegación Planetaria • Tierra V2
            </h1>
          </div>

          <div className="text-center space-y-8">
            <motion.div 
              key={status.dayOfYear}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-6xl font-light italic text-zinc-200 tracking-tight leading-none">
                Hoy has recorrido
              </h2>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl md:text-6xl font-black text-sky-500 font-mono tracking-tighter shadow-sky-500/20 drop-shadow-2xl">
                  {(status.velocity * 3600 * 24).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xl md:text-2xl font-mono text-zinc-600 uppercase tracking-widest pt-2">km</span>
              </div>
            </motion.div>

            {/* Modern Date Display */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex flex-col items-end">
                <span className="text-2xl md:text-4xl font-black text-white leading-none font-mono">
                  {date.getDate().toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Día</span>
              </div>
              
              <div className="h-10 w-px bg-sky-900/50 rotate-12" />
              
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-light text-zinc-400 uppercase tracking-[0.3em] font-serif italic">
                  {date.toLocaleDateString('es-ES', { month: 'long' })}
                </span>
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Ciclo {date.getFullYear()}</span>
              </div>

              <div className="h-10 w-px bg-sky-900/50 rotate-12" />

              <div className="flex flex-col items-start">
                <span className="text-sm md:text-base font-mono text-zinc-500 uppercase tracking-widest">
                  {date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className="text-[10px] font-mono text-sky-800 uppercase tracking-widest">Inercia</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto text-center relative px-10 py-8 border-l border-sky-500/10">
            <p className="text-lg md:text-xl leading-relaxed italic text-zinc-500 font-light font-serif">
              "El tiempo no es una línea recta de tareas pendientes. Es una elipse de velocidad variable alrededor de una estrella."
            </p>
          </div>
        </header>

        {/* MAIN FOCUS: ORBITAL STATUS */}
        <section className="mb-32 space-y-20">
          {/* Orbital Location Visual & Infographic */}
          <div className="relative">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-sky-500/5 border border-sky-500/10 text-sky-400 text-sm font-mono uppercase tracking-[0.4em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                Navegación Orbital: Trayectoria Real
              </div>
              
              <div className="max-w-xl mx-auto p-6 bg-zinc-900/40 border border-sky-900/30 rounded-2xl shadow-2xl backdrop-blur-sm relative group overflow-hidden text-left">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-50" />
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-sky-500 uppercase tracking-[0.4em]">
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                      Próximo Punto Crítico
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tighter uppercase font-mono">
                      {status.nextMilestone.name}
                    </h3>
                    <p className="text-sm text-zinc-400 italic font-serif leading-relaxed">
                      "{status.nextMilestone.description}"
                    </p>
                  </div>
                  <div className="h-16 w-px bg-zinc-800 hidden md:block" />
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Tiempo de Arribo (ETA)</div>
                    <div className="text-2xl font-bold text-sky-400 font-mono tracking-tighter">
                      {status.nextMilestone.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </div>
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1 italic">Navegación Planetaria</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <OrbitalRing 
                progress={status.orbitalProgress} 
                eccentricity={0.0167} 
                nextMilestoneName={status.nextMilestone.name}
              />
            </div>
          </div>

          {/* Minimalist Time Travel Slider */}
          <section className="max-w-3xl mx-auto py-8 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="p-3 bg-sky-500/10 hover:bg-sky-500/20 rounded-full text-sky-400 transition-all border border-sky-500/20"
                  title={isPlaying ? 'Pausar' : 'Simular'}
                >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
                
                {(isManual || isPlaying) && (
                  <button 
                    onClick={resetToToday}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-sky-500 transition-all border border-zinc-800"
                    title="Regresar al Presente"
                  >
                    <RotateCw size={14} />
                  </button>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 block mb-1">
                  {isPlaying ? 'Sincronía Acelerada' : isManual ? 'Modo Simulación' : 'Tiempo Real'}
                </span>
                <span className="text-lg font-mono font-bold text-sky-400 tracking-tighter uppercase">
                  {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <input 
                type="range" 
                min="1" 
                max="365" 
                value={currentDayOfYear} 
                onChange={handleTimeTravel}
                className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
              />
              
              <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-zinc-700">
                <span className="flex flex-col"><span className="text-zinc-500">Perihelio</span></span>
                <span className="flex flex-col text-right"><span className="text-zinc-500">Afelio</span></span>
              </div>
            </div>
          </section>

          {/* Momentum Trackers */}
          <div className="max-w-4xl mx-auto bg-zinc-900/10 p-10 rounded-[3rem] border border-zinc-800/30">
            <MomentumTrackers 
              orbitalVelocity={status.velocity} 
              isAccelerating={status.isAccelerating} 
            />
          </div>
        </section>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          <div className="space-y-8">
            <TelemetryPanel title="PANEL A: DINÁMICA ORBITAL">
              <div className="col-span-2 mb-4">
                <GravityMeter 
                  velocity={status.velocity} 
                  acceleration={status.acceleration} 
                  isAccelerating={status.isAccelerating} 
                />
              </div>
              <TelemetryItem 
                label="Progreso Órbita" 
                value={status.orbitalProgress.toFixed(1)} 
                unit="°" 
                subValue={`${status.orbitalProgress.toFixed(1)}° desde Perihelio.`}
                className="col-span-1"
              />
              <TelemetryItem 
                label="Radio Orbital" 
                value={status.distance.toFixed(1)} 
                unit="M km" 
                subValue="Distancia exacta al centro solar."
                className="col-span-1"
              />
              <TelemetryItem 
                label="Fase de Viaje" 
                value={status.phase.split(' ')[0]} 
                subValue={status.phase}
                className="col-span-2"
              />
            </TelemetryPanel>

            <TelemetryPanel title="PANEL L: SISTEMA LUNAR">
              <div className="col-span-2 mb-4">
                <MoonVisual phase={status.moonPhase} />
              </div>
              <TelemetryItem 
                label="Fase Lunar" 
                value={status.moonPhaseName} 
                subValue={`${(status.moonPhase * 100).toFixed(0)}% del ciclo lunar.`}
                className="col-span-2"
              />
            </TelemetryPanel>
          </div>

          <div className="space-y-8">
            <TelemetryPanel title="PANEL B: ESTADO ROTACIONAL">
              <div className="col-span-2 mb-6">
                <EarthVisualV3 axialTilt={status.axialTilt} />
              </div>
              <TelemetryItem 
                label="Rotación Nº" 
                value={status.rotationNumber} 
                unit="Giro" 
                subValue={`Día actual del ciclo anual.`}
              />
              <TelemetryItem 
                label="Incidencia Solar" 
                value={`${Math.abs(status.axialTilt).toFixed(1)}°`} 
                unit={status.axialTilt > 0 ? 'N' : 'S'}
                subValue={`Latitud con rayos verticales.`}
              />
              <TelemetryItem 
                label="Temp. Hemisferio N" 
                value={status.temperature.north.toFixed(1)} 
                unit="°C" 
                subValue="Promedio estimado."
              />
              <TelemetryItem 
                label="Temp. Hemisferio S" 
                value={status.temperature.south.toFixed(1)} 
                unit="°C" 
                subValue="Promedio estimado."
              />
            </TelemetryPanel>
          </div>
        </div>

        <footer className="mt-20 text-center pb-20">
          <div className="text-[11px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
            Siente la inercia • Nave Tierra • Calendario Orbital
          </div>
        </footer>

      </div>
    </main>
  );
}
