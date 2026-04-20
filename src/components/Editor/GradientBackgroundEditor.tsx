import React, { useState, useRef } from 'react';
import { Background, GradientColorStop, SOLID_COLORS } from '../../types';
import { Zap, Palette, Sparkles, Plus, X, MoveHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface GradientBackgroundEditorProps {
  currentBackground?: Background;
  onChange: (type: 'solid' | 'gradient' | 'image', value: string, colors?: string[]) => void;
}

const DEFAULT_TEMPLATES = [
  { name: 'Ocean', colors: ['#667eea', '#764ba2'], dir: '135deg' },
  { name: 'Sunset', colors: ['#f093fb', '#f5576c'], dir: '135deg' },
  { name: 'Forest', colors: ['#11998e', '#38ef7d'], dir: '135deg' },
  { name: 'Fire', colors: ['#f12711', '#f5af19'], dir: '135deg' },
  { name: 'Purple', colors: ['#7028e4', '#e5b2ca'], dir: '135deg' },
  { name: 'Blue', colors: ['#2193b0', '#6dd5ed'], dir: '135deg' },
  { name: 'Dark', colors: ['#232526', '#414345'], dir: '135deg' },
  { name: 'Peach', colors: ['#ff9a9e', '#fecfef'], dir: '135deg' },
  { name: 'Aurora', colors: ['#00c9ff', '#92fe9d'], dir: '135deg' },
  { name: 'Candy', colors: ['#d53369', '#daae51'], dir: '135deg' },
  { name: 'Deep Sea', colors: ['#2c3e50', '#4ca1af'], dir: '135deg' },
  { name: 'Lemon', colors: ['#ffe259', '#ffa751'], dir: '135deg' },
  { name: 'Love', colors: ['#ff9a9e', '#fecfef'], dir: '180deg' },
  { name: 'Sky', colors: ['#56ccf2', '#2f80ed'], dir: '135deg' },
  { name: 'Royal', colors: ['#141e30', '#243b55'], dir: '135deg' },
  { name: 'Pink Purple', colors: ['#ec008c', '#fc6767'], dir: '135deg' },
  { name: 'Cosmic', colors: ['#2b5876', '#4e4376'], dir: '135deg' },
  { name: 'Mango', colors: ['#ffe259', '#ffa751'], dir: '45deg' },
];

const MULTI_COLOR_TEMPLATES = [
  { name: 'Rainbow', colors: ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#7700ff'], dir: '90deg', stops: [0, 20, 40, 60, 80, 100] },
  { name: 'Heat', colors: ['#000033', '#0000ff', '#00ffff', '#ffff00', '#ff0000'], dir: '180deg', stops: [0, 25, 50, 75, 100] },
  { name: 'Cool', colors: ['#0f2027', '#203a43', '#2c5364', '#11998e', '#38ef7d'], dir: '135deg', stops: [0, 25, 50, 75, 100] },
  { name: 'Spectrum', colors: ['#6a11cb', '#2575fc', '#00d2ff', '#3a7bd5', '#93291a'], dir: '135deg', stops: [0, 25, 50, 75, 100] },
  { name: 'Peach Blend', colors: ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef'], dir: '135deg', stops: [0, 33, 66, 100] },
  { name: 'Night', colors: ['#0f0c29', '#302b63', '#24243e', '#141e30'], dir: '180deg', stops: [0, 33, 66, 100] },
  { name: 'Sunrise', colors: ['#ff512f', '#dd2476', '#ff9a9e', '#fecfef'], dir: '135deg', stops: [0, 33, 66, 100] },
  { name: 'Ocean Deep', colors: ['#1a2980', '#26d0ce', '#48b1bf', '#06beb6'], dir: '180deg', stops: [0, 25, 50, 75, 100] },
];

export const GradientBackgroundEditor: React.FC<GradientBackgroundEditorProps> = ({
  currentBackground,
  onChange,
}) => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [direction, setDirection] = useState('135deg');
  const [colorStops, setColorStops] = useState<GradientColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ]);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const generateGradientCSS = (stops: GradientColorStop[], type: 'linear' | 'radial', dir: string) => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    
    if (type === 'radial') {
      return `radial-gradient(circle, ${stopString})`;
    }
    return `linear-gradient(${dir}, ${stopString})`;
  };

  const handleAddColorStop = () => {
    if (colorStops.length >= 8) return;
    
    const newStops = [...colorStops];
    const positions = newStops.map(s => s.position).sort((a, b) => a - b);
    
    let newPosition = 50;
    for (let i = 0; i < positions.length - 1; i++) {
      const gap = positions[i + 1] - positions[i];
      if (gap > 10) {
        newPosition = positions[i] + gap / 2;
        break;
      }
    }
    
    const newColor = newStops[activeStopIndex ?? 0]?.color || '#ffffff';
    newStops.push({ color: newColor, position: newPosition });
    setColorStops(newStops);
    setActiveStopIndex(newStops.length - 1);
  };

  const handleRemoveColorStop = (index: number) => {
    if (colorStops.length <= 2) return;
    const newStops = colorStops.filter((_, i) => i !== index);
    setColorStops(newStops);
    setActiveStopIndex(null);
  };

  const handleStopPositionChange = (index: number, position: number) => {
    const newStops = [...colorStops];
    newStops[index] = { ...newStops[index], position: Math.max(0, Math.min(100, position)) };
    setColorStops(newStops);
  };

  const handleStopColorChange = (index: number, color: string) => {
    const newStops = [...colorStops];
    newStops[index] = { ...newStops[index], color };
    setColorStops(newStops);
  };

  const applyGradient = () => {
    const css = generateGradientCSS(colorStops, gradientType, direction);
    const colors = colorStops.map(s => s.color);
    onChange('gradient', css, colors);
  };

  const applyMultiColorTemplate = (template: typeof MULTI_COLOR_TEMPLATES[0]) => {
    const stops: GradientColorStop[] = template.colors.map((color, i) => ({
      color,
      position: template.stops[i],
    }));
    setColorStops(stops);
    setDirection(template.dir);
    setGradientType('linear');
    
    const css = generateGradientCSS(stops, 'linear', template.dir);
    onChange('gradient', css, template.colors);
  };

  const previewGradient = generateGradientCSS(colorStops, gradientType, direction);

  return (
    <div className="space-y-6">
      {/* Pre-made Gradient Templates */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
          <Zap className="w-4 h-4" />
          Gradient Templates
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {DEFAULT_TEMPLATES.map((gradient, i) => (
            <button
              key={i}
              onClick={() => {
                setColorStops([
                  { color: gradient.colors[0], position: 0 },
                  { color: gradient.colors[1], position: 100 },
                ]);
                setDirection(gradient.dir);
                onChange('gradient', `linear-gradient(${gradient.dir}, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)`, gradient.colors);
              }}
              className="aspect-[3/2] rounded-lg transition-all hover:scale-105"
              style={{ background: `linear-gradient(${gradient.dir}, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)` }}
              title={gradient.name}
            />
          ))}
        </div>
      </div>

      {/* Multi-Color Templates */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
          <Sparkles className="w-4 h-4" />
          Multi-Color Gradients
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {MULTI_COLOR_TEMPLATES.map((gradient, i) => (
            <button
              key={i}
              onClick={() => applyMultiColorTemplate(gradient)}
              className="aspect-[3/2] rounded-lg transition-all hover:scale-105 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(${gradient.dir}, ${gradient.colors.map((c, j) => `${c} ${gradient.stops[j]}%`).join(', ')})` 
              }}
              title={gradient.name}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Multi-Color Gradient Builder */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
          <MoveHorizontal className="w-4 h-4" />
          Custom Multi-Color
        </h3>
        
        {/* Preview */}
        <div 
          className="w-full h-24 rounded-lg mb-4"
          style={{ background: previewGradient }}
        />
        
        {/* Gradient Type */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setGradientType('linear')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              gradientType === 'linear' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e]'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setGradientType('radial')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              gradientType === 'radial' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e]'
            }`}
          >
            Radial
          </button>
        </div>
        
        {/* Direction (only for linear) */}
        {gradientType === 'linear' && (
          <div className="mb-4">
            <label className="text-xs mb-1 block" style={{ color: '#8b949e' }}>Direction</label>
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
            >
              <option value="0deg">Top to Bottom ↑</option>
              <option value="180deg">Bottom to Top ↓</option>
              <option value="90deg">Left to Right →</option>
              <option value="270deg">Right to Left ←</option>
              <option value="135deg">Diagonal ↘</option>
              <option value="45deg">Diagonal ↗</option>
            </select>
          </div>
        )}
        
        {/* Color Stops Slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs" style={{ color: '#8b949e' }}>Color Stops</label>
            <button
              onClick={handleAddColorStop}
              disabled={colorStops.length >= 8}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3] disabled:opacity-50"
            >
              <Plus className="w-3 h-3" /> Add Color
            </button>
          </div>
          
          {/* Gradient bar with draggable stops */}
          <div 
            ref={sliderRef}
            className="relative h-8 rounded-lg mb-3 cursor-pointer"
            style={{ background: previewGradient }}
            onClick={(e) => {
              if (!sliderRef.current) return;
              const rect = sliderRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = Math.round((x / rect.width) * 100);
              if (activeStopIndex !== null) {
                handleStopPositionChange(activeStopIndex, percent);
              }
            }}
          >
            {colorStops.map((stop, index) => (
              <div
                key={index}
                className={`absolute top-0 w-4 h-8 -ml-2 cursor-ew-resize rounded transition-transform ${
                  activeStopIndex === index ? 'bg-white scale-125 z-10' : 'bg-white/80 hover:scale-110'
                }`}
                style={{ 
                  left: `${stop.position}%`,
                  backgroundColor: stop.color,
                  border: activeStopIndex === index ? '2px solid white' : '1px solid rgba(255,255,255,0.3)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStopIndex(index);
                }}
              />
            ))}
          </div>
          
          {/* Individual color stop controls */}
          <div className="space-y-2">
            {colorStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => handleStopColorChange(index, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-2"
                  style={{ 
                    borderColor: activeStopIndex === index ? '#fff' : 'transparent',
                    padding: 0,
                  }}
                />
                <span className="text-xs w-12" style={{ color: '#8b949e' }}>{stop.color}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => handleStopPositionChange(index, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs w-8 text-right" style={{ color: '#8b949e' }}>
                  {stop.position}%
                </span>
                <button
                  onClick={() => setActiveStopIndex(index)}
                  className={`px-2 py-1 rounded text-xs ${
                    activeStopIndex === index ? 'bg-[#1f6feb] text-white' : 'bg-[#21262d] text-[#8b949e]'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveColorStop(index)}
                  disabled={colorStops.length <= 2}
                  className="p-1 rounded hover:bg-[#f85149]/20 disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-[#f85149]" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Apply Button */}
        <button
          onClick={applyGradient}
          className="w-full py-3 rounded-lg font-medium bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
        >
          Apply Gradient
        </button>
      </div>

      {/* Solid Colors */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
          <Palette className="w-4 h-4" />
          Solid Colors
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {SOLID_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => onChange('solid', color)}
              className="aspect-square rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Custom Solid Color */}
      <div>
        <h3 className="text-sm font-medium mb-3">Custom Color</h3>
        <input
          type="color"
          onChange={(e) => onChange('solid', e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};
