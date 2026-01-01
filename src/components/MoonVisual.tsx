'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface MoonSceneProps {
  phase: number; // 0 to 1
}

const MoonScene: React.FC<MoonSceneProps> = ({ phase }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  
  // Convert phase to angle for light direction
  // phase 0 (New Moon) -> Light from behind
  // phase 0.5 (Full Moon) -> Light from front
  const lightAngle = (phase * Math.PI * 2) + Math.PI;

  return (
    <>
      <ambientLight intensity={0.05} />
      
      {/* Sun lighting the Moon */}
      <directionalLight 
        position={[10 * Math.cos(lightAngle), 0, 10 * Math.sin(lightAngle)]} 
        intensity={2} 
        color="#fff" 
      />

      <Sphere ref={moonRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#888" 
          roughness={0.9} 
          metalness={0.1}
          emissive="#111"
        />
      </Sphere>

      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

export const MoonVisual: React.FC<MoonSceneProps> = ({ phase }) => {
  return (
    <div className="w-full h-[150px] bg-zinc-950 rounded-lg overflow-hidden relative border border-zinc-900 shadow-inner">
      <div className="absolute top-2 left-2 z-10 font-mono text-[8px] uppercase tracking-widest text-zinc-500 pointer-events-none">
        Fase y Orientación Lunar
      </div>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
        <MoonScene phase={phase} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

