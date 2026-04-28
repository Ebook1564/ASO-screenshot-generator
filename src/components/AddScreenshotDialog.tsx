import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Layers, Monitor } from 'lucide-react';

interface AddScreenshotDialogProps {
  projectId: string;
  onClose: () => void;
}

export const AddScreenshotDialog: React.FC<AddScreenshotDialogProps> = ({ projectId, onClose }) => {
  const { projects, createScreenshot } = useStore();
  const [mode, setMode] = useState<'separate' | 'same-canvas'>('separate');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  // Find existing screenshot groups
  const groups = project.screenshots.reduce((acc, s) => {
    const groupId = (s as any).screenshotGroupId || s.id;
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(s);
    return acc;
  }, {} as Record<string, any[]>);

  const groupOptions = Object.entries(groups).map(([groupId, screens]) => ({
    groupId,
    label: screens.length > 1
      ? `${screens[0]?.name || 'Screen'} + ${screens.length - 1} more`
      : screens[0]?.name || 'Screen',
    count: screens.length,
  }));

  const handleCreate = () => {
    if (mode === 'same-canvas' && selectedGroupId) {
      createScreenshot(selectedGroupId);
    } else {
      createScreenshot();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="rounded-2xl p-6 w-96 space-y-4"
        style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold" style={{ color: '#e6edf3' }}>Add New Screenshot</h3>

        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: mode === 'separate' ? 'rgba(31, 111, 235, 0.1)' : '#21262d',
              border: `1px solid ${mode === 'separate' ? '#1f6feb' : '#30363d'}`,
            }}
            onClick={() => setMode('separate')}
          >
            <Monitor className="w-5 h-5" style={{ color: '#1f6feb' }} />
            <div>
              <div className="font-medium" style={{ color: '#e6edf3' }}>Separate Canvas</div>
              <div className="text-xs" style={{ color: '#8b949e' }}>Create a new independent screenshot</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: mode === 'same-canvas' ? 'rgba(31, 111, 235, 0.1)' : '#21262d',
              border: `1px solid ${mode === 'same-canvas' ? '#1f6feb' : '#30363d'}`,
            }}
            onClick={() => setMode('same-canvas')}
          >
            <Layers className="w-5 h-5" style={{ color: '#1f6feb' }} />
            <div>
              <div className="font-medium" style={{ color: '#e6edf3' }}>Same Canvas Group</div>
              <div className="text-xs" style={{ color: '#8b949e' }}>Add to existing screenshot group for syncing</div>
            </div>
          </label>
        </div>

        {/* Group Selection (only in same-canvas mode) */}
        {mode === 'same-canvas' && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Select Group</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {groupOptions.map(opt => (
                <button
                  key={opt.groupId}
                  onClick={() => setSelectedGroupId(opt.groupId)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: selectedGroupId === opt.groupId ? 'rgba(31, 111, 235, 0.2)' : '#21262d',
                    color: '#c9d1d9',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sync Properties Checkbox (only in same-canvas mode) */}
        {mode === 'same-canvas' && selectedGroupId && (
          <div className="text-xs p-3 rounded-lg" style={{ backgroundColor: '#21262d', color: '#8b949e' }}>
            <strong style={{ color: '#c9d1d9' }}>Sync enabled:</strong> Background and elements will sync with other screens in this group.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: '#1f6feb',
              color: 'white',
              opacity: mode === 'same-canvas' && !selectedGroupId ? 0.5 : 1,
            }}
            disabled={mode === 'same-canvas' && !selectedGroupId}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Screenshot
          </button>
        </div>
      </div>
    </div>
  );
};
