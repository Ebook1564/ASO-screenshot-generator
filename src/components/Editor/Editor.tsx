import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { TopToolbar } from './TopToolbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { Canvas } from './Canvas';
import { ScreenshotList } from './ScreenshotList';
import { ExportModal } from './ExportModal';
import { AITextGenerator } from './AITextGenerator';
import { StorePreview } from './StorePreview';
import { Film, PanelRight } from 'lucide-react';

export const Editor: React.FC = () => {
  const {
    currentProject,
    createScreenshot,
    deleteSelectedElements,
    selectedElements,
    copySelected,
    paste,
    duplicateSelected,
    pushHistory,
    undo,
    redo,
  } = useStore();
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showStorePreview, setShowStorePreview] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showFilmstrip, setShowFilmstrip] = useState(true);

  useEffect(() => {
    if (currentProject && currentProject.screenshots.length === 0) {
      createScreenshot();
    }
  }, [currentProject, createScreenshot]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === 'INPUT' || 
                      document.activeElement?.tagName === 'TEXTAREA';
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElements.length > 0 && !isInput) {
        e.preventDefault();
        pushHistory();
        deleteSelectedElements();
      }
      
      // Undo: Ctrl+Z
      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.key === 'y' && (e.metaKey || e.ctrlKey)) || (e.key === 'z' && (e.metaKey || e.ctrlKey) && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
      
      if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowExportModal(true);
      }

      if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowAIGenerator(true);
      }

      if (e.key === 'p' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setShowStorePreview(true);
      }
      
      if (e.key === 'c' && (e.metaKey || e.ctrlKey) && selectedElements.length > 0) {
        e.preventDefault();
        copySelected();
      }
      
      if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        pushHistory();
        paste();
      }
      
      if (e.key === 'd' && (e.metaKey || e.ctrlKey) && selectedElements.length > 0) {
        e.preventDefault();
        pushHistory();
        duplicateSelected();
      }
      
      if (e.key === 'a' && (e.metaKey || e.ctrlKey) && !isInput) {
        e.preventDefault();
      }

      if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowFilmstrip(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, deleteSelectedElements, copySelected, paste, duplicateSelected, pushHistory, undo, redo]);

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d1117' }}>
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0d1117' }}>
      {/* Top Toolbar */}
      <TopToolbar 
        onExport={() => setShowExportModal(true)} 
        onAIGenerate={() => setShowAIGenerator(true)}
        onPreview={() => setShowStorePreview(true)}
        onToggleFilmstrip={() => setShowFilmstrip(prev => !prev)}
        onToggleRightSidebar={() => setShowRightSidebar(prev => !prev)}
        showFilmstrip={showFilmstrip}
        showRightSidebar={showRightSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Filmstrip + Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>

          {/* Filmstrip (Right side) */}
          {showFilmstrip && (
            <div style={{ borderLeft: '1px solid #30363d' }}>
              <ScreenshotList />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {showRightSidebar && <RightSidebar />}
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      
      <AITextGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
      />
      
      <StorePreview
        isOpen={showStorePreview}
        onClose={() => setShowStorePreview(false)}
      />
    </div>
  );
};
