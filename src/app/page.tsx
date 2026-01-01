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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-24">
        
        {/* REFINED HERO SECTION */}
        <header className="mb-10 sm:mb-16 space-y-8 sm:space-y-10 relative text-center">
          <div className="space-y-4">
            <h1 className="text-xs md:text-sm font-mono tracking-[0.5em] uppercase text-sky-500/60 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-sky-900 hidden md:block" />
              Calendario Orbital Terrestre
              <span className="h-px w-10 bg-sky-900 hidden md:block" />
            </h1>
            <p className="text-5xl md:text-7xl font-light text-white tracking-[0.02em] italic opacity-95 leading-tight">
              Edición Trayectoria
            </p>
            <div className="pt-2 font-mono text-sm md:text-lg uppercase tracking-[0.3em] text-zinc-400 flex items-center justify-center gap-3">
              <Calendar size={16} className="text-sky-800" />
              {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto text-center relative px-4 sm:px-8 py-6 sm:py-8 border-y border-sky-900/10">
            <p className="text-xl md:text-2xl leading-relaxed italic text-zinc-400 font-light">
              "El tiempo no es una línea recta de tareas pendientes. Es una elipse de velocidad variable alrededor de una estrella. Olvida la agenda. Siente la inercia."
            </p>
          </div>
        </header>

        {/* DISTANCE COUNTER: IMMEDIATELY BELOW HERO */}
        <section className="mb-16 sm:mb-24 text-center space-y-6">
          <motion.div 
            key={status.dayOfYear}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] md:text-xs font-mono text-zinc-600 uppercase tracking-[0.5em] mb-3">Avance Orbital Diario</span>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-baseline gap-4">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-mono leading-none">
                  {(status.velocity * 3600 * 24).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </h2>
                <span className="text-2xl md:text-4xl font-light italic text-sky-500/50 uppercase tracking-widest font-mono">km</span>
              </div>
              <p className="text-lg md:text-2xl text-zinc-500 italic font-light mt-2">recorridos hoy en nuestra órbita</p>
            </div>
          </motion.div>
        </section>

        {/* MAIN FOCUS: ORBITAL STATUS */}
        <section className="mb-24 sm:mb-32 space-y-12 sm:space-y-16">
          {/* Orbital Location Visual & Infographic */}
          <div className="relative">
            <div className="text-center mb-10 sm:mb-16 space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-sky-500/5 border border-sky-500/10 text-sky-400 text-sm font-mono uppercase tracking-[0.4em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                Navegación Orbital: Trayectoria Real
              </div>
              
              <div className="max-w-xl mx-auto p-6 bg-zinc-900/40 border border-sky-900/30 rounded-2xl shadow-2xl backdrop-blur-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-50" />
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 text-left space-y-2">
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

          {/* Momentum Trackers */}
          <div className="max-w-4xl mx-auto bg-zinc-900/10 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-800/30">
            <MomentumTrackers 
              orbitalVelocity={status.velocity} 
              isAccelerating={status.isAccelerating} 
            />
          </div>
        </section>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start mb-24 sm:mb-32">
          <div className="space-y-8">
            <TelemetryPanel title="PANEL A: DINÁMICA ORBITAL">
              <div className="col-span-1 sm:col-span-2 mb-4">
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
                className="col-span-1 sm:col-span-2"
              />
            </TelemetryPanel>

            <TelemetryPanel title="PANEL L: SISTEMA LUNAR">
              <div className="col-span-1 sm:col-span-2 mb-4">
                <MoonVisual phase={status.moonPhase} />
              </div>
              <TelemetryItem 
                label="Fase Lunar" 
                value={status.moonPhaseName} 
                subValue={`${(status.moonPhase * 100).toFixed(0)}% del ciclo lunar.`}
                className="col-span-1 sm:col-span-2"
              />
            </TelemetryPanel>
          </div>

          <div className="space-y-8">
            <TelemetryPanel title="PANEL B: ESTADO ROTACIONAL">
              <div className="col-span-1 sm:col-span-2 mb-6">
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

        {/* Time Travel Slider - AT THE BOTTOM */}
        <section className="mt-24 sm:mt-32 bg-zinc-900/30 border border-zinc-800/50 p-6 sm:p-12 rounded-2xl sm:rounded-[3rem] space-y-8 sm:space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
              <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
                <Compass size={20} className={isManual || isPlaying ? 'animate-spin' : ''} />
                Control de Navegación Temporal
              </h2>
              <button 
                onClick={togglePlay}
                className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-full text-sm font-mono uppercase tracking-widest text-sky-400 transition-all shadow-2xl w-full sm:w-auto"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                {isPlaying ? 'Pausar' : 'Simular Ciclo Anual'}
              </button>
            </div>
            {(isManual || isPlaying) && (
              <button 
                onClick={resetToToday}
                className="text-xs font-mono uppercase tracking-widest text-sky-500 hover:text-sky-300 transition-colors flex items-center justify-center gap-2 bg-sky-500/5 px-4 py-2 rounded-full border border-sky-500/10 w-full md:w-auto"
              >
                <RotateCw size={14} />
                Regresar al Presente
              </button>
            )}
          </div>
          
          <div className="space-y-10">
            <input 
              type="range" 
              min="1" 
              max="365" 
              value={currentDayOfYear} 
              onChange={handleTimeTravel}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 items-center text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              <div className="flex flex-col border-l-0 sm:border-l border-zinc-800 pl-0 sm:pl-4">
                <span className="text-zinc-400 font-bold">PERIHELIO</span>
                <span className="text-[8px] opacity-50">Máxima Velocidad</span>
              </div>
              <div className="text-center">
                <span className="text-sky-400 font-bold text-xl md:text-3xl block tracking-tighter mb-1">
                  {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase()}
                </span>
                <span className="text-zinc-500 text-[8px] tracking-[0.5em] block">
                  {isPlaying ? 'SINCRONÍA ACELERADA' : isManual ? 'MODO SIMULACIÓN' : 'TIEMPO REAL'}
                </span>
              </div>
              <div className="flex flex-col text-left sm:text-right border-r-0 sm:border-r border-zinc-800 pr-0 sm:pr-4">
                <span className="text-zinc-400 font-bold">AFELIO</span>
                <span className="text-[8px] opacity-50">Mínima Velocidad</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 text-center pb-20">
          <div className="text-[11px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
            Siente la inercia • Nave Tierra • Calendario Orbital
          </div>
        </footer>

      </div>
    </main>
  );
}
