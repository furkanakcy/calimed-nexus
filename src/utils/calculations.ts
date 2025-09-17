import { Room, AirFlowTest, ParticleTest } from '../types/report';

export const calculateVolume = (area: number, height: number): number => {
  return Math.round((area * height) * 100) / 100;
};

export const calculateDebit = (velocity: number, filterX: number, filterY: number): number => {
  return Math.round((velocity * (filterX / 1000) * (filterY / 1000) * 3600) * 100) / 100;
};

export const calculateAirChangeRate = (totalDebit: number, volume: number): number => {
  return Math.round((totalDebit / volume) * 100) / 100;
};

export const calculateSamplePoints = (area: number): number => {
  return Math.max(4, Math.round(Math.sqrt(10 * area)));
};

export const determineISOClass = (average05: number): string => {
  if (average05 <= 3520) return 'ISO 7';
  if (average05 <= 35200) return 'ISO 8';
  if (average05 <= 352000) return 'ISO 9';
  return 'ISO 9+';
};

export const validatePressure = (pressure: number): boolean => {
  return pressure >= 6;
};

export const validateHEPA = (leakage: number): boolean => {
  return leakage <= 0.01;
};

export const validateRecoveryTime = (duration: number): boolean => {
  return duration <= 25;
};

export const validateTemperature = (temp: number): boolean => {
  return temp >= 20 && temp <= 24;
};

export const validateHumidity = (humidity: number): boolean => {
  return humidity >= 40 && humidity <= 60;
};

export const validateParticleClass = (isoClass: string, targetClass: string = 'ISO 7'): boolean => {
  const classOrder = ['ISO 7', 'ISO 8', 'ISO 9', 'ISO 9+'];
  const currentIndex = classOrder.indexOf(isoClass);
  const targetIndex = classOrder.indexOf(targetClass);
  return currentIndex <= targetIndex;
};

export const calculateOverallCompliance = (testData: any): boolean => {
  return testData.pressure?.isCompliant &&
         testData.hepa?.isCompliant &&
         testData.recovery?.isCompliant &&
         testData.particle?.isCompliant &&
         testData.tempHumidity?.tempCompliant &&
         testData.tempHumidity?.humidityCompliant;
};