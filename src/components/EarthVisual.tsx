'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, PerspectiveCamera, OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface EarthSceneProps {
  axialTilt: number;
}

// --- MASTER VISUAL: THE CELESTIAL NAVIGATOR (Clear Axial Focus + Rotation Speed) ---
const RotationSpeedVisual = ({ radius }: { radius: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // The Earth spins at ~460m/s at equator. 
      // We animate these indicators to give a sense of that constant momentum.
      groupRef.current.rotation.z = -state.clock.getElapsedTime() * 1.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[radius + 0.1, 0, 0]}>
              <boxGeometry args={[0.15, 0.01, 0.001]} />
              <meshBasicMaterial color="#0ea5e9" transparent opacity={0.4} />
            </mesh>
            {i % 3 === 0 && (
              <mesh position={[radius + 0.25, 0, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshBasicMaterial color="#38bdf8" />
                <pointLight distance={0.4} intensity={0.5} color="#38bdf8" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

const CelestialNavigatorMesh = ({ axialTilt }: { axialTilt: number }) => {
  const earthRef = useRef<THREE.Group>(null);
  
  const [continentMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={earthRef}>
      {/* 1. Main Earth Body - Minimal opacity for a "ghost" volume effect */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial color="#050b18" transparent opacity={0.15} shininess={2} />
      </mesh>

      {/* 2. Global Grid - Ghostly technical lines */}
      <mesh>
        <sphereGeometry args={[2.005, 32, 32]} />
        <meshBasicMaterial 
          color="#0ea5e9" 
          wireframe 
          transparent 
          opacity={0.05} 
        />
      </mesh>

      {/* 3. Continental Silhouettes - Holographic focus */}
      <mesh>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshPhongMaterial
          map={continentMap}
          transparent
          opacity={0.5}
          color="#7dd3fc"
          emissive="#0369a1"
          emissiveIntensity={0.3}
          shininess={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Axis Poles */}
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 6, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>
      
      {/* 5. Equator Reference & Spin Visualizer */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05, 0.002, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      <RotationSpeedVisual radius={2.05} />
    </group>
  );
};

const CelestialNavigatorScene = ({ axialTilt }: EarthSceneProps) => {
  const tiltRad = (axialTilt * Math.PI) / 180;

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[15, 0, 0]} intensity={6} color="#fff" />
      <pointLight position={[-15, 5, -5]} intensity={0.5} color="#0ea5e9" />

      <group rotation={[0, 0, -tiltRad]}>
        <Suspense fallback={null}>
          <CelestialNavigatorMesh axialTilt={axialTilt} />
        </Suspense>

        <mesh position={[2.5, 0, 0]}>
          <coneGeometry args={[0.08, 0.3, 8]} rotation={[0, 0, -Math.PI / 2]} />
          <meshBasicMaterial color="#facc15" />
          <Html position={[0.5, 0, 0]} center>
            <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-500 px-2 py-0.5 rounded text-[7px] font-bold font-mono whitespace-nowrap shadow-lg">
              FOCO SOLAR
            </div>
          </Html>
        </mesh>
      </group>

      {/* Speed Label near equator */}
      <Html position={[4, 0, 0]} center>
        <div className="flex flex-col items-center gap-1 opacity-40">
          <div className="h-px w-8 bg-sky-500" />
          <span className="text-[6px] font-mono text-sky-400 uppercase tracking-widest">Vel. Rotación</span>
          <span className="text-[8px] font-mono text-white">~1,670 km/h</span>
        </div>
      </Html>

      <Stars radius={100} depth={50} count={600} factor={4} saturation={0} fade speed={0.2} />
    </>
  );
};

export const EarthVisualV3 = ({ axialTilt }: EarthSceneProps) => (
  <div className="w-full h-[400px] bg-black rounded-xl overflow-hidden relative border border-zinc-900 shadow-2xl col-span-2">
    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-sky-400 font-bold">Consola de Estado Rotacional</span>
      </div>
      <span className="font-mono text-[7px] text-zinc-600 uppercase tracking-widest">Inclinación Axial & Momento Angular</span>
    </div>
    
    <div className="absolute bottom-6 right-6 z-10 text-right">
      <span className="text-[7px] font-mono text-zinc-600 uppercase block mb-1">Telemetría Nave Tierra</span>
      <div className="text-xs font-mono text-white bg-sky-500/5 border border-sky-500/10 px-3 py-1 rounded">
        Tilt: <span className="text-sky-400">{axialTilt.toFixed(2)}°</span>
      </div>
    </div>

    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={30} />
      <CelestialNavigatorScene axialTilt={axialTilt} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  </div>
);

export const EarthVisualV1 = () => null;
export const EarthVisualV2 = () => null;
