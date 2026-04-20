import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Copy, Trash2, Pencil, Check, X, Film } from 'lucide-react';

export const ScreenshotList: React.FC = () => {
  const {
    currentProject,
    currentScreenshot,
    createScreenshot,
    setCurrentScreenshot,
    renameScreenshot,
    deleteScreenshot,
    duplicateScreenshot,
    reorderScreenshots,
    pushHistory,
  } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startRename = (screenshotId: string, currentName: string) => {
    setEditingId(screenshotId);
    setEditName(currentName);
  };

  const finishRename = () => {
    if (editingId && editName.trim()) {
      renameScreenshot(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      reorderScreenshots(dragIndex, dropIndex);
    }
  };

  const getBackgroundStyle = (screenshot: typeof currentProject.screenshots[0]) => {
    const bg = screenshot.background;
    if (bg.type === 'solid') {
      return { backgroundColor: bg.value };
    } else if (bg.type === 'gradient') {
      return { background: bg.value };
    }
    return { backgroundColor: '#1f6feb' };
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#161b22' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #30363d' }}>
        <div className="flex items-center gap-2" style={{ color: '#8b949e' }}>
          <Film className="w-4 h-4" />
          <span className="text-xs font-medium">Screens</span>
          <span className="text-xs" style={{ color: '#6e7681' }}>({currentProject?.screenshots.length})</span>
        </div>
        <button
          onClick={createScreenshot}
          className="p-1 rounded transition-colors"
          style={{ color: '#8b949e' }}
          title="Add Screenshot"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filmstrip */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {currentProject?.screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`group relative cursor-pointer transition-all ${
              currentScreenshot?.id === screenshot.id 
                ? 'rounded-lg' 
                : 'rounded-lg'
            }`}
            style={
              currentScreenshot?.id === screenshot.id 
                ? { boxShadow: '0 0 0 2px #1f6feb' } 
                : {}
            }
            onClick={() => setCurrentScreenshot(screenshot)}
          >
            {/* Thumbnail */}
            <div
              className="aspect-[9/16] rounded-lg overflow-hidden relative"
              style={getBackgroundStyle(screenshot)}
            >
              {/* Mini preview */}
              <div className="absolute inset-0 transform scale-[0.06] origin-top-left w-[1666%] h-[1666%]">
                {screenshot.elements.map((element) => {
                  if (element.type === 'text') {
                    return (
                      <div
                        key={element.id}
                        className="absolute rounded"
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        }}
                      />
                    );
                  }
                  if (element.type === 'device') {
                    return (
                      <div
                        key={element.id}
                        className="absolute rounded-3xl"
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </div>

              {/* Screen number badge */}
              <div className="absolute bottom-1 left-1 text-[8px] font-medium px-1.5 py-0.5 rounded" style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                {index + 1}
              </div>
            </div>

            {/* Name & Actions */}
            <div className="mt-1 px-1">
              {editingId === screenshot.id ? (
                <div className="flex items-center gap-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishRename();
                      if (e.key === 'Escape') cancelRename();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-1 py-0.5 text-[10px] rounded text-center"
                    style={{ backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d' }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      finishRename();
                    }}
                    className="p-0.5 rounded transition-colors"
                    style={{ backgroundColor: '#238636' }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] truncate flex-1 text-center" style={{ color: '#8b949e' }}>
                    {screenshot.name}
                  </span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(screenshot.id, screenshot.name);
                      }}
                      className="p-0.5 rounded transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Pencil className="w-3 h-3" style={{ color: '#8b949e' }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pushHistory();
                        duplicateScreenshot(screenshot.id);
                      }}
                      className="p-0.5 rounded transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Copy className="w-3 h-3" style={{ color: '#8b949e' }} />
                    </button>
                    {currentProject.screenshots.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          pushHistory();
                          deleteScreenshot(screenshot.id);
                        }}
                        className="p-0.5 rounded transition-colors"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <Trash2 className="w-3 h-3" style={{ color: '#8b949e' }} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add button */}
        <button
          onClick={createScreenshot}
          className="w-full aspect-[9/16] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
          style={{ borderColor: '#30363d', backgroundColor: 'transparent' }}
        >
          <Plus className="w-5 h-5" style={{ color: '#8b949e' }} />
          <span className="text-[10px]" style={{ color: '#8b949e' }}>Add</span>
        </button>
      </div>
    </div>
  );
};
