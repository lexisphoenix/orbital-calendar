'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface OrbitalRingProps {
  progress: number; // degrees
  eccentricity: number;
  nextMilestoneName: string;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({ progress, eccentricity, nextMilestoneName }) => {
  const size = 600;
  const center = size / 2;
  
  const visualEccentricity = 0.25; 
  const rx = 240;
  const ry = rx * Math.sqrt(1 - Math.pow(visualEccentricity, 2));
  const focusOffset = rx * visualEccentricity;
  const rotationOffset = -Math.PI / 2;

  const getPosition = (angleRad: number) => {
    const r = (rx * (1 - Math.pow(visualEccentricity, 2))) / (1 + visualEccentricity * Math.cos(angleRad));
    const xBase = r * Math.cos(angleRad);
    const yBase = r * Math.sin(angleRad);
    const x = xBase * Math.cos(rotationOffset) - yBase * Math.sin(rotationOffset);
    const y = xBase * Math.sin(rotationOffset) + yBase * Math.cos(rotationOffset);
    return { x: center + x, y: center + y };
  };

  const planetPos = getPosition((progress * Math.PI) / 180);

  const monthSlices = useMemo(() => {
    const slices = [];
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    
    let currentDayOfYear = 1;
    const PERIHELION_DAY = 3;
    
    for (let i = 0; i < 12; i++) {
      // Start of month angle calculation
      let daysSincePerihelion = currentDayOfYear - PERIHELION_DAY;
      if (daysSincePerihelion < 0) daysSincePerihelion += 365.25;
      const meanAnomalyRad = (daysSincePerihelion / 365.25) * 2 * Math.PI;
      const trueAnomalyRad = meanAnomalyRad + 2 * eccentricity * Math.sin(meanAnomalyRad);
      
      // Middle of month for label
      let midDays = (currentDayOfYear + monthDays[i] / 2) - PERIHELION_DAY;
      if (midDays < 0) midDays += 365.25;
      const midMeanRad = (midDays / 365.25) * 2 * Math.PI;
      const midTrueRad = midMeanRad + 2 * eccentricity * Math.sin(midMeanRad);

      slices.push({
        name: monthNames[i],
        startAngle: trueAnomalyRad,
        midAngle: midTrueRad
      });
      
      currentDayOfYear += monthDays[i];
    }
    return slices;
  }, [eccentricity]);

  const seasonSlices = useMemo(() => {
    const seasons = [
      { name: "PRIMAVERA", day: 79, color: "rgba(74, 222, 128, 0.15)" }, // Green
      { name: "VERANO", day: 172, color: "rgba(250, 204, 21, 0.15)" },   // Yellow
      { name: "OTOÑO", day: 265, color: "rgba(251, 146, 60, 0.15)" },    // Orange
      { name: "INVIERNO", day: 355, color: "rgba(96, 165, 250, 0.15)" }   // Blue
    ];
    
    const PERIHELION_DAY = 3;
    
    return seasons.map((s, i) => {
      let daysSincePerihelion = s.day - PERIHELION_DAY;
      if (daysSincePerihelion < 0) daysSincePerihelion += 365.25;
      const meanAnomalyRad = (daysSincePerihelion / 365.25) * 2 * Math.PI;
      const trueAnomalyRad = meanAnomalyRad + 2 * eccentricity * Math.sin(meanAnomalyRad);
      
      // Calculate middle of season for label
      const nextDay = seasons[(i + 1) % 4].day;
      let duration = nextDay - s.day;
      if (duration < 0) duration += 365.25;
      let midDay = s.day + duration / 2;
      let midDaysSincePeri = midDay - PERIHELION_DAY;
      if (midDaysSincePeri < 0) midDaysSincePeri += 365.25;
      const midMeanRad = (midDaysSincePeri / 365.25) * 2 * Math.PI;
      const midTrueRad = midMeanRad + 2 * eccentricity * Math.sin(midMeanRad);

      return { ...s, angle: trueAnomalyRad, midAngle: midTrueRad };
    });
  }, [eccentricity]);

  const milestones = [
    { name: "PERIHELIO", angle: 0, label: "3 de Enero", desc: "Máxima Velocidad" },
    { name: "EQUINOCCIO PRIMAVERA", angle: 78, label: "20 de Marzo", desc: "Equilibrio Lumínico" },
    { name: "AFELIO", angle: 180, label: "4 de Julio", desc: "Mínima Velocidad" },
    { name: "EQUINOCCIO OTOÑO", angle: 263, label: "22 de Septiembre", desc: "Equilibrio Lumínico" },
  ];

  const trailPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= progress; i += 1) {
      const pos = getPosition((i * Math.PI) / 180);
      points.push(`${pos.x},${pos.y}`);
    }
    return points.join(' ');
  }, [progress, rx, visualEccentricity]);

  return (
    <div className="relative flex items-center justify-center w-full max-w-[650px] mx-auto aspect-square">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-planet">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="velocity-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" /> {/* Perihelio - Rápido */}
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" /> {/* Afelio - Lento */}
          </linearGradient>

          <filter id="glow-path">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path Grid with Velocity Gradient */}
        <g style={{ transform: `rotate(${rotationOffset * 180 / Math.PI}deg)`, transformOrigin: `${center}px ${center}px` }}>
          <ellipse
            cx={center - focusOffset}
            cy={center}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="url(#velocity-gradient)"
            strokeWidth="2"
            strokeDasharray="1 4"
            className="opacity-40"
          />
          <ellipse
            cx={center - focusOffset}
            cy={center}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="url(#velocity-gradient)"
            strokeWidth="0.5"
            className="opacity-20"
          />
        </g>

        {/* Month Slices (Pie Chart Style) */}
        <g>
          {/* Outer circle for the "Clock" look */}
          <circle 
            cx={center} cy={center} 
            r={rx + 45} 
            fill="none" 
            stroke="rgba(56, 189, 248, 0.03)" 
            strokeWidth="1" 
          />

          {/* Season Highlights & Labels */}
          {seasonSlices.map((season) => {
            const pos = getPosition(season.angle);
            const rLabel = rx - 60; // Inner label
            const lxBase = rLabel * Math.cos(season.midAngle);
            const lyBase = rLabel * Math.sin(season.midAngle);
            const lx = lxBase * Math.cos(rotationOffset) - lyBase * Math.sin(rotationOffset);
            const ly = lxBase * Math.sin(rotationOffset) + lyBase * Math.cos(rotationOffset);

            return (
              <g key={season.name}>
                {/* Major Season Boundary */}
                <line 
                  x1={center} y1={center} 
                  x2={pos.x} y2={pos.y} 
                  stroke={season.color.replace('0.15', '0.4')} 
                  strokeWidth="2"
                />
                <circle cx={pos.x} cy={pos.y} r="3" fill={season.color.replace('0.15', '0.6')} />
                
                {/* Season Name */}
                <text
                  x={center + lx}
                  y={center + ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[12px] font-mono font-black tracking-[0.4em]"
                  style={{ fill: season.color.replace('0.15', '0.3') }}
                  transform={`rotate(${(season.midAngle + rotationOffset) * 180 / Math.PI + 90}, ${center + lx}, ${center + ly})`}
                >
                  {season.name}
                </text>
              </g>
            );
          })}
          
          {monthSlices.map((slice) => {
            const pos = getPosition(slice.startAngle);
            const labelPos = getPosition(slice.midAngle);
            // Label point further out
            const rLabel = (rx * (1 - Math.pow(visualEccentricity, 2))) / (1 + visualEccentricity * Math.cos(slice.midAngle)) + 25;
            const lxBase = rLabel * Math.cos(slice.midAngle);
            const lyBase = rLabel * Math.sin(slice.midAngle);
            const lx = lxBase * Math.cos(rotationOffset) - lyBase * Math.sin(rotationOffset);
            const ly = lxBase * Math.sin(rotationOffset) + lyBase * Math.cos(rotationOffset);
            
            return (
              <g key={slice.name}>
                {/* Main Radial Boundary line */}
                <line 
                  x1={center} y1={center} 
                  x2={pos.x} y2={pos.y} 
                  stroke="rgba(56, 189, 248, 0.2)" 
                  strokeWidth="0.5"
                />
                <line 
                  x1={center + (pos.x - center) * 0.85} y1={center + (pos.y - center) * 0.85} 
                  x2={pos.x} y2={pos.y} 
                  stroke="rgba(56, 189, 248, 0.6)" 
                  strokeWidth="2"
                />
                {/* Boundary Tick (Outer) */}
                <line 
                  x1={pos.x} y1={pos.y} 
                  x2={center + (pos.x - center) * 1.15} 
                  y2={center + (pos.y - center) * 1.15} 
                  stroke="rgba(56, 189, 248, 0.4)" 
                  strokeWidth="1.5"
                />
                {/* Month Label */}
                <text
                  x={center + lx}
                  y={center + ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-zinc-600 text-[10px] font-mono tracking-[0.2em] font-bold"
                  transform={`rotate(${(slice.midAngle + rotationOffset) * 180 / Math.PI + 90}, ${center + lx}, ${center + ly})`}
                >
                  {slice.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Trail with Velocity Gradient */}
        <polyline
          points={trailPoints}
          fill="none"
          stroke="url(#velocity-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#glow-path)"
          className="opacity-70"
        />

        {/* Milestones - Enlarged and Refined */}
        {milestones.map((m) => {
          const pos = getPosition((m.angle * Math.PI) / 180);
          const isNext = nextMilestoneName.toUpperCase().includes(m.name.split(' ')[0]);
          return (
            <g key={m.name}>
              <circle 
                cx={pos.x} cy={pos.y} 
                r={isNext ? "6" : "4"} 
                className={`${isNext ? 'fill-sky-400' : 'fill-zinc-800'} transition-all duration-500`} 
              />
              
              <foreignObject 
                x={pos.x + (pos.x >= center ? 20 : -160)} 
                y={pos.y - 30} 
                width="140" 
                height="80"
              >
                <div className={`flex flex-col ${pos.x >= center ? 'items-start text-left' : 'items-end text-right'} space-y-1`}>
                  <span className={`text-[11px] font-mono font-bold tracking-widest ${isNext ? 'text-sky-400' : 'text-zinc-500'}`}>
                    {m.name}
                  </span>
                  <div className="flex flex-col gap-0">
                    <span className="text-[10px] text-zinc-300 font-serif italic">{m.label}</span>
                    <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">{m.desc}</span>
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Sun */}
        <circle cx={center} cy={center} r="14" className="fill-yellow-500 shadow-2xl shadow-yellow-500/50" />
        <motion.circle 
          cx={center} cy={center} r="22" 
          className="fill-yellow-500/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <foreignObject x={center - 20} y={center + 20} width="40" height="20">
          <div className="text-[8px] font-mono text-yellow-500/60 uppercase tracking-widest text-center">
            Sol
          </div>
        </foreignObject>

        {/* Earth - Enlarged and with prominent label */}
        <motion.g
          animate={{ x: planetPos.x, y: planetPos.y }}
          transition={{ type: 'spring', stiffness: 40, damping: 15 }}
        >
          <circle r="10" className="fill-sky-500 shadow-[0_0_25px_rgba(56,189,248,1)]" filter="url(#glow-planet)" />
          <circle r="16" className="fill-sky-500/20" />
          
          <foreignObject x="-60" y="-55" width="120" height="40">
            <div className="flex flex-col items-center">
              <div className="bg-sky-500 text-black px-3 py-1 rounded-sm text-[10px] font-black font-mono uppercase tracking-[0.2em] shadow-2xl transform -rotate-2">
                TIERRA
              </div>
              <div className="w-px h-4 bg-sky-500 mt-1" />
            </div>
          </foreignObject>
          <foreignObject x="-60" y="15" width="120" height="20">
            <div className="text-[7px] font-mono text-sky-400/60 uppercase tracking-widest text-center">
              Usted está aquí
            </div>
          </foreignObject>
        </motion.g>

        <line x1={center} y1={center} x2={planetPos.x} y2={planetPos.y} stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};
