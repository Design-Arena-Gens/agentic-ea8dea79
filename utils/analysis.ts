import { Component, Load, AnalysisResult, StressData } from '@/types';

export function analyzeStructure(components: Component[], loads: Load[]): AnalysisResult {
  if (components.length === 0) {
    return {
      stresses: [],
      maxDeflection: 0,
      totalLoad: 0,
      timestamp: Date.now(),
      status: 'safe',
    };
  }

  const stresses: StressData[] = components.map((component) => {
    // Calculate cross-sectional area
    const area = component.dimensions.width * component.dimensions.height; // m²

    // Find loads on this component
    const componentLoads = loads.filter(l => l.componentId === component.id);

    // Calculate total force on component
    let totalForce = 0;
    componentLoads.forEach(load => {
      if (load.type === 'point') {
        totalForce += Math.abs(load.magnitude);
      } else if (load.type === 'distributed') {
        totalForce += Math.abs(load.magnitude * component.dimensions.length);
      }
    });

    // Add self-weight (gravity load)
    const volume = component.dimensions.length * component.dimensions.width * component.dimensions.height;
    const mass = volume * component.material.density;
    const weight = mass * 9.81; // N
    totalForce += weight;

    // Calculate stress (σ = F/A)
    const avgStress = totalForce / (area * 1000000); // Convert to MPa

    // Calculate bending stress for beams and columns
    let bendingStress = 0;
    if (component.type === 'beam' || component.type === 'column') {
      const momentArm = component.dimensions.length / 2;
      const moment = totalForce * momentArm;
      const I = (component.dimensions.width * Math.pow(component.dimensions.height, 3)) / 12;
      const c = component.dimensions.height / 2;
      bendingStress = (moment * c) / (I * 1000000); // Convert to MPa
    }

    // Total stress
    const maxStress = avgStress + Math.abs(bendingStress);
    const minStress = avgStress - Math.abs(bendingStress);

    // Calculate safety factor
    const safetyFactor = component.material.yieldStrength / maxStress;

    // Determine stress color based on safety factor
    let stressColor = '#28a745'; // Green - safe
    if (safetyFactor < 1) {
      stressColor = '#dc3545'; // Red - critical
    } else if (safetyFactor < 1.5) {
      stressColor = '#ff9800'; // Orange - high stress
    } else if (safetyFactor < 2) {
      stressColor = '#ffc107'; // Yellow - medium stress
    }

    return {
      componentId: component.id,
      maxStress: Math.max(0, maxStress),
      minStress: Math.max(0, minStress),
      avgStress: Math.max(0, avgStress),
      stressColor,
      safetyFactor: Math.max(0, safetyFactor),
    };
  });

  // Calculate maximum deflection (simplified)
  const maxDeflection = stresses.reduce((max, stress) => {
    const component = components.find(c => c.id === stress.componentId);
    if (!component) return max;

    // Simplified deflection calculation: δ = FL³ / (3EI)
    const E = component.material.elasticity * 1000000; // Convert to Pa
    const L = component.dimensions.length;
    const I = (component.dimensions.width * Math.pow(component.dimensions.height, 3)) / 12;

    // Estimate force from stress
    const area = component.dimensions.width * component.dimensions.height;
    const F = stress.avgStress * area * 1000000;

    const deflection = (F * Math.pow(L, 3)) / (3 * E * I);

    return Math.max(max, deflection);
  }, 0);

  // Calculate total load
  const totalLoad = loads.reduce((sum, load) => {
    if (load.type === 'point') {
      return sum + Math.abs(load.magnitude);
    } else if (load.type === 'distributed') {
      const component = components.find(c => c.id === load.componentId);
      if (component) {
        return sum + Math.abs(load.magnitude * component.dimensions.length);
      }
    }
    return sum;
  }, 0);

  // Determine overall status
  let status: AnalysisResult['status'] = 'safe';
  const minSafetyFactor = Math.min(...stresses.map(s => s.safetyFactor));

  if (minSafetyFactor < 1) {
    status = 'critical';
  } else if (minSafetyFactor < 1.5) {
    status = 'warning';
  }

  return {
    stresses,
    maxDeflection,
    totalLoad,
    timestamp: Date.now(),
    status,
  };
}
