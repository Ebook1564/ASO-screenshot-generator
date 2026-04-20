import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  ChevronRight,
  ChevronDown,
  Globe,
  Layers,
  Image,
  Type,
  Plus,
  Trash2,
  Check,
  X,
  Download,
  Upload,
  Languages,
  FolderOpen,
} from 'lucide-react';
import { LocalizationTree, SUPPORTED_LANGUAGES } from '../../types';
import { localizationFiles } from '../../data/localization';

const JSON_FILE_MAP: Record<string, string> = {
  'en': 'en-US.json',
  'en-US': 'en-US.json',
  'es': 'es.json',
  'fr': 'fr.json',
  'de': 'de.json',
  'it': 'it.json',
  'pt': 'pt.json',
  'ja': 'ja.json',
  'ko': 'ko.json',
  'zh': 'zh.json',
  'hi': 'hi-IN.json',
  'hi-IN': 'hi-IN.json',
  'ar': 'ar.json',
  'ru': 'ru.json',
  'nl': 'nl.json',
  'sv': 'sv.json',
  'tr': 'tr.json',
  'pl': 'pl.json',
};

interface TreeNodeProps {
  label: string;
  icon: React.ReactNode;
  count?: number;
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  isActive?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  icon,
  count,
  children,
  isOpen,
  onToggle,
  isActive,
  onClick,
  actions,
}) => {
  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          isActive ? 'bg-[#238636]/20 text-[#e6edf3]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'
        }`}
        onClick={children ? onToggle : onClick}
      >
        {children && (
          <span className="w-4 h-4 flex items-center justify-center">
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {!children && <span className="w-4" />}
        {icon}
        <span className="flex-1 text-sm truncate">{label}</span>
        {count !== undefined && (
          <span className="text-xs text-[#6e7681] bg-[#21262d] px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      {isOpen && children && (
        <div className="ml-4 border-l border-[#30363d] pl-2 mt-1">{children}</div>
      )}
    </div>
  );
};

interface SmallActionButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
}

const SmallActionButton: React.FC<SmallActionButtonProps> = ({ icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-1 hover:bg-[#30363d] rounded transition-colors"
  >
    {icon}
  </button>
);

export const countTreeElements = (tree: LocalizationTree) => {
  let totalScreens = 0;
  let totalImages = 0;
  let totalTexts = 0;

  tree.languages.forEach((lang) => {
    totalScreens += lang.screens.length;
    lang.screens.forEach((screen) => {
      totalImages += screen.images.length;
      totalTexts += screen.texts.length;
    });
  });

  return { totalScreens, totalImages, totalTexts };
};

export const LocalizationTreePanel: React.FC = () => {
  const { 
    currentProject, 
    localizationTree, 
    initializeLocalizationTree,
    addLocalizationLanguage,
    removeLocalizationLanguage,
    updateTranslation,
  } = useStore();
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<{ id: string; type: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (currentProject) {
      initializeLocalizationTree();
      setInitialized(true);
    }
  }, [currentProject, initializeLocalizationTree]);

  useEffect(() => {
    if (localizationTree?.languages.length && initialized && expandedNodes.size === 0) {
      setExpandedNodes(new Set([localizationTree.languages[0].id]));
    }
  }, [localizationTree, initialized]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleAddLanguage = (langCode: string) => {
    const jsonData = localizationFiles[langCode] || localizationFiles[JSON_FILE_MAP[langCode]];
    addLocalizationLanguage(langCode, jsonData || null);
    setShowAddLanguage(false);
  };

  const handleRemoveLanguage = (langId: string) => {
    removeLocalizationLanguage(langId);
  };

  const handleUpdateTranslation = (
    langId: string,
    screenId: string,
    textId: string,
    value: string
  ) => {
    updateTranslation(langId, screenId, textId, value);
  };

  const exportLocalization = () => {
    if (!localizationTree) return;

    const exportData: Record<string, Record<string, Record<string, string>>> = {};
    
    localizationTree.languages.forEach((lang) => {
      exportData[lang.code] = {};
      lang.screens.forEach((screen) => {
        exportData[lang.code][screen.id] = {};
        screen.texts.forEach((text) => {
          exportData[lang.code][screen.id][text.id] = text.translatedContent?.[lang.code] || text.content;
        });
      });
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject?.name || 'localization'}_translations.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importLocalization = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        console.log('Imported localization data:', data);
      } catch (err) {
        console.error('Failed to parse localization file:', err);
      }
    };
    reader.readAsText(file);
  };

  const stats = useMemo(() => {
    if (!localizationTree) return { languages: 0, screens: 0, images: 0, texts: 0, translated: 0, totalTranslations: 0, progress: 0 };
    
    let screens = 0;
    let images = 0;
    let texts = 0;
    let translated = 0;
    let totalTranslations = 0;

    localizationTree.languages.forEach((lang) => {
      screens = Math.max(screens, lang.screens.length);
      lang.screens.forEach((screen) => {
        images += screen.images.length;
        texts += screen.texts.length;
        screen.texts.forEach((text) => {
          totalTranslations++;
          if (text.translatedContent?.[lang.code]) {
            translated++;
          }
        });
      });
    });

    return {
      languages: localizationTree.languages.length,
      screens,
      images,
      texts,
      translated,
      totalTranslations,
      progress: totalTranslations > 0 ? Math.round((translated / totalTranslations) * 100) : 0,
    };
  }, [localizationTree]);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-[#6e7681] text-sm p-4 text-center">
        <div>
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Create a project to manage localizations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* Header */}
      <div className="p-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#58a6ff]" />
            <span className="text-sm font-medium text-[#e6edf3]">Localization</span>
          </div>
          <div className="flex items-center gap-1">
            <SmallActionButton
              icon={<Plus className="w-3 h-3" />}
              onClick={() => setShowAddLanguage(true)}
              title="Add Language"
            />
            <SmallActionButton
              icon={<Download className="w-3 h-3" />}
              onClick={exportLocalization}
              title="Export Translations"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#161b22] rounded p-2">
            <div className="text-lg font-bold text-[#e6edf3]">{stats.languages}</div>
            <div className="text-xs text-[#6e7681]">Languages</div>
          </div>
          <div className="bg-[#161b22] rounded p-2">
            <div className="text-lg font-bold text-[#e6edf3]">{stats.screens}</div>
            <div className="text-xs text-[#6e7681]">Screens</div>
          </div>
          <div className="bg-[#161b22] rounded p-2">
            <div className="text-lg font-bold text-[#e6edf3]">{stats.texts}</div>
            <div className="text-xs text-[#6e7681]">Texts</div>
          </div>
          <div className="bg-[#161b22] rounded p-2">
            <div className="text-lg font-bold text-[#238636]">{stats.progress}%</div>
            <div className="text-xs text-[#6e7681]">Done</div>
          </div>
        </div>
      </div>

      {/* Add Language Modal */}
      {showAddLanguage && (
        <div className="p-3 border-b border-[#30363d] bg-[#161b22]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#e6edf3]">Add Language</span>
            <button onClick={() => setShowAddLanguage(false)} className="p-1 hover:bg-[#21262d] rounded">
              <X className="w-3 h-3 text-[#8b949e]" />
            </button>
          </div>

          {/* External JSON Folder Info */}
          <div className="mb-3 px-2 py-1.5 bg-[#21262d] rounded">
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <FolderOpen className="w-3 h-3" />
              <span className="truncate">Scanning: regional_text folder</span>
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1">
            {SUPPORTED_LANGUAGES.filter(
              (l) => !localizationTree?.languages.some((lang) => lang.code === l.code) &&
                     JSON_FILE_MAP[l.code]
            ).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleAddLanguage(lang.code)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#21262d] text-left border border-[#30363d] hover:border-[#58a6ff] transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-[#e6edf3]">{lang.name}</span>
                  <span className="text-xs text-[#6e7681]">{JSON_FILE_MAP[lang.code]}</span>
                </div>
                <span className="text-xs text-[#58a6ff] bg-[#58a6ff]/10 px-1.5 py-0.5 rounded">Available</span>
              </button>
            ))}
            {SUPPORTED_LANGUAGES.filter(
              (l) => !localizationTree?.languages.some((lang) => lang.code === l.code) &&
                     !JSON_FILE_MAP[l.code]
            ).length > 0 && (
              <>
                <div className="text-xs text-[#6e7681] mt-2 px-2">Languages without JSON files:</div>
                {SUPPORTED_LANGUAGES.filter(
                  (l) => !localizationTree?.languages.some((lang) => lang.code === l.code) &&
                         !JSON_FILE_MAP[l.code]
                ).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleAddLanguage(lang.code)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#21262d] text-left opacity-50"
                  >
                    <span className="text-sm text-[#e6edf3]">{lang.name}</span>
                    <span className="text-xs text-[#6e7681]">{lang.nativeName}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2">
        {localizationTree?.languages.map((lang) => (
          <div key={lang.id} className="mb-2">
            <TreeNode
              label={lang.name}
              icon={<Globe className="w-4 h-4" />}
              count={lang.screens.length}
              isOpen={expandedNodes.has(lang.id)}
              onToggle={() => toggleNode(lang.id)}
              actions={
                localizationTree.languages.length > 1 && (
                  <SmallActionButton
                    icon={<Trash2 className="w-3 h-3 text-[#f85149]" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLanguage(lang.id);
                    }}
                    title="Remove Language"
                  />
                )
              }
            >
              {lang.screens.map((screen) => (
                <div key={screen.id}>
                  <TreeNode
                    label={screen.name}
                    icon={<Layers className="w-4 h-4" />}
                    count={screen.texts.length}
                    isOpen={expandedNodes.has(screen.id)}
                    onToggle={() => toggleNode(screen.id)}
                    isActive={selectedScreen === screen.id}
                    onClick={() => setSelectedScreen(screen.id)}
                  >
                    {/* Images */}
                    {screen.images.length > 0 && (
                      <TreeNode
                        label="Images"
                        icon={<Image className="w-4 h-4" />}
                        count={screen.images.length}
                      >
                        {screen.images.map((img) => (
                          <TreeNode
                            key={img.id}
                            label={img.name}
                            icon={<Image className="w-4 h-4" />}
                          />
                        ))}
                      </TreeNode>
                    )}

                    {/* Texts */}
                    <TreeNode
                      label="Texts"
                      icon={<Type className="w-4 h-4" />}
                      count={screen.texts.length}
                      isOpen={expandedNodes.has(`${screen.id}-texts`)}
                      onToggle={() => toggleNode(`${screen.id}-texts`)}
                    >
                      {screen.texts.map((text) => (
                        <div key={text.id} className="my-1">
                          {editingNode?.id === text.id && editingNode.type === 'text' ? (
                            <div className="flex items-center gap-2 px-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-sm text-[#e6edf3]"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateTranslation(lang.id, screen.id, text.id, editValue);
                                    setEditingNode(null);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingNode(null);
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  handleUpdateTranslation(lang.id, screen.id, text.id, editValue);
                                  setEditingNode(null);
                                }}
                                className="p-1 hover:bg-[#238636]/20 rounded"
                              >
                                <Check className="w-3 h-3 text-[#238636]" />
                              </button>
                              <button
                                onClick={() => setEditingNode(null)}
                                className="p-1 hover:bg-[#f85149]/20 rounded"
                              >
                                <X className="w-3 h-3 text-[#f85149]" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`flex items-center gap-2 px-2 py-1 rounded ${
                                text.translatedContent?.[lang.code]
                                  ? 'bg-[#238636]/10'
                                  : 'bg-[#21262d]'
                              }`}
                            >
                              <Type className="w-4 h-4 text-[#8b949e] flex-shrink-0" />
                              <span
                                className="flex-1 text-sm text-[#e6edf3] truncate cursor-pointer"
                                onClick={() => {
                                  setEditingNode({ id: text.id, type: 'text' });
                                  setEditValue(
                                    text.translatedContent?.[lang.code] || text.content
                                  );
                                }}
                                title={text.translatedContent?.[lang.code] || text.content}
                              >
                                {text.translatedContent?.[lang.code] || text.content}
                              </span>
                              {text.translatedContent?.[lang.code] && (
                                <span className="text-xs text-[#238636]">Translated</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </TreeNode>
                  </TreeNode>
                </div>
              ))}
            </TreeNode>
          </div>
        ))}
      </div>

      {/* Import Button */}
      <div className="p-3 border-t border-[#30363d]">
        <label className="flex items-center justify-center gap-2 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] rounded-md cursor-pointer transition-colors">
          <Upload className="w-4 h-4 text-[#8b949e]" />
          <span className="text-sm text-[#8b949e]">Import Translations</span>
          <input
            type="file"
            accept=".json"
            onChange={importLocalization}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
