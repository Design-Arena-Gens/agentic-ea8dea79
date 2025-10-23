import { Load, Component } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface LoadsPanelProps {
  loads: Load[];
  onUpdateLoads: (loads: Load[]) => void;
  selectedComponent: Component | null;
}

export default function LoadsPanel({ loads, onUpdateLoads, selectedComponent }: LoadsPanelProps) {
  const [showAddLoad, setShowAddLoad] = useState(false);
  const [newLoad, setNewLoad] = useState<Partial<Load>>({
    type: 'point',
    magnitude: 1000,
    direction: 'y',
  });

  const addLoad = () => {
    if (!selectedComponent) {
      alert('Please select a component first');
      return;
    }

    const load: Load = {
      id: `load-${Date.now()}`,
      componentId: selectedComponent.id,
      type: newLoad.type as Load['type'],
      magnitude: newLoad.magnitude || 1000,
      direction: newLoad.direction as Load['direction'],
      position: selectedComponent.position,
    };

    onUpdateLoads([...loads, load]);
    setShowAddLoad(false);
    setNewLoad({ type: 'point', magnitude: 1000, direction: 'y' });
  };

  const deleteLoad = (id: string) => {
    onUpdateLoads(loads.filter(l => l.id !== id));
  };

  const componentLoads = selectedComponent
    ? loads.filter(l => l.componentId === selectedComponent.id)
    : [];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Loads & Boundary Conditions</h2>
        <button
          onClick={() => setShowAddLoad(!showAddLoad)}
          className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Add load"
          disabled={!selectedComponent}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {!selectedComponent && (
        <p className="text-sm text-gray-500 text-center">
          Select a component to add loads
        </p>
      )}

      {showAddLoad && selectedComponent && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Load</h3>

          <div className="space-y-3">
            <div>
              <label htmlFor="load-type" className="block text-xs text-gray-600 mb-1">
                Type
              </label>
              <select
                id="load-type"
                value={newLoad.type}
                onChange={(e) => setNewLoad({ ...newLoad, type: e.target.value as Load['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="point">Point Load</option>
                <option value="distributed">Distributed Load</option>
                <option value="moment">Moment</option>
              </select>
            </div>

            <div>
              <label htmlFor="load-magnitude" className="block text-xs text-gray-600 mb-1">
                Magnitude ({newLoad.type === 'moment' ? 'N·m' : newLoad.type === 'distributed' ? 'N/m' : 'N'})
              </label>
              <input
                id="load-magnitude"
                type="number"
                step="100"
                value={newLoad.magnitude}
                onChange={(e) => setNewLoad({ ...newLoad, magnitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="load-direction" className="block text-xs text-gray-600 mb-1">
                Direction
              </label>
              <select
                id="load-direction"
                value={newLoad.direction}
                onChange={(e) => setNewLoad({ ...newLoad, direction: e.target.value as Load['direction'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="x">X (Horizontal)</option>
                <option value="y">Y (Vertical)</option>
                <option value="z">Z (Depth)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addLoad}
                className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Add Load
              </button>
              <button
                onClick={() => setShowAddLoad(false)}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display loads on selected component */}
      {selectedComponent && componentLoads.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Loads on {selectedComponent.type}
          </h3>

          {componentLoads.map((load) => (
            <div
              key={load.id}
              className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 capitalize">
                  {load.type} Load
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {load.magnitude.toLocaleString()}{' '}
                  {load.type === 'moment' ? 'N·m' : load.type === 'distributed' ? 'N/m' : 'N'}
                  {' '} in {load.direction.toUpperCase()} direction
                </div>
              </div>
              <button
                onClick={() => deleteLoad(load.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete load"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Summary of all loads */}
      {loads.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Total Loads: {loads.length}
          </h3>
          <div className="text-xs text-gray-600">
            Total magnitude: {loads.reduce((sum, l) => sum + l.magnitude, 0).toLocaleString()} N
          </div>
        </div>
      )}
    </div>
  );
}
