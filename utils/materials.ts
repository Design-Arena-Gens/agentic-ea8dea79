import { Material } from '@/types';

export const materials: Material[] = [
  {
    name: 'Steel A36',
    elasticity: 200000, // MPa
    density: 7850, // kg/m³
    yieldStrength: 250, // MPa
    color: '#6c757d',
  },
  {
    name: 'Steel A572-50',
    elasticity: 200000,
    density: 7850,
    yieldStrength: 345,
    color: '#495057',
  },
  {
    name: 'Aluminum 6061-T6',
    elasticity: 68900,
    density: 2700,
    yieldStrength: 276,
    color: '#adb5bd',
  },
  {
    name: 'Concrete C30',
    elasticity: 33000,
    density: 2400,
    yieldStrength: 30,
    color: '#ced4da',
  },
  {
    name: 'Concrete C40',
    elasticity: 35000,
    density: 2400,
    yieldStrength: 40,
    color: '#adb5bd',
  },
  {
    name: 'Wood (Douglas Fir)',
    elasticity: 13000,
    density: 500,
    yieldStrength: 50,
    color: '#8d6e63',
  },
  {
    name: 'Titanium Ti-6Al-4V',
    elasticity: 113800,
    density: 4430,
    yieldStrength: 880,
    color: '#90a4ae',
  },
];
