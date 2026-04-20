import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { TextElement, DeviceElement, ShapeElement, ImageElement, DEVICE_MOCKUPS, Background } from '../../types';
import { LocalizationTreePanel } from './LocalizationTree';
import { GradientBackgroundEditor } from './GradientBackgroundEditor';
import {
  LayoutTemplate,
  Image,
  Palette,
  Type,
  Smartphone,
  Square,
  Circle,
  Upload,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeftRight,
  Languages,
  Apple,
} from 'lucide-react';

const TEMPLATE_CATEGORIES = [
  { id: 'feature', name: 'Feature Highlight', icon: Star },
  { id: 'problem-solution', name: 'Problem → Solution', icon: ArrowRight },
  { id: 'before-after', name: 'Before / After', icon: ArrowLeftRight },
  { id: 'social-proof', name: 'Social Proof', icon: CheckCircle },
  { id: 'minimal', name: 'Minimal', icon: Square },
];

const ICON_LIBRARY = [
  { name: 'Star', icon: '⭐' },
  { name: 'Heart', icon: '❤️' },
  { name: 'Check', icon: '✓' },
  { name: 'Rocket', icon: '🚀' },
  { name: 'Lock', icon: '🔒' },
  { name: 'Bell', icon: '🔔' },
  { name: 'Search', icon: '🔍' },
  { name: 'Settings', icon: '⚙️' },
  { name: 'User', icon: '👤' },
  { name: 'Calendar', icon: '📅' },
  { name: 'Camera', icon: '📷' },
  { name: 'Clock', icon: '⏰' },
  { name: 'Mail', icon: '✉️' },
  { name: 'Phone', icon: '📞' },
  { name: 'Map', icon: '📍' },
  { name: 'Cloud', icon: '☁️' },
  { name: 'Fire', icon: '🔥' },
  { name: 'Lightning', icon: '⚡' },
  { name: 'Shield', icon: '🛡️' },
  { name: 'Trophy', icon: '🏆' },
];

const TEXT_STYLE_PRESETS = [
  { id: 'hero', name: 'Hero Title', fontSize: 72, fontWeight: '800', letterSpacing: -2, lineHeight: 1.1 },
  { id: 'headline', name: 'Headline', fontSize: 56, fontWeight: '700', letterSpacing: -1, lineHeight: 1.2 },
  { id: 'subhead', name: 'Subheadline', fontSize: 36, fontWeight: '600', letterSpacing: 0, lineHeight: 1.3 },
  { id: 'body', name: 'Body Text', fontSize: 28, fontWeight: '400', letterSpacing: 0, lineHeight: 1.5 },
  { id: 'caption', name: 'Caption', fontSize: 20, fontWeight: '400', letterSpacing: 0.5, lineHeight: 1.4 },
  { id: 'button', name: 'Button', fontSize: 24, fontWeight: '600', letterSpacing: 1, lineHeight: 1.2 },
  { id: 'stat', name: 'Big Stat', fontSize: 96, fontWeight: '800', letterSpacing: -3, lineHeight: 1 },
  { id: 'quote', name: 'Quote', fontSize: 32, fontWeight: '400', letterSpacing: 0, lineHeight: 1.6 },
];

type SidebarTab = 'templates' | 'assets' | 'icons' | 'text-styles' | 'backgrounds' | 'localization';

export const LeftSidebar: React.FC = () => {
  const {
    leftSidebarTab,
    setLeftSidebarTab,
    currentScreenshot,
    updateScreenshot,
    addElement,
    currentPlatform,
    pushHistory,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'ios' | 'android'>('all');

  const filteredDevices = DEVICE_MOCKUPS.filter(device => {
    if (deviceFilter === 'all') return true;
    return device.platform === deviceFilter;
  });

  const handleAddDeviceById = (deviceId: string) => {
    const device = DEVICE_MOCKUPS.find(d => d.id === deviceId);
    if (!device) return;

    const aspectRatio = device.height / device.width;
    const canvasWidth = 350;
    const canvasHeight = canvasWidth * aspectRatio;

    const element: DeviceElement = {
      id: uuidv4(),
      type: 'device',
      deviceId: device.id,
      screenshotSrc: '',
      x: 100,
      y: 200,
      width: canvasWidth,
      height: canvasHeight,
      showFrame: true,
      rotation: 0,
      orientation: 'portrait',
      renderMode: '2d',
    };

    addElement(element);
  };

  const handleAddText = (preset?: 'heading' | 'subheading' | 'body' | string) => {
    let config = {
      fontSize: 48,
      fontWeight: '600',
      content: 'Your Text Here',
      lineHeight: 1.2,
      letterSpacing: 0,
    };

    if (preset === 'heading') {
      config = { fontSize: 72, fontWeight: '800', content: 'Your Headline Here', lineHeight: 1.1, letterSpacing: -2 };
    } else if (preset === 'subheading') {
      config = { fontSize: 48, fontWeight: '600', content: 'Supporting text goes here', lineHeight: 1.2, letterSpacing: -1 };
    } else if (preset === 'body') {
      config = { fontSize: 32, fontWeight: '400', content: 'Body text content', lineHeight: 1.5, letterSpacing: 0 };
    } else if (preset) {
      const stylePreset = TEXT_STYLE_PRESETS.find(s => s.id === preset);
      if (stylePreset) {
        config = {
          fontSize: stylePreset.fontSize,
          fontWeight: stylePreset.fontWeight,
          content: 'Your Text Here',
          lineHeight: stylePreset.lineHeight,
          letterSpacing: stylePreset.letterSpacing,
        };
      }
    }

    const element: TextElement = {
      id: uuidv4(),
      type: 'text',
      content: config.content,
      x: 100,
      y: 200,
      width: 500,
      height: config.fontSize * config.lineHeight * 2,
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing,
    };

    addElement(element);
  };

  const handleAddIcon = (emoji: string) => {
    const element: TextElement = {
      id: uuidv4(),
      type: 'text',
      content: emoji,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      fontSize: 64,
      fontWeight: '400',
      fontFamily: 'system-ui, sans-serif',
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1,
      letterSpacing: 0,
    };

    addElement(element);
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'rounded-rect') => {
    const element: ShapeElement = {
      id: uuidv4(),
      type: 'shape',
      shapeType,
      x: 200,
      y: 400,
      width: 200,
      height: 200,
      fill: '#ffffff20',
      borderRadius: shapeType === 'rounded-rect' ? 16 : 0,
    };

    addElement(element);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const element: ImageElement = {
          id: uuidv4(),
          type: 'image',
          src: event.target?.result as string,
          x: 100,
          y: 100,
          width: 300,
          height: 300,
          objectFit: 'cover',
        };
        addElement(element);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (type: 'solid' | 'gradient', value: string, colors?: string[]) => {
    if (!currentScreenshot) return;

    pushHistory();

    updateScreenshot({
      ...currentScreenshot,
      background: {
        type,
        value,
        gradientColors: colors,
        gradientDirection: '135deg',
      },
    });
  };

  const applyTemplate = (templateType: string) => {
    if (!currentScreenshot) return;

    pushHistory();

    const templates: Record<string, { elements: any[], background: any }> = {
      feature: {
        background: {
          type: 'gradient',
          value: 'linear-gradient(135deg, #1f6feb 0%, #a371f7 100%)',
          gradientColors: ['#1f6feb', '#a371f7'],
        },
        elements: [
          {
            id: uuidv4(),
            type: 'text',
            content: 'Your Amazing Feature',
            x: 100,
            y: 150,
            width: 500,
            height: 120,
            fontSize: 64,
            fontWeight: '800',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: -1,
          },
          {
            id: uuidv4(),
            type: 'text',
            content: 'Brief description of the feature',
            x: 100,
            y: 280,
            width: 500,
            height: 60,
            fontSize: 28,
            fontWeight: '400',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffffcc',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: 0,
          },
          {
            id: uuidv4(),
            type: 'device',
            deviceId: currentPlatform === 'ios' ? 'iphone-15-pro' : 'pixel-8',
            screenshotSrc: '',
            x: 180,
            y: 500,
            width: 340,
            height: 680,
            showFrame: true,
          },
        ],
      },
      'problem-solution': {
        background: {
          type: 'gradient',
          value: 'linear-gradient(135deg, #f0883e 0%, #f85149 100%)',
          gradientColors: ['#f0883e', '#f85149'],
        },
        elements: [
          {
            id: uuidv4(),
            type: 'text',
            content: 'The Problem',
            x: 80,
            y: 120,
            width: 280,
            height: 80,
            fontSize: 36,
            fontWeight: '700',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textAlign: 'left',
            lineHeight: 1.2,
            letterSpacing: -0.5,
          },
          {
            id: uuidv4(),
            type: 'text',
            content: 'The Solution',
            x: 380,
            y: 120,
            width: 280,
            height: 80,
            fontSize: 36,
            fontWeight: '700',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textAlign: 'left',
            lineHeight: 1.2,
            letterSpacing: -0.5,
          },
          {
            id: uuidv4(),
            type: 'device',
            deviceId: currentPlatform === 'ios' ? 'iphone-15-pro' : 'pixel-8',
            screenshotSrc: '',
            x: 180,
            y: 400,
            width: 340,
            height: 680,
            showFrame: true,
          },
        ],
      },
      'before-after': {
        background: {
          type: 'gradient',
          value: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)',
          gradientColors: ['#238636', '#2ea043'],
        },
        elements: [
          {
            id: uuidv4(),
            type: 'text',
            content: 'BEFORE',
            x: 100,
            y: 200,
            width: 250,
            height: 50,
            fontSize: 32,
            fontWeight: '700',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#f85149',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: 2,
          },
          {
            id: uuidv4(),
            type: 'text',
            content: 'AFTER',
            x: 540,
            y: 200,
            width: 250,
            height: 50,
            fontSize: 32,
            fontWeight: '700',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#3fb950',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: 2,
          },
          {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'rounded-rect',
            x: 50,
            y: 280,
            width: 300,
            height: 500,
            fill: '#ffffff10',
            borderRadius: 20,
          },
          {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'rounded-rect',
            x: 380,
            y: 280,
            width: 300,
            height: 500,
            fill: '#ffffff10',
            borderRadius: 20,
          },
          {
            id: uuidv4(),
            type: 'device',
            deviceId: currentPlatform === 'ios' ? 'iphone-15-pro' : 'pixel-8',
            screenshotSrc: '',
            x: 480,
            y: 350,
            width: 200,
            height: 400,
            showFrame: true,
          },
        ],
      },
      'social-proof': {
        background: {
          type: 'gradient',
          value: 'linear-gradient(135deg, #a371f7 0%, #1f6feb 100%)',
          gradientColors: ['#a371f7', '#1f6feb'],
        },
        elements: [
          {
            id: uuidv4(),
            type: 'text',
            content: '★★★★★',
            x: 100,
            y: 100,
            width: 500,
            height: 60,
            fontSize: 40,
            fontWeight: '400',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: 8,
          },
          {
            id: uuidv4(),
            type: 'text',
            content: '"This app changed my life!"',
            x: 80,
            y: 180,
            width: 540,
            height: 100,
            fontSize: 42,
            fontWeight: '600',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: -0.5,
          },
          {
            id: uuidv4(),
            type: 'text',
            content: '— Happy User',
            x: 100,
            y: 290,
            width: 500,
            height: 40,
            fontSize: 24,
            fontWeight: '400',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffffcc',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: 0,
          },
          {
            id: uuidv4(),
            type: 'device',
            deviceId: currentPlatform === 'ios' ? 'iphone-15-pro' : 'pixel-8',
            screenshotSrc: '',
            x: 180,
            y: 450,
            width: 340,
            height: 680,
            showFrame: true,
          },
        ],
      },
      minimal: {
        background: {
          type: 'solid',
          value: '#0d1117',
        },
        elements: [
          {
            id: uuidv4(),
            type: 'text',
            content: 'Simple. Clean.',
            x: 100,
            y: 200,
            width: 500,
            height: 100,
            fontSize: 56,
            fontWeight: '300',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#e6edf3',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: 2,
          },
          {
            id: uuidv4(),
            type: 'device',
            deviceId: currentPlatform === 'ios' ? 'iphone-15-pro' : 'pixel-8',
            screenshotSrc: '',
            x: 180,
            y: 450,
            width: 340,
            height: 680,
            showFrame: true,
          },
        ],
      },
    };

    const template = templates[templateType];
    if (template) {
      updateScreenshot({
        ...currentScreenshot,
        elements: template.elements,
        background: template.background,
      });
    }
  };

  const tabs: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'assets', label: 'Assets', icon: Image },
    { id: 'icons', label: 'Icons', icon: Star },
    { id: 'text-styles', label: 'Styles', icon: Type },
    { id: 'backgrounds', label: 'Backgrounds', icon: Palette },
    { id: 'localization', label: 'Localize', icon: Languages },
  ];

  return (
    <div className="w-72 flex flex-col" style={{ backgroundColor: '#161b22', borderRight: '1px solid #30363d' }}>
      {/* Tab Headers */}
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #30363d' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setLeftSidebarTab(tab.id)}
            className="px-3 py-3 text-xs font-medium flex flex-col items-center gap-1 whitespace-nowrap transition-colors"
            style={
              leftSidebarTab === tab.id
                ? { color: '#1f6feb', borderBottom: '2px solid #1f6feb' }
                : { color: '#8b949e' }
            }
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Templates Tab */}
        {leftSidebarTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4" style={{ color: '#1f6feb' }}>
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">ASO-Optimized Templates</span>
            </div>

            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => applyTemplate(cat.id)}
                className="w-full aspect-[9/16] rounded-xl border transition-all flex flex-col items-center justify-center gap-3 group"
                style={{ 
                  background: 'linear-gradient(180deg, #21262d 0%, #161b22 100%)',
                  borderColor: '#30363d'
                }}
              >
                <cat.icon className="w-8 h-8 transition-colors" style={{ color: '#8b949e' }} />
                <span className="text-sm transition-colors" style={{ color: '#c9d1d9' }}>{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Assets Tab */}
        {leftSidebarTab === 'assets' && (
          <div className="space-y-6">
            {/* Text Elements */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
                <Type className="w-4 h-4" />
                Text
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleAddText('heading')}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <span className="text-xl font-bold" style={{ color: '#e6edf3' }}>Heading</span>
                </button>
                <button
                  onClick={() => handleAddText('subheading')}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <span className="text-lg font-semibold" style={{ color: '#e6edf3' }}>Subheading</span>
                </button>
                <button
                  onClick={() => handleAddText('body')}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <span className="text-sm" style={{ color: '#e6edf3' }}>Body Text</span>
                </button>
              </div>
            </div>

            {/* Device Mockups */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
                <Smartphone className="w-4 h-4" />
                Device Mockups
              </h3>
              
              {/* Platform Filter */}
              <div className="flex gap-1 mb-3">
                <button
                  onClick={() => setDeviceFilter('all')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    deviceFilter === 'all' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDeviceFilter('ios')}
                  className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                    deviceFilter === 'ios' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                  }`}
                >
                  <Apple className="w-3 h-3" />
                  iOS
                </button>
                <button
                  onClick={() => setDeviceFilter('android')}
                  className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                    deviceFilter === 'android' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  Android
                </button>
              </div>
              
              {/* Device Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {filteredDevices.map((device) => {
                  const isTablet = device.height > 1000;
                  return (
                    <button
                      key={device.id}
                      onClick={() => handleAddDeviceById(device.id)}
                      className="p-2 rounded-lg transition-colors text-left"
                      style={{ backgroundColor: '#21262d', border: '1px solid #30363d' }}
                      title={`${device.name} (${device.width}×${device.height})`}
                    >
                      <div 
                        className="mx-auto mb-1 rounded flex items-center justify-center"
                        style={{ 
                          width: 24, 
                          height: isTablet ? 18 : 36,
                          backgroundColor: device.platform === 'ios' ? '#8b949e' : '#4caf50'
                        }}
                      />
                      <div className="text-xs truncate" style={{ color: '#e6edf3' }}>{device.name}</div>
                      <div className="text-xs truncate" style={{ color: '#6e7681' }}>{device.width}×{device.height}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shapes */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
                <Square className="w-4 h-4" />
                Shapes
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddShape('rectangle')}
                  className="aspect-square rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <Square className="w-6 h-6" style={{ color: '#8b949e' }} />
                </button>
                <button
                  onClick={() => handleAddShape('rounded-rect')}
                  className="aspect-square rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <div className="w-6 h-6 border-2 rounded-md" style={{ borderColor: '#8b949e' }} />
                </button>
                <button
                  onClick={() => handleAddShape('circle')}
                  className="aspect-square rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <Circle className="w-6 h-6" style={{ color: '#8b949e' }} />
                </button>
              </div>
            </div>

            {/* Upload */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#c9d1d9' }}>
                <Upload className="w-4 h-4" />
                Upload
              </h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors"
                style={{ borderColor: '#30363d', backgroundColor: '#21262d' }}
              >
                <Upload className="w-6 h-6" style={{ color: '#8b949e' }} />
                <span className="text-sm" style={{ color: '#8b949e' }}>Upload Image</span>
              </button>
            </div>
          </div>
        )}

        {/* Icons Tab */}
        {leftSidebarTab === 'icons' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4" style={{ color: '#1f6feb' }}>
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Icon Library</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ICON_LIBRARY.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleAddIcon(item.icon)}
                  className="aspect-square rounded-lg flex items-center justify-center text-2xl transition-all"
                  style={{ backgroundColor: '#21262d' }}
                  title={item.name}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Styles Tab */}
        {leftSidebarTab === 'text-styles' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4" style={{ color: '#1f6feb' }}>
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">Text Style Presets</span>
            </div>
            <div className="space-y-2">
              {TEXT_STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleAddText(style.id)}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <div 
                    className="font-bold mb-1 truncate"
                    style={{
                      fontSize: Math.min(style.fontSize * 0.4, 24),
                      fontWeight: style.fontWeight,
                      color: '#e6edf3'
                    }}
                  >
                    {style.name}
                  </div>
                  <div className="text-xs" style={{ color: '#8b949e' }}>
                    {style.fontSize}px / {style.fontWeight} / lh {style.lineHeight}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Backgrounds Tab */}
        {leftSidebarTab === 'backgrounds' && (
          <GradientBackgroundEditor 
            currentBackground={currentScreenshot?.background} 
            onChange={handleBackgroundChange}
          />
        )}

        {/* Localization Tab */}
        {leftSidebarTab === 'localization' && (
          <LocalizationTreePanel />
        )}
      </div>
    </div>
  );
};
