import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { CanvasElement, IOS_SIZES, ANDROID_SIZES, DEVICE_MOCKUPS, DeviceElement, TextElement } from '../../types';
import { Smartphone } from 'lucide-react';
import { Device3DPreview } from './Device3DRenderer';
import { getRealisticDeviceById } from '../../data/realisticDevices';
import { TextElementComponent } from './TextElementComponent';

interface DragState {
  isDragging: boolean;
  elementIds: string[];
  startX: number;
  startY: number;
  elementStartPositions: Map<string, { x: number; y: number }>;
}

interface ResizeState {
  isResizing: boolean;
  elementId: string | null;
  handle: string;
  startX: number;
  startY: number;
  elementStartWidth: number;
  elementStartHeight: number;
  elementStartX: number;
  elementStartY: number;
  aspectRatio: number;
}

interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
}

export const Canvas: React.FC = () => {
  const {
    currentScreenshot,
    selectedElements,
    currentPlatform,
    currentSizeId,
    showSafeAreas,
    showGrid,
    gridSize,
    zoom,
    setSelectedElement,
    addToSelectedElements,
    clearSelectedElements,
    updateElement,
    pushHistory,
  } = useStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementIds: [],
    startX: 0,
    startY: 0,
    elementStartPositions: new Map(),
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    elementId: null,
    handle: '',
    startX: 0,
    startY: 0,
    elementStartWidth: 0,
    elementStartHeight: 0,
    elementStartX: 0,
    elementStartY: 0,
    aspectRatio: 1,
  });

  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);

  const sizes = currentPlatform === 'ios' ? IOS_SIZES : ANDROID_SIZES;
  const currentSize = sizes.find(s => s.id === currentSizeId) || sizes[0];

  const canvasWidth = currentSize.width;
  const canvasHeight = currentSize.height;

  const snapToGrid = useCallback((value: number): number => {
    if (!showGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [showGrid, gridSize]);

  const findAlignmentGuides = useCallback((elements: CanvasElement[], deltaX: number, deltaY: number): AlignmentGuide[] => {
    if (!currentScreenshot) return [];
    
    const guides: AlignmentGuide[] = [];
    const threshold = 5;
    
    const elementLefts = elements.map(el => (el as any).x + deltaX);
    const elementRights = elements.map(el => (el as any).x + (el as any).width + deltaX);
    const elementTops = elements.map(el => (el as any).y + deltaY);
    const elementBottoms = elements.map(el => (el as any).y + (el as any).height + deltaY);
    const elementCentersX = elements.map(el => (el as any).x + (el as any).width / 2 + deltaX);
    const elementCentersY = elements.map(el => (el as any).y + (el as any).height / 2 + deltaY);
    
    const checkValue = (value: number, position: number, type: 'horizontal' | 'vertical') => {
      if (Math.abs(value - position) < threshold) {
        guides.push({ type, position });
      }
    };
    
    checkValue(elementLefts[0], 0, 'vertical');
    checkValue(elementRights[0], canvasWidth, 'vertical');
    checkValue(elementTops[0], 0, 'horizontal');
    checkValue(elementBottoms[0], canvasHeight, 'horizontal');
    checkValue(elementCentersX[0], canvasWidth / 2, 'vertical');
    checkValue(elementCentersY[0], canvasHeight / 2, 'horizontal');
    
    for (const el of currentScreenshot.elements) {
      if (elements.some(e => e.id === el.id)) continue;
      
      const elLeft = (el as any).x;
      const elRight = (el as any).x + (el as any).width;
      const elTop = (el as any).y;
      const elBottom = (el as any).y + (el as any).height;
      const elCenterX = (el as any).x + (el as any).width / 2;
      const elCenterY = (el as any).y + (el as any).height / 2;
      
      elementLefts.forEach(l => checkValue(l, elLeft, 'vertical'));
      elementLefts.forEach(l => checkValue(l, elRight, 'vertical'));
      elementRights.forEach(r => checkValue(r, elLeft, 'vertical'));
      elementRights.forEach(r => checkValue(r, elRight, 'vertical'));
      elementTops.forEach(t => checkValue(t, elTop, 'horizontal'));
      elementTops.forEach(t => checkValue(t, elBottom, 'horizontal'));
      elementBottoms.forEach(b => checkValue(b, elTop, 'horizontal'));
      elementBottoms.forEach(b => checkValue(b, elBottom, 'horizontal'));
      elementCentersX.forEach(c => checkValue(c, elCenterX, 'vertical'));
      elementCentersY.forEach(c => checkValue(c, elCenterY, 'horizontal'));
    }
    
    return guides;
  }, [currentScreenshot, canvasWidth, canvasHeight]);

  const handleMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    
    const isAlreadySelected = selectedElements.some(el => el.id === element.id);
    
    if (e.shiftKey) {
      addToSelectedElements(element);
    } else if (!isAlreadySelected) {
      setSelectedElement(element);
    }
    
    const positions = new Map<string, { x: number; y: number }>();
    const elementsToDrag = isAlreadySelected && e.shiftKey 
      ? [...selectedElements, element] 
      : isAlreadySelected 
        ? selectedElements 
        : [element];
    
    elementsToDrag.forEach(el => {
      positions.set(el.id, { x: (el as any).x, y: (el as any).y });
    });

    setDragState({
      isDragging: true,
      elementIds: elementsToDrag.map(el => el.id),
      startX: e.clientX,
      startY: e.clientY,
      elementStartPositions: positions,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, element: CanvasElement, handle: string) => {
    e.stopPropagation();
    
    if (!selectedElements.some(el => el.id === element.id)) {
      setSelectedElement(element);
    }

    const deviceConfig = element.type === 'device' ? DEVICE_MOCKUPS.find(d => d.id === element.deviceId) : null;
    const realisticDevice = element.type === 'device' ? getRealisticDeviceById(element.deviceId) : null;
    
    let aspectRatio = element.width / element.height;
    if (realisticDevice) {
      aspectRatio = realisticDevice.mockupDimensions.width / realisticDevice.mockupDimensions.height;
    } else if (deviceConfig) {
      aspectRatio = deviceConfig.width / deviceConfig.height;
    }

    setResizeState({
      isResizing: true,
      elementId: element.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      elementStartWidth: element.width,
      elementStartHeight: element.height,
      elementStartX: element.x,
      elementStartY: element.y,
      aspectRatio,
    });
  };

  useEffect(() => {
    const { panoramicMode } = useStore.getState();
  const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && dragState.elementIds.length > 0) {
        const deltaX = (e.clientX - dragState.startX) / zoom;
        const deltaY = (e.clientY - dragState.startY) / zoom;

        if (!currentScreenshot) return;

        const elementsToMove = currentScreenshot.elements.filter(el =>
          dragState.elementIds.includes(el.id)
        );

        if (elementsToMove.length === 0) return;

        const guides = findAlignmentGuides(elementsToMove, deltaX, deltaY);

        // Add panoramic snap: snap edges of dragged elements to edges of other elements
        if (panoramicMode) {
          const threshold = 5;
          elementsToMove.forEach(el => {
            const elLeft = (el as any).x + deltaX;
            const elRight = (el as any).x + (el as any).width + deltaX;
            const elTop = (el as any).y + deltaY;
            const elBottom = (el as any).y + (el as any).height + deltaY;

            currentScreenshot.elements.forEach(other => {
              if (dragState.elementIds.includes(other.id)) return;

              const oLeft = (other as any).x;
              const oRight = (other as any).x + (other as any).width;
              const oTop = (other as any).y;
              const oBottom = (other as any).y + (other as any).height;

              // Snap right edge to left edge
              if (Math.abs(elRight - oLeft) < threshold) {
                guides.push({ type: 'vertical', position: oLeft });
              }
              // Snap left edge to right edge
              if (Math.abs(elLeft - oRight) < threshold) {
                guides.push({ type: 'vertical', position: oRight });
              }
              // Snap bottom edge to top edge
              if (Math.abs(elBottom - oTop) < threshold) {
                guides.push({ type: 'horizontal', position: oTop });
              }
              // Snap top edge to bottom edge
              if (Math.abs(elTop - oBottom) < threshold) {
                guides.push({ type: 'horizontal', position: oBottom });
              }
            });
          });
        }

        setAlignmentGuides(guides);

        let snapOffsetX = 0;
        let snapOffsetY = 0;

        for (const guide of guides) {
          if (guide.type === 'vertical' && elementsToMove.length > 0) {
            const firstEl = elementsToMove[0];
            const newCenterX = (firstEl as any).x + (firstEl as any).width / 2 + deltaX;
            if (Math.abs(newCenterX - guide.position) < 5) {
              snapOffsetX = guide.position - (firstEl as any).x - (firstEl as any).width / 2 - deltaX;
            }
          }
          if (guide.type === 'horizontal' && elementsToMove.length > 0) {
            const firstEl = elementsToMove[0];
            const newCenterY = (firstEl as any).y + (firstEl as any).height / 2 + deltaY;
            if (Math.abs(newCenterY - guide.position) < 5) {
              snapOffsetY = guide.position - (firstEl as any).y - (firstEl as any).height / 2 - deltaY;
            }
          }
        }

        const adjustedDeltaX = showGrid ? snapToGrid(deltaX + snapOffsetX) - snapOffsetX : deltaX + snapOffsetX;
        const adjustedDeltaY = showGrid ? snapToGrid(deltaY + snapOffsetY) - snapOffsetY : deltaY + snapOffsetY;
        
        elementsToMove.forEach(el => {
          const startPos = dragState.elementStartPositions.get(el.id);
          if (startPos) {
            updateElement(el.id, {
              x: Math.round(startPos.x + adjustedDeltaX),
              y: Math.round(startPos.y + adjustedDeltaY),
            });
          }
        });
      }

      if (resizeState.isResizing && resizeState.elementId) {
        const deltaX = (e.clientX - resizeState.startX) / zoom;
        const deltaY = (e.clientY - resizeState.startY) / zoom;

        const currentElement = currentScreenshot?.elements.find(el => el.id === resizeState.elementId);
        const isDevice = currentElement?.type === 'device';
        const aspectRatio = resizeState.aspectRatio;

        let newWidth = resizeState.elementStartWidth;
        let newHeight = resizeState.elementStartHeight;
        let newX = resizeState.elementStartX;
        let newY = resizeState.elementStartY;

        if (isDevice) {
          if (resizeState.handle === 'se' || resizeState.handle === 'e' || resizeState.handle === 's') {
            const newSize = Math.max(50, Math.max(
              resizeState.elementStartWidth + deltaX,
              (resizeState.elementStartHeight + deltaY) * aspectRatio
            ));
            newWidth = newSize;
            newHeight = newSize / aspectRatio;
          } else if (resizeState.handle === 'sw' || resizeState.handle === 'w') {
            const newSize = Math.max(50, Math.max(
              resizeState.elementStartWidth - deltaX,
              (resizeState.elementStartHeight + deltaY) * aspectRatio
            ));
            newWidth = newSize;
            newHeight = newSize / aspectRatio;
            newX = resizeState.elementStartX + (resizeState.elementStartWidth - newWidth);
          } else if (resizeState.handle === 'nw' || resizeState.handle === 'n') {
            const newSize = Math.max(50, Math.max(
              resizeState.elementStartWidth - deltaX,
              (resizeState.elementStartHeight - deltaY) * aspectRatio
            ));
            newWidth = newSize;
            newHeight = newSize / aspectRatio;
            newX = resizeState.elementStartX + (resizeState.elementStartWidth - newWidth);
            newY = resizeState.elementStartY + (resizeState.elementStartHeight - newHeight);
          } else if (resizeState.handle === 'ne') {
            const newSize = Math.max(50, Math.max(
              resizeState.elementStartWidth + deltaX,
              (resizeState.elementStartHeight - deltaY) * aspectRatio
            ));
            newWidth = newSize;
            newHeight = newSize / aspectRatio;
            newY = resizeState.elementStartY + (resizeState.elementStartHeight - newHeight);
          }
        } else {
          if (resizeState.handle.includes('e')) {
            newWidth = Math.max(50, resizeState.elementStartWidth + deltaX);
          }
          if (resizeState.handle.includes('w')) {
            const widthDelta = deltaX;
            newWidth = Math.max(50, resizeState.elementStartWidth - widthDelta);
            newX = snapToGrid(resizeState.elementStartX + widthDelta);
          }
          if (resizeState.handle.includes('s')) {
            newHeight = Math.max(30, resizeState.elementStartHeight + deltaY);
          }
          if (resizeState.handle.includes('n')) {
            const heightDelta = deltaY;
            newHeight = Math.max(30, resizeState.elementStartHeight - heightDelta);
            newY = snapToGrid(resizeState.elementStartY + heightDelta);
          }
        }

        updateElement(resizeState.elementId, {
          width: Math.round(newWidth),
          height: Math.round(newHeight),
          x: Math.round(newX),
          y: Math.round(newY),
        });
      }
    };

    const handleMouseUp = () => {
      if (dragState.isDragging) {
        pushHistory();
      }
      if (resizeState.isResizing) {
        pushHistory();
      }
      setDragState(prev => ({ ...prev, isDragging: false, elementIds: [] }));
      setResizeState(prev => ({ ...prev, isResizing: false, elementId: null }));
      setAlignmentGuides([]);
    };

    if (dragState.isDragging || resizeState.isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, zoom, updateElement, pushHistory, currentScreenshot, showGrid, snapToGrid, findAlignmentGuides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentScreenshot) return;
      
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const { nudgeSelected } = useStore.getState();
      const nudgeAmount = e.shiftKey ? 10 : 1;
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeSelected(0, -nudgeAmount);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudgeSelected(0, nudgeAmount);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudgeSelected(-nudgeAmount, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudgeSelected(nudgeAmount, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreenshot]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      if (!e.shiftKey) {
        clearSelectedElements();
      }
    }
  };

  const getBackgroundStyle = () => {
    if (!currentScreenshot) return {};
    const bg = currentScreenshot.background;
    
    if (bg.type === 'solid') {
      return { backgroundColor: bg.value };
    } else if (bg.type === 'gradient') {
      return { background: bg.value };
    } else if (bg.type === 'image') {
      return { 
        backgroundImage: `url(${bg.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  const renderElement = (element: CanvasElement, index: number) => {
    const isSelected = selectedElements.some(el => el.id === element.id);
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      cursor: 'move',
      zIndex: index + 1,
    };

    const selectionStyle: React.CSSProperties = isSelected ? {
      outline: '2px solid #58a6ff',
      outlineOffset: '2px',
      boxShadow: '0 0 0 1px rgba(88, 166, 255, 0.5)',
    } : {};

    const renderResizeHandles = () => {
      if (!isSelected) return null;
      
      const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
      const handlePositions: Record<string, React.CSSProperties> = {
        nw: { top: -6, left: -6, cursor: 'nwse-resize' },
        n: { top: -6, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
        ne: { top: -6, right: -6, cursor: 'nesw-resize' },
        w: { top: '50%', left: -6, transform: 'translateY(-50%)', cursor: 'ew-resize' },
        e: { top: '50%', right: -6, transform: 'translateY(-50%)', cursor: 'ew-resize' },
        sw: { bottom: -6, left: -6, cursor: 'nesw-resize' },
        s: { bottom: -6, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
        se: { bottom: -6, right: -6, cursor: 'nwse-resize' },
      };

      return handles.map(handle => (
        <div
          key={handle}
          className="absolute w-3 h-3 bg-white border-2 border-[#58a6ff] rounded-sm z-50 shadow-lg"
          style={handlePositions[handle]}
          onMouseDown={(e) => handleResizeMouseDown(e, element, handle)}
        />
      ));
    };

    switch (element.type) {
      case 'text':
        return (
          <TextElementComponent
            element={element as TextElement}
            style={{
              ...baseStyle,
              ...selectionStyle,
              fontWeight: element.fontWeight,
              fontFamily: element.fontFamily,
              color: element.color,
              textAlign: element.textAlign,
              lineHeight: element.lineHeight,
              letterSpacing: element.letterSpacing,
            }}
            onMouseDown={(e, el) => handleMouseDown(e, el as any)}
            renderResizeHandles={() => renderResizeHandles()}
          />
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectionStyle,
              overflow: 'hidden',
              borderRadius: '8px',
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            <img
              src={element.src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.objectFit,
              }}
              draggable={false}
            />
            {renderResizeHandles()}
          </div>
        );

      case 'device': {
        const deviceElement = element as DeviceElement;
        const deviceConfig = DEVICE_MOCKUPS.find(d => d.id === element.deviceId);
        
        if (deviceElement.renderMode === '3d') {
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                ...selectionStyle,
              }}
              onMouseDown={(e) => handleMouseDown(e, element)}
            >
              <Device3DPreview
                deviceId={element.deviceId}
                orientation={deviceElement.orientation || 'portrait'}
                screenshotSrc={element.screenshotSrc}
                width={element.width}
                height={element.height}
                cameraAngle={deviceElement.cameraAngle || 'front'}
              />
              {renderResizeHandles()}
            </div>
          );
        }

        if (deviceElement.renderMode === 'realistic') {
          const realisticDevice = getRealisticDeviceById(deviceElement.deviceId);
          
          if (realisticDevice) {
            const mockupPath = realisticDevice.mockupPath.replace(/'/g, '%27');
            const screenshotScale = (element as any).screenshotScale || 1;
            const mockupWidth = realisticDevice.mockupDimensions.width;
            const mockupHeight = realisticDevice.mockupDimensions.height;
            const screenX = realisticDevice.screenArea.x;
            const screenY = realisticDevice.screenArea.y;
            const screenW = realisticDevice.screenArea.width;
            const screenH = realisticDevice.screenArea.height;
            
            const screenLeftPct = (screenX / mockupWidth) * 100;
            const screenTopPct = (screenY / mockupHeight) * 100;
            const screenWidthPct = (screenW / mockupWidth) * 100;
            const screenHeightPct = (screenH / mockupHeight) * 100;
            
            // Calculate corner radius based on mockup scale
            const scaleX = element.width / mockupWidth;
            const cornerRadius = realisticDevice.screenCornerRadius * scaleX;
            
            return (
              <div
                key={element.id}
                style={{
                  ...baseStyle,
                  ...selectionStyle,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                }}
                onMouseDown={(e) => handleMouseDown(e, element)}
              >
                <div className="relative w-full h-full">
                  {/* Screenshot container - positioned exactly at screen area with overflow hidden */}
                  {element.screenshotSrc && (
                    <div
                      style={{
                        position: 'absolute',
                        left: screenLeftPct + '%',
                        top: screenTopPct + '%',
                        width: screenWidthPct + '%',
                        height: screenHeightPct + '%',
                        overflow: 'hidden',
                        borderRadius: cornerRadius + 'px',
                        zIndex: 1,
                      }}
                    >
                      <img
                        src={element.screenshotSrc}
                        alt="Screenshot"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'fill',
                          transform: `scale(${screenshotScale}) translate(${((element as any).screenshotOffsetX || 0)}px, ${((element as any).screenshotOffsetY || 0)}px)`,
                          transformOrigin: 'center center',
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Device Mockup Frame - MUST be on top of screenshot */}
                  <img
                    src={mockupPath}
                    alt="Device Mockup"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                </div>
                {renderResizeHandles()}
              </div>
            );
          }
        }
        
        const frameColor = deviceConfig?.frameColor || '#21262d';
        const cornerRadius = deviceConfig?.cornerRadius || 40;
        const bezelWidth = deviceConfig?.bezelWidth || 12;
        const notch = deviceConfig?.notch;
        const rotation = deviceElement.rotation || 0;
        const orientation = deviceElement.orientation || 'portrait';
        const isTitanium = frameColor === '#1c1c1e';
        
        let displayWidth = element.width;
        let displayHeight = element.height;
        
        if (orientation !== 'portrait') {
          displayWidth = element.height;
          displayHeight = element.width;
        }
        
        const scaleX = displayWidth / (deviceConfig?.width || 393);
        const scaleY = displayHeight / (deviceConfig?.height || 852);
        
        const orientationRotation = orientation === 'landscape-left' ? -90 : orientation === 'landscape-right' ? 90 : 0;
        const totalRotation = rotation + orientationRotation;
        
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectionStyle,
              transform: totalRotation !== 0 ? `rotate(${totalRotation}deg)` : undefined,
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.showFrame ? (
              <div
                className="relative w-full h-full"
                style={{
                  backgroundColor: frameColor,
                  borderRadius: cornerRadius * scaleX,
                  padding: bezelWidth * scaleX,
                  boxShadow: isTitanium 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)' 
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Glossy reflection overlay */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `linear-gradient(${135 * Math.PI / 180}deg, 
                      rgba(255,255,255,0.08) 0%, 
                      rgba(255,255,255,0.02) 30%, 
                      transparent 50%, 
                      rgba(255,255,255,0.02) 100%)`,
                    borderRadius: cornerRadius * scaleX,
                  }}
                />
                
                {/* Dynamic Island */}
                {notch?.type === 'dynamic-island' && (
                  <div
                    className="absolute left-1/2 z-20"
                    style={{
                      width: (notch.width || 126) * scaleX,
                      height: (notch.height || 37) * scaleY,
                      borderRadius: (notch.height || 37) * scaleY * 0.5,
                      top: (notch.topOffset || 12) * scaleY,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#000',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Front camera */}
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-1.5 h-1.5 bg-[#0a0a0a] rounded-full" 
                      style={{ background: 'radial-gradient(circle at 40% 40%, #222, #000)' }} 
                    />
                    {/* Face ID sensors */}
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 flex items-center gap-0.5">
                      <div className="w-1 h-1 bg-[#1a3a5c] rounded-full" style={{ boxShadow: '0 0 2px #1a3a5c' }} />
                      <div className="w-0.5 h-0.5 bg-[#0a0a0a] rounded-full" />
                    </div>
                  </div>
                )}
                
                {/* Notch */}
                {notch?.type === 'notch' && (
                  <div
                    className="absolute left-1/2 z-20"
                    style={{
                      width: (notch.width || 180) * scaleX,
                      height: (notch.height || 34) * scaleY,
                      borderRadius: `0 0 ${12 * scaleX}px ${12 * scaleX}px`,
                      top: (notch.topOffset || 12) * scaleY,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#000',
                    }}
                  >
                    {/* Speaker grill */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-0.5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-2 bg-[#222] rounded-full" />
                      ))}
                    </div>
                    {/* Camera */}
                    <div 
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, #1a1a1a, #000)',
                        boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                )}
                
                {/* Punch-hole camera */}
                {notch?.type === 'punch-hole' && (
                  <div
                    className="absolute z-20"
                    style={{
                      width: (notch.width || 12) * scaleX,
                      height: (notch.height || 12) * scaleX,
                      borderRadius: '50%',
                      top: (notch.topOffset || 12) * scaleY + (bezelWidth * scaleY),
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#000',
                      boxShadow: 'inset 0 0 3px rgba(255,255,255,0.05)',
                    }}
                  >
                    <div 
                      className="absolute inset-0.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #1a1a1a, #000)',
                      }}
                    />
                  </div>
                )}
                
                {/* Pill-shaped camera */}
                {notch?.type === 'pill' && (
                  <div
                    className="absolute z-20"
                    style={{
                      width: (notch.width || 48) * scaleX,
                      height: (notch.height || 14) * scaleY,
                      borderRadius: (notch.height || 14) * scaleY * 0.5,
                      top: (notch.topOffset || 12) * scaleY + (bezelWidth * scaleY),
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#000',
                      boxShadow: 'inset 0 0 3px rgba(255,255,255,0.05)',
                    }}
                  >
                    <div 
                      className="absolute inset-0.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #1a1a1a, #000)',
                      }}
                    />
                    {/* Camera lens */}
                    <div 
                      className="absolute top-1/2 left-1/3 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, #0f3460, #1a1a1a)',
                        boxShadow: '0 0 2px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                  </div>
                )}
                
                {/* Screen */}
                <div
                  className="w-full h-full overflow-hidden relative"
                  style={{
                    borderRadius: (cornerRadius - 4) * scaleX,
                    backgroundImage: element.screenshotSrc ? `url(${element.screenshotSrc})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: element.screenshotSrc ? undefined : '#0a0a0a',
                  }}
                >
                  {/* Screen reflection */}
                  {!element.screenshotSrc && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%)',
                      }}
                    />
                  )}
                  {!element.screenshotSrc && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#4a4a4a] text-xs">
                      <Smartphone className="w-8 h-8 mb-2 opacity-50" />
                      Drop screenshot
                    </div>
                  )}
                  {element.screenshotSrc && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.1) 100%)',
                        borderRadius: (cornerRadius - 4) * scaleX,
                      }}
                    />
                  )}
                </div>
                
                {/* Home indicator */}
                {deviceConfig?.hasHomeIndicator && (
                  <div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: 120 * scaleX,
                      height: 4 * scaleY,
                      borderRadius: 2 * scaleX,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    }}
                  />
                )}
                
                {/* Side buttons - Power */}
                <div
                  className="absolute"
                  style={{
                    width: 3 * scaleX,
                    height: 60 * scaleY,
                    top: 80 * scaleY,
                    right: -2 * scaleX,
                    borderRadius: '1px 2px 2px 1px',
                    background: isTitanium 
                      ? 'linear-gradient(to right, #3a3a3a, #1c1c1e, #2a2a2a)' 
                      : 'linear-gradient(to right, #3a3a3a, #2c2c2e, #3a3a3a)',
                  }}
                />
                {/* Volume buttons */}
                <div
                  className="absolute"
                  style={{
                    width: 3 * scaleX,
                    height: 35 * scaleY,
                    top: 70 * scaleY,
                    left: -2 * scaleX,
                    borderRadius: '2px 1px 1px 2px',
                    background: isTitanium 
                      ? 'linear-gradient(to left, #3a3a3a, #1c1c1e, #2a2a2a)' 
                      : 'linear-gradient(to left, #3a3a3a, #2c2c2e, #3a3a3a)',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    width: 3 * scaleX,
                    height: 35 * scaleY,
                    top: 110 * scaleY,
                    left: -2 * scaleX,
                    borderRadius: '2px 1px 1px 2px',
                    background: isTitanium 
                      ? 'linear-gradient(to left, #3a3a3a, #1c1c1e, #2a2a2a)' 
                      : 'linear-gradient(to left, #3a3a3a, #2c2c2e, #3a3a3a)',
                  }}
                />
                {/* Mute switch */}
                <div
                  className="absolute"
                  style={{
                    width: 4 * scaleX,
                    height: 15 * scaleY,
                    top: 45 * scaleY,
                    left: -3 * scaleX,
                    borderRadius: '1px',
                    background: isTitanium ? '#3a3a3a' : '#4a4a4a',
                  }}
                />
                
                {/* Antenna lines for iPad */}
                {deviceConfig?.type === 'tablet' && (
                  <>
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#333] rounded-full" />
                    <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#222] rounded-full" />
                  </>
                )}
              </div>
            ) : (
              <div
                className="w-full h-full overflow-hidden relative"
                style={{
                  borderRadius: cornerRadius * scaleX * 0.3,
                  backgroundImage: element.screenshotSrc ? `url(${element.screenshotSrc})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: element.screenshotSrc ? undefined : '#0a0a0a',
                }}
              >
                {element.screenshotSrc && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.1) 100%)',
                      borderRadius: cornerRadius * scaleX * 0.3,
                    }}
                  />
                )}
                {!element.screenshotSrc && (
                  <div className="w-full h-full flex items-center justify-center text-[#4a4a4a] text-sm">
                    Drop screenshot
                  </div>
                )}
              </div>
            )}
            {renderResizeHandles()}
          </div>
        );
      }

      case 'shape':
        const shapeStyle: React.CSSProperties = {
          ...baseStyle,
          ...selectionStyle,
          backgroundColor: element.fill,
          border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : undefined,
          borderRadius: element.shapeType === 'circle' ? '50%' : element.shapeType === 'rounded-rect' ? (element.borderRadius || 8) : 0,
        };

        return (
          <div
            key={element.id}
            style={shapeStyle}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {renderResizeHandles()}
          </div>
        );

      default:
        return null;
    }
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8b949e 1px, transparent 1px),
            linear-gradient(to bottom, #8b949e 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
    );
  };

  const renderAlignmentGuides = () => {
    return alignmentGuides.map((guide, i) => (
      <div
        key={i}
        className="absolute bg-blue-500 pointer-events-none z-50"
        style={
          guide.type === 'vertical' 
            ? { left: guide.position * zoom, top: 0, width: 1, height: '100%' }
            : { top: guide.position * zoom, left: 0, height: 1, width: '100%' }
        }
      />
    ));
  };

  if (!currentScreenshot) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d1117] text-[#8b949e]">
        <div className="text-center">
          <p className="text-lg mb-2">No screenshot selected</p>
          <p className="text-sm">Create or select a screenshot to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#0d1117] flex items-center justify-center p-8">
      <div
        ref={canvasRef}
        data-editor-canvas
        className="relative canvas-bg shadow-2xl"
        style={{
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
          ...getBackgroundStyle(),
          transform: `scale(1)`,
          transformOrigin: 'center center',
        }}
        onClick={handleCanvasClick}
      >
        {renderGrid()}
        {renderAlignmentGuides()}
        
        {showSafeAreas && currentSize.safeArea && (
          <>
            <div
              className="absolute left-0 right-0 top-0 bg-[#f85149]/20 border-b border-[#f85149]/50 pointer-events-none z-40"
              style={{ height: currentSize.safeArea.top * zoom }}
            />
            <div
              className="absolute left-0 right-0 bottom-0 bg-[#f85149]/20 border-t border-[#f85149]/50 pointer-events-none z-40"
              style={{ height: currentSize.safeArea.bottom * zoom }}
            />
          </>
        )}

        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          {currentScreenshot.elements.map(renderElement)}
        </div>
      </div>
    </div>
  );
};
