import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { toPng } from 'html-to-image';
import { Tooltip } from './Tooltip';
import { TextElement, DeviceElement, ShapeElement, ImageElement, DEVICE_MOCKUPS, Background } from '../../types';
import { LocalizationTreePanel } from './LocalizationTree';
import { GradientBackgroundEditor } from './GradientBackgroundEditor';
import { REALISTIC_DEVICES, REALISTIC_DEVICE_GROUPS } from '../../data/realisticDevices';
import { TEMPLATES } from '../../data/templates';
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
  Phone,
  Plus,
  Component,
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

type SidebarTab = 'templates' | 'assets' | 'icons' | 'text-styles' | 'backgrounds' | 'localization' | 'realistic-devices' | 'components';

const SIDEBAR_TABS: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'assets', label: 'Assets', icon: <Image className="w-4 h-4" /> },
  { id: 'icons', label: 'Icons', icon: <Star className="w-4 h-4" /> },
  { id: 'text-styles', label: 'Styles', icon: <Type className="w-4 h-4" /> },
  { id: 'backgrounds', label: 'Backgrounds', icon: <Palette className="w-4 h-4" /> },
  { id: 'localization', label: 'Localize', icon: <Languages className="w-4 h-4" /> },
  { id: 'realistic-devices', label: 'Devices', icon: (
    <div className="relative w-4 h-4">
      <Smartphone className="w-4 h-4" />
      <Plus className="w-2 h-2 absolute -top-1 -right-1" />
    </div>
  ) },
  { id: 'components', label: 'Components', icon: <Component className="w-4 h-4" /> },
];

export const LeftSidebar: React.FC = () => {
  const {
    leftSidebarTab,
    setLeftSidebarTab,
    currentScreenshot,
    updateScreenshot,
    addElement,
    addElements,
    currentPlatform,
    pushHistory,
    createScreenshot,
    customTemplates,
    savedComponents,
    selectedElements,
  } = useStore();

  React.useEffect(() => {
    const { loadCustomTemplates } = useStore.getState();
    loadCustomTemplates();
  }, []);

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

  const applyTemplate = (templateId: string) => {
    if (!currentScreenshot) return;

    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    pushHistory();

    updateScreenshot({
      ...currentScreenshot,
      elements: template.elements.map(el => ({ ...el, id: uuidv4() })),
      background: template.background,
    });
  };

  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'assets', label: 'Assets', icon: <Image className="w-4 h-4" /> },
    { id: 'icons', label: 'Icons', icon: <Star className="w-4 h-4" /> },
    { id: 'text-styles', label: 'Styles', icon: <Type className="w-4 h-4" /> },
    { id: 'backgrounds', label: 'Backgrounds', icon: <Palette className="w-4 h-4" /> },
    { id: 'localization', label: 'Localize', icon: <Languages className="w-4 h-4" /> },
    { id: 'realistic-devices', label: 'Devices', icon: (
      <div className="relative w-4 h-4">
        <Smartphone className="w-4 h-4" />
        <Plus className="w-2 h-2 absolute -top-1 -right-1" />
      </div>
    ) },
    { id: 'components', label: 'Components', icon: <Component className="w-4 h-4" /> },
  ];

  return (
    <div className="w-72 flex flex-col" style={{ backgroundColor: '#161b22', borderRight: '1px solid #30363d' }}>
      {/* Tab Headers */}
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #30363d' }}>
        {tabs.map(tab => (
          <Tooltip key={tab.id} text={tab.label}>
            <button
              onClick={() => setLeftSidebarTab(tab.id)}
              className="px-3 py-3 text-xs font-medium flex flex-col items-center gap-1 whitespace-nowrap transition-colors w-full h-full"
              style={
                leftSidebarTab === tab.id
                  ? { color: '#1f6feb', borderBottom: '2px solid #1f6feb' }
                  : { color: '#8b949e' }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Templates Tab */}
        {leftSidebarTab === 'templates' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4" style={{ color: '#1f6feb' }}>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Core Templates</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map(template => (
                  <Tooltip key={template.id} text={`Apply ${template.name} template`}>
                    <button
                      onClick={() => applyTemplate(template.id)}
                      className="w-full aspect-[9/16] rounded-xl border border-[#30363d] overflow-hidden hover:border-[#58a6ff] transition-all group relative"
                    >
                      <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[11px] text-white p-2 text-center transition-opacity">
                        {template.name}
                      </div>
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            {customTemplates && customTemplates.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4" style={{ color: '#238636' }}>
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">My Templates</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {customTemplates.map(template => (
                    <Tooltip key={template.id} text={`Apply ${template.name} preset`}>
                      <button
                        onClick={() => applyTemplate(template.id)}
                        className="w-full aspect-[9/16] rounded-xl border border-[#30363d] overflow-hidden hover:border-[#58a6ff] transition-all group relative"
                      >
                        <div className="w-full h-full bg-[#21262d] flex items-center justify-center text-[#8b949e] text-xs p-2">
                          {template.name}
                        </div>
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
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
                <Tooltip text="Add a large heading text">
                  <button
                    onClick={() => handleAddText('heading')}
                    className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    <span className="text-xl font-bold" style={{ color: '#e6edf3' }}>Heading</span>
                  </button>
                </Tooltip>
                <Tooltip text="Add a secondary subheading">
                  <button
                    onClick={() => handleAddText('subheading')}
                    className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    <span className="text-lg font-semibold" style={{ color: '#e6edf3' }}>Subheading</span>
                  </button>
                </Tooltip>
                <Tooltip text="Add a basic body text paragraph">
                  <button
                    onClick={() => handleAddText('body')}
                    className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    <span className="text-sm" style={{ color: '#e6edf3' }}>Body Text</span>
                  </button>
                </Tooltip>
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
                <Tooltip text="Show all available devices">
                  <button
                    onClick={() => setDeviceFilter('all')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      deviceFilter === 'all' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                    }`}
                  >
                    All
                  </button>
                </Tooltip>
                <Tooltip text="Filter for Apple iOS devices">
                  <button
                    onClick={() => setDeviceFilter('ios')}
                    className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                      deviceFilter === 'ios' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                    }`}
                  >
                    <Apple className="w-3 h-3" />
                    iOS
                  </button>
                </Tooltip>
                <Tooltip text="Filter for Android devices">
                  <button
                    onClick={() => setDeviceFilter('android')}
                    className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                      deviceFilter === 'android' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    Android
                  </button>
                </Tooltip>
              </div>

              {/* Device Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {filteredDevices.map((device) => {
                  const isTablet = device.height > 1000;
                  return (
                    <Tooltip key={device.id} text={`Add ${device.name} mockup`}>
                      <button
                        onClick={() => handleAddDeviceById(device.id)}
                        className="p-2 rounded-lg transition-colors text-left w-full"
                        style={{ backgroundColor: '#21262d', border: '1px solid #30363d' }}
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
                    </Tooltip>
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
                <Tooltip text="Add a rectangle">
                  <button
                    onClick={() => handleAddShape('rectangle')}
                    className="aspect-square rounded-lg flex items-center justify-center transition-colors w-full"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    <Square className="w-6 h-6" style={{ color: '#8b949e' }} />
                  </button>
                </Tooltip>
                <Tooltip text="Add a rounded rectangle">
                  <button
                    onClick={() => handleAddShape('rounded-rect')}
                    className="aspect-square rounded-lg flex items-center justify-center transition-colors w-full"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    <div className="w-6 h-6 border-2 rounded-md" style={{ borderColor: '#8b949e' }} />
                  </button>
                </Tooltip>
                <Tooltip text="Add a circle">
                  <button
                    onClick={() => handleAddShape('circle')}
                    className="aspect-square rounded-lg flex items-center justify-center transition-colors w-full"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    <Circle className="w-6 h-6" style={{ color: '#8b949e' }} />
                  </button>
                </Tooltip>
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
              <Tooltip text="Upload your own images">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors"
                  style={{ borderColor: '#30363d', backgroundColor: '#21262d' }}
                >
                  <Upload className="w-6 h-6" style={{ color: '#8b949e' }} />
                  <span className="text-sm" style={{ color: '#8b949e' }}>Upload Image</span>
                </button>
              </Tooltip>
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
                <Tooltip key={i} text={`Add ${item.name} icon`}>
                  <button
                    onClick={() => handleAddIcon(item.icon)}
                    className="aspect-square rounded-lg flex items-center justify-center text-2xl transition-all w-full"
                    style={{ backgroundColor: '#21262d' }}
                  >
                    {item.icon}
                  </button>
                </Tooltip>
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
                <Tooltip key={style.id} text={`Add ${style.name} text style`}>
                  <button
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
                </Tooltip>
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

        {/* Realistic Devices Tab */}
        {leftSidebarTab === 'realistic-devices' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4" style={{ color: '#1f6feb' }}>
              <Smartphone className="w-4 h-4" />
              <span className="text-sm font-medium">Realistic Devices</span>
            </div>
            <div className="space-y-2">
              {Object.entries(REALISTIC_DEVICE_GROUPS).map(([name, group]) => (
                <div key={name} className="space-y-2">
                  <div className="text-sm font-medium text-[#e6edf3]">{name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.variants.map((device) => (
                      <Tooltip key={device.id} text={`Add realistic ${device.name}`}>
                        <button
                          onClick={() => {
                            const { currentScreenshot, addElement } = useStore.getState();
                            if (!currentScreenshot) return;

                            const newElement: DeviceElement = {
                              id: uuidv4(),
                              type: 'device',
                              deviceId: device.id,
                              screenshotSrc: '',
                              x: 50,
                              y: 50,
                              width: device.mockupDimensions.width / 4,
                              height: device.mockupDimensions.height / 4,
                              showFrame: true,
                              rotation: 0,
                              orientation: 'portrait',
                              renderMode: 'realistic',
                            };

                            addElement(newElement);
                          }}
                          className="group relative aspect-[9/16] rounded-lg border border-[#30363d] overflow-hidden hover:border-[#58a6ff] transition-all w-full"
                        >
                          <img
                            src={device.mockupPath}
                            alt={device.name}
                            className="w-full h-full object-contain p-1"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white p-1 text-center">
                            {device.colors[0]}
                          </div>
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Components Tab */}
        {leftSidebarTab === 'components' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4" style={{ color: '#1f6feb' }}>
              <Component className="w-4 h-4" />
              <span className="text-sm font-medium">Saved Components</span>
            </div>

            <Tooltip text="Save selected elements as a reusable component">
              <button
                onClick={() => {
                  if (selectedElements.length === 0) return alert('Select elements to save as component');
                  const name = prompt('Component name:');
                  if (!name) return;
                  const { saveComponent } = useStore.getState();
                  saveComponent({
                    id: uuidv4(),
                    name,
                    elements: JSON.parse(JSON.stringify(selectedElements)),
                    createdAt: new Date().toISOString(),
                  });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
                disabled={selectedElements.length === 0}
              >
                <Plus className="w-4 h-4" />
                Save Selected as Component
              </button>
            </Tooltip>

            <div className="space-y-2">
              {savedComponents.length === 0 && (
                <div className="text-xs text-center py-8" style={{ color: '#6e7681' }}>
                  No saved components yet.<br />Select elements and save them here.
                </div>
              )}
              {savedComponents.map((comp) => (
                <div
                  key={comp.id}
                  className="p-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer hover:bg-[#21262d]"
                  style={{ backgroundColor: '#21262d' }}
                  onClick={() => {
                    const { currentScreenshot, addElements } = useStore.getState();
                    if (!currentScreenshot) return;
                    const newElements = comp.elements.map((el: any) => ({
                      ...el,
                      id: uuidv4(),
                      x: el.x + 50,
                      y: el.y + 50,
                    }));
                    addElements(newElements);
                  }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#c9d1d9' }}>{comp.name}</div>
                    <div className="text-xs" style={{ color: '#6e7681' }}>{comp.elements.length} element(s)</div>
                  </div>
                  <Tooltip text="Delete component">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const { deleteSavedComponent } = useStore.getState();
                        deleteSavedComponent(comp.id);
                      }}
                      className="p-1 rounded hover:bg-[#30363d]"
                      style={{ color: '#f85149' }}
                    >
                      ×
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
