import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TextElement, DeviceElement, ShapeElement, ImageElement } from '../../types';
import { Tooltip } from './Tooltip';
import { Accordion } from '../ui/Accordion';
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Trash2,
  Copy,
  Settings,
  Smartphone,
  Image as ImageIcon,
  Square,
  Sparkles,
  Check,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const AI_HEADLINES = [
  "Plan Your Day Effortlessly",
  "Never Miss a Task Again",
  "Simplify Your Workflow",
  "Stay Organized, Stay Ahead",
  "Your Personal Assistant",
  "Work Smarter, Not Harder",
  "Everything in One Place",
  "Boost Your Productivity",
];

const FONT_FAMILIES = [
  'Inter, system-ui, sans-serif',
  'Georgia, serif',
  'Monaco, monospace',
  'Arial, sans-serif',
  'Verdana, sans-serif',
];

const FONT_WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extrabold' },
];

export const RightSidebar: React.FC = () => {
  const {
    selectedElements,
    updateElement,
    deleteElement,
    deleteSelectedElements,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    addElement,
    currentScreenshot,
    pushHistory,
    uiMode,
  } = useStore();

  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;
  const multipleSelected = selectedElements.length > 1;

  if (selectedElements.length === 0) {
    return (
      <div className="w-72 flex flex-col" style={{ backgroundColor: '#161b22', borderLeft: '1px solid #30363d' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #30363d' }}>
          <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: '#c9d1d9' }}>
            <Settings className="w-4 h-4" />
            Properties
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center" style={{ color: '#6e7681' }}>
            <Square className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select an element to edit</p>
            <p className="text-xs mt-2" style={{ color: '#484f58' }}>Shift+click to multi-select</p>
          </div>
        </div>
      </div>
    );
  }

  if (multipleSelected) {
    return (
      <div className="w-72 flex flex-col" style={{ backgroundColor: '#161b22', borderLeft: '1px solid #30363d' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #30363d' }}>
          <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: '#c9d1d9' }}>
            <Settings className="w-4 h-4" />
            {selectedElements.length} Elements Selected
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center mb-6" style={{ color: '#8b949e' }}>
            <Copy className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Multiple elements selected</p>
            <p className="text-xs mt-1" style={{ color: '#6e7681' }}>Use keyboard to nudge</p>
          </div>
        </div>
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid #30363d' }}>
          <div className="flex gap-2">
            <Tooltip text="Bring all selected to front">
              <button
                onClick={() => {
                  pushHistory();
                  selectedElements.forEach(el => bringToFront(el.id));
                }}
                className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
                style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
              >
                <ChevronsUp className="w-4 h-4" />
                To Front
              </button>
            </Tooltip>
            <Tooltip text="Send all selected to back">
              <button
                onClick={() => {
                  pushHistory();
                  selectedElements.forEach(el => sendToBack(el.id));
                }}
                className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
                style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
              >
                <ChevronsDown className="w-4 h-4" />
                To Back
              </button>
            </Tooltip>
          </div>
          <Tooltip text="Delete all selected elements">
            <button
              onClick={() => {
                pushHistory();
                deleteSelectedElements();
              }}
              className="w-full px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: 'rgba(248, 81, 73, 0.1)', color: '#f85149' }}
            >
              <Trash2 className="w-4 h-4" />
              Delete All Selected
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }

  const handleDuplicate = () => {
    if (!currentScreenshot || !selectedElement) return;
    
    pushHistory();
    const newElement = {
      ...selectedElement,
      id: uuidv4(),
      x: (selectedElement as any).x + 20,
      y: (selectedElement as any).y + 20,
    };
    addElement(newElement);
  };

  const renderTextProperties = (element: TextElement) => (
    <div className="space-y-4">
      {/* Content */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Content</label>
        <textarea
          value={element.content}
          onChange={(e) => {
            updateElement(element.id, { content: e.target.value });
          }}
          className="w-full px-3 py-2 rounded-lg text-sm resize-none"
          style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
          rows={3}
        />

        {/* AI Suggestions */}
        <Tooltip text="Generate AI headline ideas">
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="mt-2 w-full px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
            style={{ backgroundColor: 'rgba(31, 111, 235, 0.1)', color: '#1f6feb' }}
          >
            <Sparkles className="w-4 h-4" />
            AI Suggestions
          </button>
        </Tooltip>

        {showAISuggestions && (
          <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
            {AI_HEADLINES.map((headline, i) => (
              <Tooltip key={i} text="Apply this headline">
                <button
                  onClick={() => {
                    updateElement(element.id, { content: headline });
                    setShowAISuggestions(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left text-sm transition-colors"
                  style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
                >
                  {headline}
                </button>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Font Family</label>
        <select
          value={element.fontFamily}
          onChange={(e) => {
            updateElement(element.id, { fontFamily: e.target.value });
          }}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
        >
          {FONT_FAMILIES.map(font => (
            <option key={font} value={font}>{font.split(',')[0]}</option>
          ))}
        </select>
      </div>

      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Size</label>
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => {
              updateElement(element.id, { fontSize: parseInt(e.target.value) || 16 });
            }}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Weight</label>
          <select
            value={element.fontWeight}
            onChange={(e) => {
              updateElement(element.id, { fontWeight: e.target.value });
            }}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
          >
            {FONT_WEIGHTS.map(w => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => {
              updateElement(element.id, { color: e.target.value });
            }}
            className="w-12 h-10 rounded-lg cursor-pointer border-0"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => {
              updateElement(element.id, { color: e.target.value });
            }}
            className="flex-1 px-3 py-2 rounded-lg text-sm uppercase"
            style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Alignment</label>
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: '#21262d' }}>
          {[
            { value: 'left', icon: AlignLeft, label: 'Align Left' },
            { value: 'center', icon: AlignCenter, label: 'Align Center' },
            { value: 'right', icon: AlignRight, label: 'Align Right' },
          ].map(({ value, icon: Icon, label }) => (
            <Tooltip key={value} text={label}>
              <button
                onClick={() => {
                  updateElement(element.id, { textAlign: value as any });
                }}
                className="flex-1 p-2 rounded-md transition-colors w-full"
                style={
                  element.textAlign === value
                    ? { backgroundColor: '#1f6feb', color: 'white' }
                    : { color: '#8b949e' }
                }
              >
                <Icon className="w-4 h-4 mx-auto" />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Auto-fit Text (visible in both modes, but disabled in simple mode) */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm" style={{ color: '#c9d1d9' }}>Auto-fit Text</span>
          <Tooltip text="Automatically reduce font size to fit container width">
            <button
              onClick={() => updateElement(element.id, { autoFit: !element.autoFit })}
              className="w-12 h-6 rounded-full transition-colors"
              style={element.autoFit ? { backgroundColor: '#1f6feb' } : { backgroundColor: '#30363d' }}
              disabled={uiMode === 'simple'}
            >
              <div
                className="w-5 h-5 bg-white rounded-full transform transition-transform"
                style={
                  element.autoFit
                    ? { transform: 'translateX(24px)' }
                    : { transform: 'translateX(2px)' }
                }
              />
            </button>
          </Tooltip>
        </label>
      </div>

      {/* Advanced Properties Accordion - only visible in advanced mode */}
      {uiMode === 'advanced' && (
        <Accordion title="Advanced Typography" defaultOpen={false}>
          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Line Height</label>
              <input
                type="number"
                step="0.1"
                value={element.lineHeight}
                onChange={(e) => {
                  updateElement(element.id, { lineHeight: parseFloat(e.target.value) || 1.2 });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Letter Spacing</label>
              <input
                type="number"
                step="0.5"
                value={element.letterSpacing}
                onChange={(e) => {
                  updateElement(element.id, { letterSpacing: parseFloat(e.target.value) || 0 });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
              />
            </div>
          </div>
        </Accordion>
      )}
    </div>
  );

  const renderDeviceProperties = (element: DeviceElement) => {
    const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateElement(element.id, { screenshotSrc: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };

    const basicContent = (
      <>
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="hidden"
            id="screenshot-upload"
          />
          <Tooltip text="Upload screenshot to device">
            <label
              htmlFor="screenshot-upload"
              className="block w-full aspect-[9/16] rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors"
              style={{ borderColor: '#30363d', backgroundColor: '#21262d' }}
            >
              {element.screenshotSrc ? (
                <img
                  src={element.screenshotSrc}
                  alt="Screenshot"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: '#8b949e' }}>
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-sm">Upload Screenshot</span>
                </div>
              )}
            </label>
          </Tooltip>
        </div>

        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm" style={{ color: '#c9d1d9' }}>Show Device Frame</span>
            <Tooltip text="Toggle device frame visibility">
              <button
                onClick={() => {
                  updateElement(element.id, { showFrame: !element.showFrame });
                }}
                className="w-12 h-6 rounded-full transition-colors"
                style={element.showFrame ? { backgroundColor: '#1f6feb' } : { backgroundColor: '#30363d' }}
              >
                <div
                  className="w-5 h-5 bg-white rounded-full transform transition-transform"
                  style={
                    element.showFrame
                      ? { transform: 'translateX(24px)' }
                      : { transform: 'translateX(2px)' }
                  }
                />
              </button>
            </Tooltip>
          </label>
        </div>

        {/* Rotation Control */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Rotation</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              value={element.rotation || 0}
              onChange={(e) => {
                updateElement(element.id, { rotation: parseInt(e.target.value) });
              }}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right" style={{ color: '#c9d1d9' }}>
              {element.rotation || 0}°
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            {[-90, -45, 0, 45, 90].map((angle) => (
              <Tooltip key={angle} text={`Set rotation to ${angle}°`}>
                <button
                  onClick={() => updateElement(element.id, { rotation: angle })}
                  className="flex-1 px-2 py-1 rounded text-xs transition-colors"
                  style={{
                    backgroundColor: element.rotation === angle ? '#1f6feb' : '#21262d',
                    color: element.rotation === angle ? '#fff' : '#8b949e'
                  }}
                >
                  {angle}°
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </>
    );

    const advancedContent = (
      <>
        {/* Screenshot Scale Control - ONLY for realistic devices with screenshots */}
        {element.renderMode === 'realistic' && element.screenshotSrc && (
          <div className="pt-4 border-t border-[#30363d]">
            <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Screenshot Zoom</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.01"
                value={(element as any).screenshotScale || 1}
                onChange={(e) => {
                  updateElement(element.id, { ...element, screenshotScale: parseFloat(e.target.value) });
                }}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right" style={{ color: '#c9d1d9' }}>
                {Math.round(((element as any).screenshotScale || 1) * 100)}%
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <Tooltip text="Reset screenshot position and scale">
                <button
                  onClick={() => updateElement(element.id, {
                    ...element,
                    screenshotScale: 1,
                    screenshotOffsetX: 0,
                    screenshotOffsetY: 0
                  })}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #30363d' }}
                >
                  Reset All
                </button>
              </Tooltip>
              <Tooltip text="Remove screenshot from device">
                <button
                  onClick={() => updateElement(element.id, { ...element, screenshotSrc: '' })}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ backgroundColor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)' }}
                >
                  Remove
                </button>
              </Tooltip>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: '#6e7681' }}>Offset X</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    value={(element as any).screenshotOffsetX || 0}
                    onChange={(e) => {
                      updateElement(element.id, { ...element, screenshotOffsetX: parseInt(e.target.value) });
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right" style={{ color: '#c9d1d9' }}>
                    {Math.round((element as any).screenshotOffsetX || 0)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: '#6e7681' }}>Offset Y</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    value={(element as any).screenshotOffsetY || 0}
                    onChange={(e) => {
                      updateElement(element.id, { ...element, screenshotOffsetY: parseInt(e.target.value) });
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right" style={{ color: '#c9d1d9' }}>
                    {Math.round((element as any).screenshotOffsetY || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Mode Control - Hidden for realistic devices */}
        {element.renderMode !== 'realistic' && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Render Mode</label>
            <div className="flex gap-2">
              <Tooltip text="Switch to 2D rendering">
                <button
                  onClick={() => updateElement(element.id, { renderMode: '2d' })}
                  className="flex-1 px-3 py-2 rounded-lg text-sm transition-colors w-full"
                  style={{
                    backgroundColor: element.renderMode === '2d' ? '#1f6feb' : '#21262d',
                    color: element.renderMode === '2d' ? '#fff' : '#8b949e'
                  }}
                >
                   2D
                </button>
              </Tooltip>
              <Tooltip text="Switch to 3D rendering">
                <button
                  onClick={() => updateElement(element.id, { renderMode: '3d' })}
                  className="flex-1 px-3 py-2 rounded-lg text-sm transition-colors w-full"
                  style={{
                    backgroundColor: element.renderMode === '3d' ? '#1f6feb' : '#21262d',
                    color: element.renderMode === '3d' ? '#fff' : '#8b949e'
                  }}
                >
                   3D
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Orientation Control (only for 2D mode, not realistic) */}
        {element.renderMode === '2d' && element.renderMode !== 'realistic' && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Orientation</label>
            <div className="flex gap-2">
              <Tooltip text="Portrait orientation">
                <button
                  onClick={() => updateElement(element.id, { orientation: 'portrait' })}
                  className="flex-1 px-2 py-2 rounded-lg text-xs transition-colors flex flex-col items-center w-full"
                  style={{
                    backgroundColor: element.orientation === 'portrait' ? '#1f6feb' : '#21262d',
                    color: element.orientation === 'portrait' ? '#fff' : '#8b949e'
                  }}
                >
                  <span className="text-lg mb-1">📱</span>
                  Portrait
                </button>
              </Tooltip>
              <Tooltip text="Landscape Left orientation">
                <button
                  onClick={() => updateElement(element.id, { orientation: 'landscape-left' })}
                  className="flex-1 px-2 py-2 rounded-lg text-xs transition-colors flex flex-col items-center w-full"
                  style={{
                    backgroundColor: element.orientation === 'landscape-left' ? '#1f6feb' : '#21262d',
                    color: element.orientation === 'landscape-left' ? '#fff' : '#8b949e'
                  }}
                >
                  <span className="text-lg mb-1">↙️</span>
                  Landscape L
                </button>
              </Tooltip>
              <Tooltip text="Landscape Right orientation">
                <button
                  onClick={() => updateElement(element.id, { orientation: 'landscape-right' })}
                  className="flex-1 px-2 py-2 rounded-lg text-xs transition-colors flex flex-col items-center w-full"
                  style={{
                    backgroundColor: element.orientation === 'landscape-right' ? '#1f6feb' : '#21262d',
                    color: element.orientation === 'landscape-right' ? '#fff' : '#8b949e'
                  }}
                >
                  <span className="text-lg mb-1">↘️</span>
                  Landscape R
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* 3D Camera Angle Control (only for 3D mode) */}
        {element.renderMode === '3d' && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Camera Angle</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'front', label: 'Front' },
                { id: 'tilt-left', label: 'Tilt Left' },
                { id: 'tilt-right', label: 'Tilt Right' },
                { id: 'isometric', label: 'Isometric' },
              ].map((angle) => (
                <Tooltip key={angle.id} text={`Camera: ${angle.label}`}>
                  <button
                    onClick={() => updateElement(element.id, { cameraAngle: angle.id as any })}
                    className="px-3 py-2 rounded-lg text-xs transition-colors w-full"
                    style={{
                      backgroundColor: element.cameraAngle === angle.id ? '#1f6feb' : '#21262d',
                      color: element.cameraAngle === angle.id ? '#fff' : '#8b949e'
                    }}
                  >
                    {angle.label}
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </>
    );

    return (
      <div className="space-y-4">
        {basicContent}
        {uiMode === 'advanced' && (
          <Accordion title="Advanced Device Settings" defaultOpen={false}>
            {advancedContent}
          </Accordion>
        )}
      </div>
    );
  };

  const renderShapeProperties = (element: ShapeElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Fill Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.fill.replace(/[^#\w]/g, '').slice(0, 7)}
            onChange={(e) => {
              updateElement(element.id, { fill: e.target.value });
            }}
            className="w-12 h-10 rounded-lg cursor-pointer border-0"
          />
          <input
            type="text"
            value={element.fill}
            onChange={(e) => {
              updateElement(element.id, { fill: e.target.value });
            }}
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
          />
        </div>
      </div>

      {element.shapeType === 'rounded-rect' && (
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Border Radius</label>
          <input
            type="range"
            min="0"
            max="100"
            value={element.borderRadius || 0}
            onChange={(e) => {
              updateElement(element.id, { borderRadius: parseInt(e.target.value) });
            }}
            className="w-full"
            style={{ accentColor: '#1f6feb' }}
          />
          <div className="text-right text-xs mt-1" style={{ color: '#8b949e' }}>{element.borderRadius || 0}px</div>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Stroke</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.stroke || '#ffffff'}
            onChange={(e) => {
              updateElement(element.id, { stroke: e.target.value });
            }}
            className="w-12 h-10 rounded-lg cursor-pointer border-0"
          />
          <input
            type="number"
            placeholder="Width"
            value={element.strokeWidth || 0}
            onChange={(e) => {
              updateElement(element.id, { strokeWidth: parseInt(e.target.value) || 0 });
            }}
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
          />
        </div>
      </div>
    </div>
  );

  const renderImageProperties = (element: ImageElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8b949e' }}>Object Fit</label>
        <select
          value={element.objectFit}
          onChange={(e) => {
            updateElement(element.id, { objectFit: e.target.value as any });
          }}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
        </select>
      </div>
    </div>
  );

  const getElementIcon = () => {
    switch (selectedElement?.type) {
      case 'text': return Type;
      case 'device': return Smartphone;
      case 'image': return ImageIcon;
      case 'shape': return Square;
      default: return Square;
    }
  };

  const ElementIcon = getElementIcon();

  return (
    <div className="w-72 flex flex-col" style={{ backgroundColor: '#161b22', borderLeft: '1px solid #30363d' }}>
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid #30363d' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: '#c9d1d9' }}>
            <ElementIcon className="w-4 h-4" />
            {selectedElement?.type.charAt(0).toUpperCase()}{selectedElement?.type.slice(1)} Properties
          </h2>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-xs font-medium uppercase mb-3" style={{ color: '#6e7681' }}>Position & Size</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#8b949e' }}>X</label>
              <input
                type="number"
                value={Math.round(selectedElement?.x || 0)}
                onChange={(e) => {
                  updateElement(selectedElement!.id, { x: parseInt(e.target.value) || 0 });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#8b949e' }}>Y</label>
              <input
                type="number"
                value={Math.round(selectedElement?.y || 0)}
                onChange={(e) => {
                  updateElement(selectedElement!.id, { y: parseInt(e.target.value) || 0 });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#8b949e' }}>Width</label>
              <input
                type="number"
                value={Math.round(selectedElement?.width || 50)}
                onChange={(e) => {
                  updateElement(selectedElement!.id, { width: parseInt(e.target.value) || 50 });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#8b949e' }}>Height</label>
              <input
                type="number"
                value={Math.round(selectedElement?.height || 30)}
                onChange={(e) => {
                  updateElement(selectedElement!.id, { height: parseInt(e.target.value) || 30 });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
              />
            </div>
          </div>
        </div>

        {selectedElement?.type === 'text' && renderTextProperties(selectedElement as TextElement)}
        {selectedElement?.type === 'device' && renderDeviceProperties(selectedElement as DeviceElement)}
        {selectedElement?.type === 'shape' && renderShapeProperties(selectedElement as ShapeElement)}
        {selectedElement?.type === 'image' && renderImageProperties(selectedElement as ImageElement)}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid #30363d' }}>
        <div className="flex gap-2">
          <Tooltip text="Bring to very front">
            <button
              onClick={() => bringToFront(selectedElement!.id)}
              className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
              style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
            >
              <ChevronsUp className="w-4 h-4" />
              Front
            </button>
          </Tooltip>
          <Tooltip text="Move one layer forward">
            <button
              onClick={() => bringForward(selectedElement!.id)}
              className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
              style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
            >
              <ChevronUp className="w-4 h-4" />
              Forward
            </button>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Tooltip text="Move one layer backward">
            <button
              onClick={() => sendBackward(selectedElement!.id)}
              className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
              style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
            >
              <ChevronDown className="w-4 h-4" />
              Backward
            </button>
          </Tooltip>
          <Tooltip text="Send to very back">
            <button
              onClick={() => sendToBack(selectedElement!.id)}
              className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
              style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
            >
              <ChevronsDown className="w-4 h-4" />
              Back
            </button>
          </Tooltip>
        </div>

        <div className="flex gap-2">
          <Tooltip text="Duplicate element">
            <button
              onClick={handleDuplicate}
              className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
              style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
          </Tooltip>
          <Tooltip text="Delete element">
            <button
              onClick={() => {
                pushHistory();
                deleteElement(selectedElement!.id);
              }}
              className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full"
              style={{ backgroundColor: 'rgba(248, 81, 73, 0.1)', color: '#f85149' }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
