'use client';

import { useState } from 'react';
import Toolbar from '@/components/Toolbar';
import Canvas from '@/components/Canvas';
import PropertiesPanel from '@/components/PropertiesPanel';
import ResultsPanel from '@/components/ResultsPanel';
import LoadsPanel from '@/components/LoadsPanel';
import { Component, Material, Load, AnalysisResult } from '@/types';
import { analyzeStructure } from '@/utils/analysis';

export default function Home() {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [loads, setLoads] = useState<Load[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [view3D, setView3D] = useState(false);

  const addComponent = (type: string, position: { x: number; y: number; z: number }) => {
    const newComponent: Component = {
      id: `comp-${Date.now()}-${Math.random()}`,
      type: type as Component['type'],
      position,
      material: {
        name: 'Steel A36',
        elasticity: 200000,
        density: 7850,
        yieldStrength: 250,
        color: '#6c757d',
      },
      dimensions: {
        length: type === 'beam' ? 3 : 1,
        width: type === 'wall' ? 0.2 : 0.3,
        height: type === 'column' ? 3 : type === 'wall' ? 3 : 0.3,
      },
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates });
    }
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const runAnalysis = () => {
    const result = analyzeStructure(components, loads);
    setAnalysisResult(result);
    setShowResults(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Structural Design & Simulation
          </h1>
          <button
            onClick={() => setView3D(!view3D)}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg text-sm md:text-base hover:bg-blue-600 transition-colors"
            aria-label={view3D ? 'Switch to 2D view' : 'Switch to 3D view'}
          >
            {view3D ? '2D View' : '3D View'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Toolbar */}
        <Toolbar
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          onRunAnalysis={runAnalysis}
        />

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 relative bg-white">
            <Canvas
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onAddComponent={addComponent}
              selectedTool={selectedTool}
              view3D={view3D}
              analysisResult={analysisResult}
            />
          </div>

          {/* Side Panels - Mobile: Tabs, Desktop: Side by Side */}
          <aside className="w-full md:w-80 lg:w-96 bg-white border-t md:border-l border-gray-200 flex flex-col">
            {/* Tab Navigation - Mobile Only */}
            <div className="md:hidden flex border-b border-gray-200">
              <button
                onClick={() => setShowResults(false)}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  !showResults
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setShowResults(true)}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  showResults
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Results
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Mobile: Show based on tab, Desktop: Show properties */}
              <div className={`${showResults ? 'hidden md:flex' : 'flex'} flex-col flex-1 overflow-hidden`}>
                <PropertiesPanel
                  selectedComponent={selectedComponent}
                  onUpdateComponent={updateComponent}
                  onDeleteComponent={deleteComponent}
                />
                <LoadsPanel
                  loads={loads}
                  onUpdateLoads={setLoads}
                  selectedComponent={selectedComponent}
                />
              </div>

              {/* Mobile: Show based on tab, Desktop: Always show */}
              <div className={`${!showResults ? 'hidden md:flex' : 'flex'} flex-col flex-1 overflow-hidden`}>
                <ResultsPanel analysisResult={analysisResult} />
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
