import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { IOS_SIZES, ANDROID_SIZES, DeviceElement } from '../../types';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { getRealisticDeviceById } from '../../data/realisticDevices';
import {
  X,
  Download,
  Apple,
  Smartphone,
  Check,
  Loader2,
  Package,
  FileImage,
  Archive,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { currentProject, currentPlatform } = useStore();
  const [exportScreens, setExportScreens] = useState(currentProject?.screenshots || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg'>('png');
  const [exportMode, setExportMode] = useState<'individual' | 'zip'>('zip');

  if (!isOpen || !currentProject) return null;

  const removeScreen = (id: string) => {
    setExportScreens(prev => prev.filter(s => s.id !== id));
  };

  const sizes = currentPlatform === 'ios' ? IOS_SIZES : ANDROID_SIZES;

  const toggleSize = (sizeId: string) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const selectAllSizes = () => {
    if (selectedSizes.length === sizes.length) {
      setSelectedSizes([]);
    } else {
      setSelectedSizes(sizes.map(s => s.id));
    }
  };

  const createExportCanvas = (screenshot: typeof exportScreens[0], size: typeof sizes[0]) => {
    const exportCanvas = document.createElement('div');
    exportCanvas.style.position = 'fixed';
    exportCanvas.style.left = '-9999px';
    exportCanvas.style.top = '-9999px';
    exportCanvas.style.width = `${size.width}px`;
    exportCanvas.style.height = `${size.height}px`;

    const bg = screenshot.background;
    if (bg.type === 'solid') {
      exportCanvas.style.backgroundColor = bg.value;
    } else if (bg.type === 'gradient') {
      exportCanvas.style.background = bg.value;
    } else if (bg.type === 'image') {
      exportCanvas.style.backgroundImage = `url(${bg.value})`;
      exportCanvas.style.backgroundSize = 'cover';
      exportCanvas.style.backgroundPosition = 'center';
    }

    screenshot.elements.forEach(element => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = `${element.x}px`;
      el.style.top = `${element.y}px`;
      el.style.width = `${element.width}px`;
      el.style.height = `${element.height}px`;

      if (element.type === 'text') {
        el.style.fontSize = `${element.fontSize}px`;
        el.style.fontWeight = element.fontWeight;
        el.style.fontFamily = element.fontFamily;
        el.style.color = element.color;
        el.style.textAlign = element.textAlign;
        el.style.lineHeight = String(element.lineHeight);
        el.style.letterSpacing = `${element.letterSpacing}px`;
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start';
        el.style.overflow = 'hidden';
        el.style.wordBreak = 'break-word';
        el.textContent = element.content;
      } else if (element.type === 'device') {
        const deviceElement = element as DeviceElement;
        
        if (deviceElement.renderMode === 'realistic') {
          const realisticDevice = getRealisticDeviceById(deviceElement.deviceId);
          if (realisticDevice) {
            el.style.overflow = 'hidden';
            
            // Screenshot on bottom
            if (deviceElement.screenshotSrc) {
              const screenshotImg = document.createElement('img');
              screenshotImg.src = deviceElement.screenshotSrc;
              screenshotImg.style.position = 'absolute';
              screenshotImg.style.left = (realisticDevice.screenArea.x / realisticDevice.mockupDimensions.width) * 100 + '%';
              screenshotImg.style.top = (realisticDevice.screenArea.y / realisticDevice.mockupDimensions.height) * 100 + '%';
              screenshotImg.style.width = (realisticDevice.screenArea.width / realisticDevice.mockupDimensions.width) * 100 + '%';
              screenshotImg.style.height = (realisticDevice.screenArea.height / realisticDevice.mockupDimensions.height) * 100 + '%';
              screenshotImg.style.objectFit = 'fill';
              screenshotImg.style.zIndex = '0';
              el.appendChild(screenshotImg);
            }
            
            // Mockup on top
            const mockupImg = document.createElement('img');
            mockupImg.src = realisticDevice.mockupPath;
            mockupImg.style.position = 'relative';
            mockupImg.style.width = '100%';
            mockupImg.style.height = '100%';
            mockupImg.style.objectFit = 'contain';
            mockupImg.style.zIndex = '10';
            el.appendChild(mockupImg);
          }
        } else {
          // Fallback or 2D/3D mode (simplified for now as ExportModal was doing)
          if (element.showFrame) {
            el.style.backgroundColor = '#1e293b';
            el.style.borderRadius = '40px';
            el.style.padding = '12px';
          }
          
          const screenDiv = document.createElement('div');
          screenDiv.style.width = '100%';
          screenDiv.style.height = '100%';
          screenDiv.style.borderRadius = element.showFrame ? '32px' : '8px';
          screenDiv.style.overflow = 'hidden';
          
          if (element.screenshotSrc) {
            screenDiv.style.backgroundImage = `url(${element.screenshotSrc})`;
            screenDiv.style.backgroundSize = 'cover';
            screenDiv.style.backgroundPosition = 'center';
          } else {
            screenDiv.style.backgroundColor = '#1e293b';
          }
          
          el.appendChild(screenDiv);
        }
      } else if (element.type === 'shape') {
        el.style.backgroundColor = element.fill;
        el.style.borderRadius = element.shapeType === 'circle' ? '50%' : `${element.borderRadius || 0}px`;
        if (element.stroke) {
          el.style.border = `${element.strokeWidth || 1}px solid ${element.stroke}`;
        }
      } else if (element.type === 'image') {
        const img = document.createElement('img');
        img.src = element.src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = element.objectFit;
        el.style.overflow = 'hidden';
        el.style.borderRadius = '8px';
        el.appendChild(img);
      }

      exportCanvas.appendChild(el);
    });

    return exportCanvas;
  };

  const generateFileName = (screenshot: typeof currentProject.screenshots[0], size: typeof sizes[0]) => {
    const safeAppName = currentProject.appName.replace(/[^a-zA-Z0-9]/g, '_');
    const safeScreenshotName = screenshot.name.replace(/[^a-zA-Z0-9]/g, '_');
    const safeSizeName = size.name.replace(/[^a-zA-Z0-9]/g, '_');
    return `${safeAppName}_${safeScreenshotName}_${safeSizeName}.${exportFormat}`;
  };

  const handleExport = async () => {
    if (selectedSizes.length === 0) {
      alert('Please select at least one size to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const zip = JSZip();
      const totalExports = exportScreens.length * selectedSizes.length;
      let completed = 0;

      const platformFolder = currentPlatform === 'ios' ? 'iOS' : 'Android';
      const appFolder = zip.folder(platformFolder);

      if (!appFolder) {
        throw new Error('Failed to create folder in ZIP');
      }

      for (const screenshot of exportScreens) {
        for (const sizeId of selectedSizes) {
          const size = sizes.find(s => s.id === sizeId);
          if (!size) continue;

          const exportCanvas = createExportCanvas(screenshot, size);
          document.body.appendChild(exportCanvas);

          try {
            let dataUrl: string;
            
            if (exportFormat === 'jpg') {
              dataUrl = await toPng(exportCanvas, {
                width: size.width,
                height: size.height,
                quality: 0.95,
                pixelRatio: 1,
              });
            } else {
              dataUrl = await toPng(exportCanvas, {
                width: size.width,
                height: size.height,
                quality: 1,
                pixelRatio: 1,
              });
            }

            const fileName = generateFileName(screenshot, size);
            const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
            appFolder.file(fileName, base64Data, { base64: true });

            completed++;
            setExportProgress(Math.round((completed / totalExports) * 100));
          } finally {
            document.body.removeChild(exportCanvas);
          }
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const zipFileName = `${currentProject.appName.replace(/[^a-zA-Z0-9]/g, '_')}_${platformFolder}_screenshots.zip`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  const handleIndividualExport = async () => {
    if (selectedSizes.length === 0) {
      alert('Please select at least one size to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const totalExports = exportScreens.length * selectedSizes.length;
      let completed = 0;

      for (const screenshot of exportScreens) {
        for (const sizeId of selectedSizes) {
          const size = sizes.find(s => s.id === sizeId);
          if (!size) continue;

          const exportCanvas = createExportCanvas(screenshot, size);
          document.body.appendChild(exportCanvas);

          try {
            let dataUrl: string;
            
            if (exportFormat === 'jpg') {
              dataUrl = await toPng(exportCanvas, {
                width: size.width,
                height: size.height,
                quality: 0.95,
                pixelRatio: 1,
              });
            } else {
              dataUrl = await toPng(exportCanvas, {
                width: size.width,
                height: size.height,
                quality: 1,
                pixelRatio: 1,
              });
            }

            const fileName = generateFileName(screenshot, size);
            
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            completed++;
            setExportProgress(Math.round((completed / totalExports) * 100));
            
            await new Promise(resolve => setTimeout(resolve, 100));
          } finally {
            document.body.removeChild(exportCanvas);
          }
        }
      }

      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#30363d] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#21262d] rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-[#58a6ff]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">Export Screenshots</h2>
              <p className="text-sm text-[#8b949e]">{currentProject.screenshots.length} screens ready</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8b949e]" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium text-[#8b949e] mb-3">Screens to Export ({exportScreens.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {exportScreens.map((screen) => (
                <div key={screen.id} className="flex items-center justify-between p-2 bg-[#21262d] rounded-lg">
                  <span className="text-sm text-[#e6edf3] truncate">{screen.name}</span>
                  <button
                    onClick={() => removeScreen(screen.id)}
                    className="p-1 hover:bg-[#30363d] rounded"
                  >
                    <X className="w-3 h-3 text-[#8b949e]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentPlatform === 'ios' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                <Apple className="w-4 h-4" />
                iOS App Store
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm">
                <Smartphone className="w-4 h-4" />
                Google Play Store
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#8b949e] mb-3">Export Mode</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setExportMode('zip')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  exportMode === 'zip'
                    ? 'bg-[#238636]/20 border border-[#238636] text-[#238636]'
                    : 'bg-[#21262d] border border-transparent text-[#e6edf3] hover:border-[#30363d]'
                }`}
              >
                <Archive className="w-4 h-4" />
                ZIP Bundle
              </button>
              <button
                onClick={() => setExportMode('individual')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  exportMode === 'individual'
                    ? 'bg-[#238636]/20 border border-[#238636] text-[#238636]'
                    : 'bg-[#21262d] border border-transparent text-[#e6edf3] hover:border-[#30363d]'
                }`}
              >
                <FileImage className="w-4 h-4" />
                Individual Files
              </button>
            </div>
            {exportMode === 'zip' && (
              <p className="text-xs text-[#6e7681] mt-2">
                Downloads a ZIP with {currentPlatform} folder containing all screenshots
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#8b949e]">Select Sizes</h3>
              <button
                onClick={selectAllSizes}
                className="text-xs text-[#58a6ff] hover:text-[#388bfd]"
              >
                {selectedSizes.length === sizes.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2">
              {sizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => toggleSize(size.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    selectedSizes.includes(size.id)
                      ? 'bg-[#238636]/20 border border-[#238636]'
                      : 'bg-[#21262d] border border-transparent hover:border-[#30363d]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      selectedSizes.includes(size.id) ? 'bg-[#238636]' : 'bg-[#30363d]'
                    }`}>
                      {selectedSizes.includes(size.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[#e6edf3] font-medium">{size.name}</span>
                  </div>
                  <span className="text-sm text-[#8b949e]">{size.width} × {size.height}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#8b949e] mb-3">Format</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setExportFormat('png')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  exportFormat === 'png'
                    ? 'bg-[#238636]/20 border border-[#238636] text-[#238636]'
                    : 'bg-[#21262d] border border-transparent text-[#e6edf3] hover:border-[#30363d]'
                }`}
              >
                <FileImage className="w-4 h-4" />
                PNG
              </button>
              <button
                onClick={() => setExportFormat('jpg')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  exportFormat === 'jpg'
                    ? 'bg-[#238636]/20 border border-[#238636] text-[#238636]'
                    : 'bg-[#21262d] border border-transparent text-[#e6edf3] hover:border-[#30363d]'
                }`}
              >
                <FileImage className="w-4 h-4" />
                JPG
              </button>
            </div>
          </div>

          <div className="bg-[#21262d] rounded-xl p-4">
            <div className="flex items-center gap-3 text-[#e6edf3]">
              <Package className="w-5 h-5 text-[#8b949e]" />
              <div>
                <span className="font-medium">
                  {exportScreens.length * selectedSizes.length} files
                </span>
                <span className="text-[#6e7681]"> will be exported</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#30363d]">
          {isExporting ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#58a6ff] animate-spin" />
                <span className="text-[#e6edf3]">Exporting... {exportProgress}%</span>
              </div>
              <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#238636] transition-all"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-[#30363d] text-[#e6edf3] rounded-xl font-medium hover:bg-[#21262d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={exportMode === 'zip' ? handleExport : handleIndividualExport}
                disabled={selectedSizes.length === 0}
                className="flex-1 px-4 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {exportMode === 'zip' ? 'Export ZIP' : 'Export All'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
