import { Component } from '@/types';
import { Trash2 } from 'lucide-react';
import { materials } from '@/utils/materials';

interface PropertiesPanelProps {
  selectedComponent: Component | null;
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onDeleteComponent: (id: string) => void;
}

export default function PropertiesPanel({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
}: PropertiesPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">Select a component to view properties</p>
      </div>
    );
  }

  const handleMaterialChange = (materialName: string) => {
    const material = materials.find(m => m.name === materialName);
    if (material) {
      onUpdateComponent(selectedComponent.id, { material });
    }
  };

  const handleDimensionChange = (key: keyof Component['dimensions'], value: number) => {
    onUpdateComponent(selectedComponent.id, {
      dimensions: {
        ...selectedComponent.dimensions,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        <button
          onClick={() => onDeleteComponent(selectedComponent.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete component"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Component Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <input
            type="text"
            value={selectedComponent.type}
            disabled
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 capitalize"
          />
        </div>

        {/* Material Selection */}
        <div>
          <label htmlFor="material-select" className="block text-sm font-medium text-gray-700 mb-1">
            Material
          </label>
          <select
            id="material-select"
            value={selectedComponent.material.name}
            onChange={(e) => handleMaterialChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {materials.map((material) => (
              <option key={material.name} value={material.name}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        {/* Material Properties (Read-only) */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Material Properties</h3>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Elasticity:</span>
            </div>
            <div className="text-right font-medium">
              {selectedComponent.material.elasticity.toLocaleString()} MPa
            </div>

            <div>
              <span className="text-gray-600">Density:</span>
            </div>
            <div className="text-right font-medium">
              {selectedComponent.material.density.toLocaleString()} kg/m³
            </div>

            <div>
              <span className="text-gray-600">Yield Strength:</span>
            </div>
            <div className="text-right font-medium">
              {selectedComponent.material.yieldStrength.toLocaleString()} MPa
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Dimensions (m)</h3>

          <div className="space-y-3">
            <div>
              <label htmlFor="dimension-length" className="block text-xs text-gray-600 mb-1">
                Length
              </label>
              <input
                id="dimension-length"
                type="number"
                step="0.1"
                min="0.1"
                value={selectedComponent.dimensions.length}
                onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0.1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="dimension-width" className="block text-xs text-gray-600 mb-1">
                Width
              </label>
              <input
                id="dimension-width"
                type="number"
                step="0.1"
                min="0.1"
                value={selectedComponent.dimensions.width}
                onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0.1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="dimension-height" className="block text-xs text-gray-600 mb-1">
                Height
              </label>
              <input
                id="dimension-height"
                type="number"
                step="0.1"
                min="0.1"
                value={selectedComponent.dimensions.height}
                onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0.1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Position (Read-only) */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Position (m)</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-600 text-xs">X:</span>
              <div className="font-medium">{selectedComponent.position.x.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Y:</span>
              <div className="font-medium">{selectedComponent.position.y.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Z:</span>
              <div className="font-medium">{selectedComponent.position.z.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
