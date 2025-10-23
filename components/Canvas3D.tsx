'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Cylinder } from '@react-three/drei';
import { Component, AnalysisResult } from '@/types';

interface Canvas3DProps {
  components: Component[];
  selectedComponent: Component | null;
  onSelectComponent: (component: Component | null) => void;
  analysisResult: AnalysisResult | null;
}

function Component3D({
  component,
  isSelected,
  onClick,
  stressColor,
}: {
  component: Component;
  isSelected: boolean;
  onClick: () => void;
  stressColor?: string;
}) {
  const color = stressColor || component.material.color;
  const position: [number, number, number] = [
    component.position.x,
    component.position.y + component.dimensions.height / 2,
    component.position.z,
  ];

  if (component.type === 'beam') {
    return (
      <Box
        position={position}
        args={[component.dimensions.length, 0.3, component.dimensions.width]}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={isSelected ? '#007bff' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Box>
    );
  } else if (component.type === 'column') {
    return (
      <Box
        position={position}
        args={[component.dimensions.width, component.dimensions.height, component.dimensions.width]}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={isSelected ? '#007bff' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Box>
    );
  } else if (component.type === 'wall') {
    return (
      <Box
        position={position}
        args={[component.dimensions.length, component.dimensions.height, component.dimensions.width]}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={isSelected ? '#007bff' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Box>
    );
  } else if (component.type === 'support') {
    return (
      <Cylinder
        position={[component.position.x, component.position.y, component.position.z]}
        args={[0.3, 0.5, 0.5, 4]}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={isSelected ? '#007bff' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Cylinder>
    );
  }

  return null;
}

export default function Canvas3D({
  components,
  selectedComponent,
  onSelectComponent,
  analysisResult,
}: Canvas3DProps) {
  return (
    <Canvas
      camera={{ position: [10, 10, 10], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#e9ecef"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#adb5bd"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
      />

      {components.map((component) => {
        const stress = analysisResult?.stresses.find(s => s.componentId === component.id);
        return (
          <Component3D
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponent?.id}
            onClick={() => onSelectComponent(component)}
            stressColor={stress?.stressColor}
          />
        );
      })}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
}
