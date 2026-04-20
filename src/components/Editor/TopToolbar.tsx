import React from 'react';
import { useStore } from '../../store/useStore';
import { IOS_SIZES, ANDROID_SIZES } from '../../types';
import {
  Undo2,
  Redo2,
  Copy,
  Eye,
  Download,
  Apple,
  Smartphone,
  ChevronDown,
  Home,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Layers,
  Magnet,
  Film,
  PanelRight,
} from 'lucide-react';

interface TopToolbarProps {
  onExport: () => void;
  onAIGenerate: () => void;
  onPreview: () => void;
  onToggleFilmstrip: () => void;
  onToggleRightSidebar: () => void;
  showFilmstrip: boolean;
  showRightSidebar: boolean;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ 
  onExport, 
  onAIGenerate, 
  onPreview,
  onToggleFilmstrip,
  onToggleRightSidebar,
  showFilmstrip,
  showRightSidebar,
}) => {
  const {
    currentProject,
    currentPlatform,
    currentSizeId,
    showSafeAreas,
    showGrid,
    zoom,
    undo,
    redo,
    setCurrentPlatform,
    setCurrentSizeId,
    setShowSafeAreas,
    setShowGrid,
    setZoom,
    setView,
    duplicateScreenshot,
    currentScreenshot,
    pushHistory,
  } = useStore();

  const sizes = currentPlatform === 'ios' ? IOS_SIZES : ANDROID_SIZES;
  const currentSize = sizes.find(s => s.id === currentSizeId) || sizes[0];

  const handleDuplicate = () => {
    if (currentScreenshot) {
      pushHistory();
      duplicateScreenshot(currentScreenshot.id);
    }
  };

  return (
    <div className="h-12 flex items-center justify-between px-4" style={{ backgroundColor: '#161b22', borderBottom: '1px solid #30363d' }}>
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Back to Dashboard */}
        <button
          onClick={() => setView('dashboard')}
          className="p-2 rounded-md transition-colors hover:bg-[#21262d]"
          title="Back to Dashboard"
          style={{ color: '#8b949e' }}
        >
          <Home className="w-[18px] h-[18px]" />
        </button>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Project Name */}
        <div className="flex items-center gap-2">
          <Layers className="w-[18px] h-[18px]" style={{ color: '#1f6feb' }} />
          <span className="text-sm font-medium" style={{ color: '#e6edf3' }}>{currentProject?.name || 'Untitled'}</span>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
            title="Undo (Ctrl+Z)"
            style={{ color: '#8b949e' }}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
            title="Redo (Ctrl+Y)"
            style={{ color: '#8b949e' }}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Duplicate */}
        <button
          onClick={handleDuplicate}
          className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
          title="Duplicate Screen"
          style={{ color: '#8b949e' }}
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {/* Center Section - Platform & Size Selector */}
      <div className="flex items-center gap-3">
        {/* Platform Toggle */}
        <div className="flex items-center rounded-md p-0.5" style={{ backgroundColor: '#0d1117' }}>
          <button
            onClick={() => setCurrentPlatform('ios')}
            className={`px-3 py-1 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
              currentPlatform === 'ios'
                ? 'bg-[#238636] text-white'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            iOS
          </button>
          <button
            onClick={() => setCurrentPlatform('android')}
            className={`px-3 py-1 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
              currentPlatform === 'android'
                ? 'bg-[#238636] text-white'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Android
          </button>
        </div>

        {/* Size Selector */}
        <div className="relative group">
          <button className="px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors hover:bg-[#21262d]" style={{ backgroundColor: '#0d1117', color: '#c9d1d9' }}>
            {currentSize.name}
            <ChevronDown className="w-4 h-4" style={{ color: '#8b949e' }} />
          </button>
          <div className="absolute top-full left-0 mt-1 rounded-md shadow-xl z-50 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
            {sizes.map(size => (
              <button
                key={size.id}
                onClick={() => setCurrentSizeId(size.id)}
                className="w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-md last:rounded-b-md hover:bg-[#21262d]"
                style={{
                  color: size.id === currentSizeId ? '#1f6feb' : '#c9d1d9'
                }}
              >
                {size.name}
                <span className="text-xs ml-2" style={{ color: '#6e7681' }}>
                  {size.width}×{size.height}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Panel Toggles */}
        <div className="flex items-center gap-0.5 rounded-md p-0.5" style={{ backgroundColor: '#0d1117' }}>
          <button
            onClick={onToggleFilmstrip}
            className={`p-1.5 rounded transition-colors ${
              showFilmstrip ? 'text-white' : 'text-[#8b949e]'
            }`}
            style={showFilmstrip ? { backgroundColor: '#1f6feb' } : {}}
            title="Toggle Screens Panel (Ctrl+I)"
          >
            <Film className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleRightSidebar}
            className={`p-1.5 rounded transition-colors ${
              showRightSidebar ? 'text-white' : 'text-[#8b949e]'
            }`}
            style={showRightSidebar ? { backgroundColor: '#1f6feb' } : {}}
            title="Toggle Properties Panel"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Zoom */}
        <div className="flex items-center gap-1 rounded-md px-2 py-1" style={{ backgroundColor: '#0d1117' }}>
          <button
            onClick={() => setZoom(zoom - 0.1)}
            className="p-1 rounded transition-colors hover:bg-[#21262d]"
            style={{ color: '#8b949e' }}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <input
            type="range"
            min="10"
            max="200"
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
            className="w-16 h-1 rounded-lg appearance-none cursor-pointer"
            style={{ backgroundColor: '#30363d', accentColor: '#1f6feb' }}
          />
          <button
            onClick={() => setZoom(zoom + 0.1)}
            className="p-1 rounded transition-colors hover:bg-[#21262d]"
            style={{ color: '#8b949e' }}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs w-10 text-center" style={{ color: '#8b949e' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Grid Toggle */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="p-1.5 rounded-md transition-colors"
          style={showGrid ? { backgroundColor: 'rgba(31, 111, 235, 0.2)', color: '#1f6feb' } : { color: '#8b949e' }}
          title="Toggle Grid (Snap)"
        >
          <Magnet className="w-4 h-4" />
        </button>

        {/* Safe Areas Toggle */}
        <button
          onClick={() => setShowSafeAreas(!showSafeAreas)}
          className="p-1.5 rounded-md transition-colors"
          style={showSafeAreas ? { backgroundColor: 'rgba(31, 111, 235, 0.2)', color: '#1f6feb' } : { color: '#8b949e' }}
          title="Toggle Safe Areas"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        {/* Preview */}
        <button
          onClick={onPreview}
          className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
          title="Store Preview"
          style={{ color: '#8b949e' }}
        >
          <Eye className="w-4 h-4" />
        </button>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Export */}
        <button 
          onClick={onExport}
          className="px-4 py-1.5 rounded-md font-medium flex items-center gap-2 text-sm transition-all hover:brightness-110"
          style={{ backgroundColor: '#238636', color: 'white' }}
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};
