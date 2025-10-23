export interface Material {
  name: string;
  elasticity: number; // MPa
  density: number; // kg/m³
  yieldStrength: number; // MPa
  color: string;
}

export interface Component {
  id: string;
  type: 'beam' | 'column' | 'wall' | 'support';
  position: { x: number; y: number; z: number };
  material: Material;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Load {
  id: string;
  componentId: string;
  type: 'point' | 'distributed' | 'moment';
  magnitude: number; // N or N/m or N·m
  direction: 'x' | 'y' | 'z';
  position?: { x: number; y: number; z: number };
}

export interface StressData {
  componentId: string;
  maxStress: number;
  minStress: number;
  avgStress: number;
  stressColor: string;
  safetyFactor: number;
}

export interface AnalysisResult {
  stresses: StressData[];
  maxDeflection: number;
  totalLoad: number;
  timestamp: number;
  status: 'safe' | 'warning' | 'critical';
}
