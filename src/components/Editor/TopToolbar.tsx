import React from 'react';
import { useStore } from '../../store/useStore';
import { IOS_SIZES, ANDROID_SIZES } from '../../types';
import { Tooltip } from './Tooltip';
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
  LayoutTemplate,
  Save,
  CheckSquare,
  SlidersHorizontal,
  Grid2X2,
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
    saveAsTemplate,
    uiMode,
    setUiMode,
    panoramicMode,
    setPanoramicMode,
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
        <Tooltip text="Back to Dashboard">
          <button
            onClick={() => setView('dashboard')}
            className="p-2 rounded-md transition-colors hover:bg-[#21262d]"
            style={{ color: '#8b949e' }}
          >
            <Home className="w-[18px] h-[18px]" />
          </button>
        </Tooltip>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Project Name */}
        <div className="flex items-center gap-2">
          <Layers className="w-[18px] h-[18px]" style={{ color: '#1f6feb' }} />
          <span className="text-sm font-medium" style={{ color: '#e6edf3' }}>{currentProject?.name || 'Untitled'}</span>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Tooltip text="Undo (Ctrl+Z)">
            <button
              onClick={undo}
              className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
              style={{ color: '#8b949e' }}
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Redo (Ctrl+Y)">
            <button
              onClick={redo}
              className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
              style={{ color: '#8b949e' }}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Duplicate */}
        <Tooltip text="Duplicate Screen">
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
            style={{ color: '#8b949e' }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Sync Properties */}
        {currentScreenshot?.screenshotGroupId && currentProject?.screenshots.filter(s => (s as any).screenshotGroupId === currentScreenshot.screenshotGroupId).length > 1 && (
          <Tooltip text="Sync properties to group">
            <button
              onClick={() => {
                const groupId = currentScreenshot.screenshotGroupId;
                const groupScreens = currentProject.screenshots.filter(s => (s as any).screenshotGroupId === groupId);
                const { syncScreenshotProperties } = useStore.getState();
                syncScreenshotProperties(currentScreenshot.id, groupScreens.map(s => s.id));
              }}
              className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
              style={{ color: '#1f6feb' }}
            >
              <Layers className="w-4 h-4" />
            </button>
          </Tooltip>
        )}

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Save as Template */}
        <Tooltip text="Save as Template">
          <button
            onClick={() => {
              const name = prompt('Template Name:');
              if (name) saveAsTemplate(name, 'creative', '');
            }}
            className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
            style={{ color: '#8b949e' }}
          >
            <LayoutTemplate className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Center Section - Platform & Size Selector */}
      <div className="flex items-center gap-3">
        {/* Platform Toggle */}
        <div className="flex items-center rounded-md p-0.5" style={{ backgroundColor: '#0d1117' }}>
          <Tooltip text="Switch to iOS">
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
          </Tooltip>
          <Tooltip text="Switch to Android">
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
          </Tooltip>
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
          <Tooltip text="Toggle Screens Panel">
            <button
              onClick={onToggleFilmstrip}
              className={`p-1.5 rounded transition-colors ${
                showFilmstrip ? 'text-white' : 'text-[#8b949e]'
              }`}
              style={showFilmstrip ? { backgroundColor: '#1f6feb' } : {}}
            >
              <Film className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Toggle Properties Panel">
            <button
              onClick={onToggleRightSidebar}
              className={`p-1.5 rounded transition-colors ${
                showRightSidebar ? 'text-white' : 'text-[#8b949e]'
              }`}
              style={showRightSidebar ? { backgroundColor: '#1f6feb' } : {}}
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 rounded-md px-2 py-1" style={{ backgroundColor: '#0d1117' }}>
          <Tooltip text="Zoom Out">
            <button
              onClick={() => setZoom(zoom - 0.1)}
              className="p-1 rounded transition-colors hover:bg-[#21262d]"
              style={{ color: '#8b949e' }}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <input
            type="range"
            min="10"
            max="200"
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
            className="w-16 h-1 rounded-lg appearance-none cursor-pointer"
            style={{ backgroundColor: '#30363d', accentColor: '#1f6feb' }}
          />
          <Tooltip text="Zoom In">
            <button
              onClick={() => setZoom(zoom + 0.1)}
              className="p-1 rounded transition-colors hover:bg-[#21262d]"
              style={{ color: '#8b949e' }}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <span className="text-xs w-10 text-center" style={{ color: '#8b949e' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Grid Toggle */}
        <Tooltip text="Toggle grid alignment">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="p-1.5 rounded-md transition-colors"
            style={showGrid ? { backgroundColor: 'rgba(31, 111, 235, 0.2)', color: '#1f6feb' } : { color: '#8b949e' }}
          >
            <Magnet className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Panoramic Mode Toggle */}
        <Tooltip text="Toggle panoramic edge-to-edge snap">
          <button
            onClick={() => setPanoramicMode(!panoramicMode)}
            className="p-1.5 rounded-md transition-colors"
            style={panoramicMode ? { backgroundColor: 'rgba(31, 111, 235, 0.2)', color: '#1f6feb' } : { color: '#8b949e' }}
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Design Audit Toggle */}
        <Tooltip text="Show ASO safe zones">
          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className="p-1.5 rounded-md transition-colors"
            style={showSafeAreas ? { backgroundColor: 'rgba(31, 111, 235, 0.2)', color: '#1f6feb' } : { color: '#8b949e' }}
          >
            <CheckSquare className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* UI Mode Toggle */}
        <Tooltip text={uiMode === 'simple' ? 'Switch to Advanced mode' : 'Switch to Simple mode'}>
          <button
            onClick={() => setUiMode(uiMode === 'simple' ? 'advanced' : 'simple')}
            className="p-1.5 rounded-md transition-colors flex items-center gap-1"
            style={uiMode === 'advanced' ? { backgroundColor: 'rgba(31, 111, 235, 0.2)', color: '#1f6feb' } : { color: '#8b949e' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs">{uiMode === 'simple' ? 'Simple' : 'Advanced'}</span>
          </button>
        </Tooltip>

        {/* Preview */}
        <Tooltip text="Store Preview">
          <button
            onClick={onPreview}
            className="p-1.5 rounded-md transition-colors hover:bg-[#21262d]"
            style={{ color: '#8b949e' }}
          >
            <Eye className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px h-5" style={{ backgroundColor: '#30363d' }} />

        {/* Export */}
        <Tooltip text="Export your screenshots">
          <button 
            onClick={onExport}
            className="px-4 py-1.5 rounded-md font-medium flex items-center gap-2 text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: '#238636', color: 'white' }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
