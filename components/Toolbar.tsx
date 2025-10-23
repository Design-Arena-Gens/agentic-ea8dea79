import { MousePointer2, Box, Columns3, Square, Anchor, Download, Play } from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onSelectTool: (tool: string) => void;
  onRunAnalysis: () => void;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'beam', icon: Box, label: 'Beam' },
  { id: 'column', icon: Columns3, label: 'Column' },
  { id: 'wall', icon: Square, label: 'Wall' },
  { id: 'support', icon: Anchor, label: 'Support' },
];

export default function Toolbar({ selectedTool, onSelectTool, onRunAnalysis }: ToolbarProps) {
  return (
    <nav className="bg-white border-b md:border-r md:border-b-0 border-gray-200 p-2 md:w-16 lg:w-20 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
      <div className="flex md:flex-col gap-1 flex-1 md:flex-initial">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`p-2 md:p-3 rounded-lg transition-all ${
                selectedTool === tool.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={tool.label}
              aria-label={tool.label}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          );
        })}
      </div>

      <div className="flex md:flex-col gap-1 md:mt-auto">
        <button
          onClick={onRunAnalysis}
          className="p-2 md:p-3 rounded-lg bg-secondary text-white hover:bg-green-600 transition-all shadow-sm"
          title="Run Analysis"
          aria-label="Run structural analysis"
        >
          <Play className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          onClick={() => {
            // Export report functionality
            alert('Export functionality would generate a detailed PDF report');
          }}
          className="p-2 md:p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          title="Export Report"
          aria-label="Export analysis report"
        >
          <Download className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </nav>
  );
}
