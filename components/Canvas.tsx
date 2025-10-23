'use client';

import { useRef, useEffect, useState } from 'react';
import { Component, AnalysisResult } from '@/types';
import Canvas3D from './Canvas3D';

interface CanvasProps {
  components: Component[];
  selectedComponent: Component | null;
  onSelectComponent: (component: Component | null) => void;
  onAddComponent: (type: string, position: { x: number; y: number; z: number }) => void;
  selectedTool: string;
  view3D: boolean;
  analysisResult: AnalysisResult | null;
}

export default function Canvas({
  components,
  selectedComponent,
  onSelectComponent,
  onAddComponent,
  selectedTool,
  view3D,
  analysisResult,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(40);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || view3D) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw components
    components.forEach((component) => {
      drawComponent(ctx, component, component.id === selectedComponent?.id);
    });

    // Draw stress visualization if analysis result exists
    if (analysisResult) {
      drawStressVisualization(ctx);
    }
  }, [components, selectedComponent, scale, offset, view3D, analysisResult]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;

    const gridSize = scale;
    const offsetX = (width / 2 + offset.x) % gridSize;
    const offsetY = (height / 2 + offset.y) % gridSize;

    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 2;
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
  };

  const drawComponent = (
    ctx: CanvasRenderingContext2D,
    component: Component,
    isSelected: boolean
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2 + offset.x;
    const centerY = canvas.height / 2 + offset.y;

    const x = centerX + component.position.x * scale;
    const y = centerY - component.position.y * scale;

    const width = component.dimensions.length * scale;
    const height = component.dimensions.height * scale;

    // Get stress color if analysis result exists
    let fillColor = component.material.color;
    if (analysisResult) {
      const stress = analysisResult.stresses.find(s => s.componentId === component.id);
      if (stress) {
        fillColor = stress.stressColor;
      }
    }

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = isSelected ? '#007bff' : '#495057';
    ctx.lineWidth = isSelected ? 3 : 2;

    if (component.type === 'beam') {
      ctx.fillRect(x - width / 2, y - 5, width, 10);
      ctx.strokeRect(x - width / 2, y - 5, width, 10);
    } else if (component.type === 'column') {
      ctx.fillRect(x - 5, y - height, 10, height);
      ctx.strokeRect(x - 5, y - height, 10, height);
    } else if (component.type === 'wall') {
      ctx.fillRect(x - width / 2, y - height, width, height);
      ctx.strokeRect(x - width / 2, y - height, width, height);
    } else if (component.type === 'support') {
      // Draw triangle for support
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 15, y + 20);
      ctx.lineTo(x + 15, y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw label
    if (isSelected) {
      ctx.fillStyle = '#212529';
      ctx.font = '12px sans-serif';
      ctx.fillText(component.type.toUpperCase(), x + 10, y - 10);
    }
  };

  const drawStressVisualization = (ctx: CanvasRenderingContext2D) => {
    // This would draw stress contours and values
    // For now, colors are applied directly to components
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || view3D) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (selectedTool === 'select') {
      // Check if clicked on a component
      let clickedComponent: Component | null = null;

      for (const component of components) {
        const centerX = canvas.width / 2 + offset.x;
        const centerY = canvas.height / 2 + offset.y;
        const x = centerX + component.position.x * scale;
        const y = centerY - component.position.y * scale;

        const width = component.dimensions.length * scale;
        const height = component.dimensions.height * scale;

        if (
          clickX >= x - width / 2 &&
          clickX <= x + width / 2 &&
          clickY >= y - height &&
          clickY <= y + height
        ) {
          clickedComponent = component;
          break;
        }
      }

      onSelectComponent(clickedComponent);
    } else if (['beam', 'column', 'wall', 'support'].includes(selectedTool)) {
      // Add new component at click position
      const centerX = canvas.width / 2 + offset.x;
      const centerY = canvas.height / 2 + offset.y;

      const worldX = (clickX - centerX) / scale;
      const worldY = (centerY - clickY) / scale;

      onAddComponent(selectedTool, { x: worldX, y: worldY, z: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      // Middle mouse or shift+left mouse for panning
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(10, Math.min(100, prev * delta)));
  };

  if (view3D) {
    return (
      <Canvas3D
        components={components}
        selectedComponent={selectedComponent}
        onSelectComponent={onSelectComponent}
        analysisResult={analysisResult}
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-crosshair"
        role="application"
        aria-label="Structural design canvas"
        tabIndex={0}
      />
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md text-sm text-gray-600">
        <div>Zoom: {scale.toFixed(0)}%</div>
        <div className="text-xs mt-1">Scroll to zoom, Shift+Drag to pan</div>
      </div>
    </div>
  );
}
