import { AnalysisResult } from '@/types';
import { AlertCircle, CheckCircle, AlertTriangle, Download } from 'lucide-react';

interface ResultsPanelProps {
  analysisResult: AnalysisResult | null;
}

export default function ResultsPanel({ analysisResult }: ResultsPanelProps) {
  if (!analysisResult) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">Run analysis to view results</p>
        <p className="text-xs mt-2">Click the play button in the toolbar</p>
      </div>
    );
  }

  const statusConfig = {
    safe: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Safe',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      label: 'Warning',
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Critical',
    },
  };

  const config = statusConfig[analysisResult.status];
  const StatusIcon = config.icon;

  const generateReport = () => {
    const report = `
STRUCTURAL ANALYSIS REPORT
Generated: ${new Date(analysisResult.timestamp).toLocaleString()}

SUMMARY
Status: ${analysisResult.status.toUpperCase()}
Total Load: ${analysisResult.totalLoad.toLocaleString()} N
Max Deflection: ${analysisResult.maxDeflection.toFixed(4)} m

STRESS ANALYSIS
${analysisResult.stresses.map((s, i) => `
Component ${i + 1}:
  Max Stress: ${s.maxStress.toFixed(2)} MPa
  Min Stress: ${s.minStress.toFixed(2)} MPa
  Avg Stress: ${s.avgStress.toFixed(2)} MPa
  Safety Factor: ${s.safetyFactor.toFixed(2)}
`).join('\n')}

RECOMMENDATIONS
${analysisResult.status === 'safe' ? '✓ Structure is safe under current loads' : ''}
${analysisResult.status === 'warning' ? '⚠ Review components with low safety factors' : ''}
${analysisResult.status === 'critical' ? '✗ Structure requires immediate reinforcement' : ''}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `structural-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Analysis Results</h2>
        <button
          onClick={generateReport}
          className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Download report"
          title="Download report"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Status Banner */}
      <div className={`${config.bg} ${config.border} border rounded-lg p-4 mb-4 flex items-start gap-3`}>
        <StatusIcon className={`${config.color} w-6 h-6 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`${config.color} font-semibold text-lg`}>{config.label}</h3>
          <p className="text-sm text-gray-700 mt-1">
            {analysisResult.status === 'safe' && 'All components are within safe stress limits'}
            {analysisResult.status === 'warning' && 'Some components are approaching stress limits'}
            {analysisResult.status === 'critical' && 'Critical stress levels detected - reinforcement required'}
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Load</span>
            <span className="text-sm font-medium text-gray-800">
              {analysisResult.totalLoad.toLocaleString()} N
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Max Deflection</span>
            <span className="text-sm font-medium text-gray-800">
              {analysisResult.maxDeflection.toFixed(4)} m
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Components Analyzed</span>
            <span className="text-sm font-medium text-gray-800">
              {analysisResult.stresses.length}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Analysis Time</span>
            <span className="text-sm font-medium text-gray-800">
              {new Date(analysisResult.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stress Color Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Stress Levels</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#28a745' }}></div>
            <span className="text-sm text-gray-600">Low Stress (Safe)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ffc107' }}></div>
            <span className="text-sm text-gray-600">Medium Stress (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ff9800' }}></div>
            <span className="text-sm text-gray-600">High Stress (Warning)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#dc3545' }}></div>
            <span className="text-sm text-gray-600">Critical Stress (Danger)</span>
          </div>
        </div>
      </div>

      {/* Component Stress Details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Component Stress Analysis</h3>

        {analysisResult.stresses.map((stress, index) => (
          <div
            key={stress.componentId}
            className="bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800">
                Component {index + 1}
              </span>
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: stress.stressColor }}
                title={`Stress level: ${stress.avgStress.toFixed(2)} MPa`}
              ></div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Max Stress:</span>
                <span className="font-medium">{stress.maxStress.toFixed(2)} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Stress:</span>
                <span className="font-medium">{stress.avgStress.toFixed(2)} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Stress:</span>
                <span className="font-medium">{stress.minStress.toFixed(2)} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Safety Factor:</span>
                <span className={`font-medium ${
                  stress.safetyFactor >= 2 ? 'text-green-600' :
                  stress.safetyFactor >= 1.5 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stress.safetyFactor.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
