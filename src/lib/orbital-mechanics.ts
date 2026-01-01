import { differenceInDays, getDayOfYear, startOfYear } from 'date-fns';

export interface OrbitalStatus {
  dayOfYear: number;
  daysSincePerihelion: number;
  orbitalProgress: number; // degrees
  velocity: number; // km/s
  acceleration: number; // mm/s^2 (centripetal)
  distance: number; // million km
  isAccelerating: boolean;
  phase: string;
  rotationNumber: number;
  axialTilt: number;
  lightDistribution: string;
  temperature: {
    north: number;
    south: number;
  };
  moonPhase: number; // 0 to 1
  moonPhaseName: string;
  nextMilestone: {
    name: string;
    date: Date;
    description: string;
  };
}

const AU = 149.5978707; // 1 AU in million km
const ECCENTRICITY = 0.0167;
const MEAN_VELOCITY = 29.78;
const PERIHELION_DAY = 3; // Approx Jan 3rd
const APHELION_DAY = 185; // Approx July 4th
const EQUINOX_1_DAY = 79; // Approx March 20th
const EQUINOX_2_DAY = 265; // Approx Sept 22nd

export function calculateOrbitalStatus(date: Date = new Date()): OrbitalStatus {
  const dayOfYear = getDayOfYear(date);
  const year = date.getFullYear();

  // 1. Days since Perihelion
  let daysSincePerihelion = dayOfYear - PERIHELION_DAY;
  if (daysSincePerihelion < 0) {
    daysSincePerihelion += 365.25;
  }

  // 2. Orbital Progress (Degrees)
  const meanAnomaly = (daysSincePerihelion / 365.25) * 360;
  const meanAnomalyRad = (meanAnomaly * Math.PI) / 180;
  const trueAnomalyRad = meanAnomalyRad + 2 * ECCENTRICITY * Math.sin(meanAnomalyRad);
  const orbitalProgress = (trueAnomalyRad * 180) / Math.PI;

  // 3. Distance (million km)
  const distance = (AU * (1 - Math.pow(ECCENTRICITY, 2))) / (1 + ECCENTRICITY * Math.cos(trueAnomalyRad));

  // 4. Velocity (km/s)
  const velocity = MEAN_VELOCITY * (AU / distance);

  // 4.1 Centripetal Acceleration (mm/s^2)
  // a = mu / r^2. mu for Sun is approx 132,712 million km^3/s^2
  const acceleration = (132712 / Math.pow(distance, 2)) * 1000;

  // 5. Phase & Acceleration
  const isAccelerating = dayOfYear > APHELION_DAY || dayOfYear < PERIHELION_DAY;
  let phase = "";
  if (dayOfYear >= PERIHELION_DAY && dayOfYear < EQUINOX_1_DAY) phase = "Desacelerando (Saliendo del Perihelio)";
  else if (dayOfYear >= EQUINOX_1_DAY && dayOfYear < APHELION_DAY) phase = "Desacelerando hacia el Afelio";
  else if (dayOfYear >= APHELION_DAY && dayOfYear < EQUINOX_2_DAY) phase = "Acelerando (Caída gravitatoria)";
  else phase = "Acelerando hacia el Perihelio";

  // 6. Axial Tilt (Degrees)
  const daysSinceEquinox1 = dayOfYear - EQUINOX_1_DAY;
  const axialTilt = 23.44 * Math.sin(((daysSinceEquinox1 / 365.25) * 2 * Math.PI));

  // 7. Light Distribution
  let lightDistribution = "";
  if (axialTilt > 10) lightDistribution = "Polo Norte en luz constante. Hemisferio Sur en penumbra.";
  else if (axialTilt < -10) lightDistribution = "Polo Sur en luz constante. Hemisferio Norte en penumbra.";
  else lightDistribution = "Equilibrio lumínico global aproximado.";

  // 8. Temperature (Highly simplified approximation based on tilt and distance)
  // Distance factor: Earth is closer in Jan (Perihelion), but tilt dominates seasons.
  const distFactor = (AU / distance) ** 2; // Inverse square law
  const northTemp = 15 + (15 * Math.sin((axialTilt * Math.PI) / 46.88)) * distFactor;
  const southTemp = 15 - (15 * Math.sin((axialTilt * Math.PI) / 46.88)) * distFactor;

  // 9. Moon Phase (Simplified)
  const referenceNewMoon = new Date(2024, 0, 11);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceRef = (date.getTime() - referenceNewMoon.getTime()) / msPerDay;
  const moonPhaseRaw = (daysSinceRef % 29.53059) / 29.53059;
  const moonPhase = moonPhaseRaw < 0 ? moonPhaseRaw + 1 : moonPhaseRaw;
  
  let moonPhaseName = "";
  if (moonPhase < 0.03 || moonPhase > 0.97) moonPhaseName = "Luna Nueva";
  else if (moonPhase < 0.22) moonPhaseName = "Luna Creciente";
  else if (moonPhase < 0.28) moonPhaseName = "Cuarto Creciente";
  else if (moonPhase < 0.47) moonPhaseName = "Gibosa Creciente";
  else if (moonPhase < 0.53) moonPhaseName = "Luna Llena";
  else if (moonPhase < 0.72) moonPhaseName = "Gibosa Menguante";
  else if (moonPhase < 0.78) moonPhaseName = "Cuarto Menguante";
  else moonPhaseName = "Luna Menguante";

  // 10. Next Milestone
  const milestones = [
    { name: "PERIHELIO", day: PERIHELION_DAY, description: "Máxima velocidad y cercanía al Sol." },
    { name: "EQUINOCCIO DE PRIMAVERA", day: EQUINOX_1_DAY, description: "Equilibrio de luz. Cruce del nodo ascendente." },
    { name: "AFELIO", day: APHELION_DAY, description: "Mínima velocidad. Punto más lejano." },
    { name: "EQUINOCCIO DE OTOÑO", day: EQUINOX_2_DAY, description: "Segundo equilibrio lumínico global." }
  ];

  let nextMilestone = milestones[0];
  for (const m of milestones) {
    if (m.day > dayOfYear) {
      nextMilestone = m;
      break;
    }
  }
  
  const milestoneDate = new Date(year, 0, nextMilestone.day);

  return {
    dayOfYear,
    daysSincePerihelion: Math.floor(daysSincePerihelion),
    orbitalProgress,
    velocity,
    acceleration,
    distance,
    isAccelerating,
    phase,
    rotationNumber: dayOfYear,
    axialTilt,
    lightDistribution,
    temperature: {
      north: northTemp,
      south: southTemp,
    },
    moonPhase,
    moonPhaseName,
    nextMilestone: {
      ...nextMilestone,
      date: milestoneDate
    }
  };
}
