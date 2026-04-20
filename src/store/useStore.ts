import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Project, Screenshot, CanvasElement, Platform, Background, IOS_SIZES, ANDROID_SIZES, LocalizationTree, TextElementNode, ImageElementNode, ScreenNode, LanguageNode, SUPPORTED_LANGUAGES } from '../types';

const STORAGE_KEY = 'aso-screenshot-studio';

interface AppState {
  projects: Project[];
  currentProject: Project | null;
  
  currentScreenshot: Screenshot | null;
  selectedElements: CanvasElement[];
  clipboard: CanvasElement[];
  currentPlatform: Platform;
  currentSizeId: string;
  showSafeAreas: boolean;
  showDeviceFrame: boolean;
  showGrid: boolean;
  gridSize: number;
  zoom: number;
  
  history: Screenshot[][];
  historyIndex: number;
  
  view: 'dashboard' | 'editor';
  leftSidebarTab: 'templates' | 'assets' | 'icons' | 'text-styles' | 'backgrounds' | 'localization';
  
  localizationTree: LocalizationTree | null;
  
  generateLocalizationTreeFromStore: () => LocalizationTree | null;
  initializeLocalizationTree: () => LocalizationTree | null;
  addLocalizationLanguage: (langCode: string) => void;
  removeLocalizationLanguage: (langId: string) => void;
  updateTranslation: (langId: string, screenId: string, textId: string, value: string) => void;
  resetLocalizationTree: () => void;
  
  createProject: (name: string, appName: string, platform: Platform) => Project;
  setCurrentProject: (project: Project | null) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  
  createScreenshot: () => Screenshot;
  setCurrentScreenshot: (screenshot: Screenshot | null) => void;
  updateScreenshot: (screenshot: Screenshot, shouldPushHistory?: boolean) => void;
  renameScreenshot: (screenshotId: string, newName: string) => void;
  deleteScreenshot: (screenshotId: string) => void;
  reorderScreenshots: (startIndex: number, endIndex: number) => void;
  duplicateScreenshot: (screenshotId: string) => void;
  
  addElement: (element: CanvasElement) => void;
  addElements: (elements: CanvasElement[]) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  deleteSelectedElements: () => void;
  setSelectedElement: (element: CanvasElement | null) => void;
  addToSelectedElements: (element: CanvasElement) => void;
  clearSelectedElements: () => void;
  bringForward: (elementId: string) => void;
  sendBackward: (elementId: string) => void;
  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  
  copySelected: () => void;
  paste: () => void;
  duplicateSelected: () => void;
  nudgeSelected: (dx: number, dy: number) => void;
  
  setCurrentPlatform: (platform: Platform) => void;
  setCurrentSizeId: (sizeId: string) => void;
  setShowSafeAreas: (show: boolean) => void;
  setShowDeviceFrame: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setGridSize: (size: number) => void;
  setZoom: (zoom: number) => void;
  
  setView: (view: 'dashboard' | 'editor') => void;
  setLeftSidebarTab: (tab: 'templates' | 'assets' | 'icons' | 'text-styles' | 'backgrounds' | 'localization') => void;
  
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  saveProjects: () => void;
}

const createDefaultBackground = (): Background => ({
  type: 'gradient',
  value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientDirection: '135deg',
  gradientColors: ['#667eea', '#764ba2'],
});

const saveToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

const loadFromStorage = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const projects = JSON.parse(data);
      return projects.map((p: Project) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return [];
};

const storedProjects = loadFromStorage();

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: storedProjects,
      currentProject: null,
      currentScreenshot: null,
      selectedElements: [],
      clipboard: [],
      currentPlatform: 'ios',
      currentSizeId: 'ios-6.7',
      showSafeAreas: true,
      showDeviceFrame: true,
      showGrid: false,
      gridSize: 20,
      zoom: 0.35,
      history: [],
      historyIndex: -1,
      view: 'dashboard',
      leftSidebarTab: 'templates',
      localizationTree: null,
  
  generateLocalizationTreeFromStore: () => {
    const { currentProject } = get();
    if (!currentProject) return null;

    const screens: ScreenNode[] = currentProject.screenshots.map((screen) => {
      const images: ImageElementNode[] = [];
      const texts: TextElementNode[] = [];

      screen.elements.forEach((el: CanvasElement) => {
        if (el.type === 'image') {
          images.push({
            id: el.id,
            type: 'image',
            name: `Image ${images.length + 1}`,
          });
        } else if (el.type === 'text') {
          texts.push({
            id: el.id,
            type: 'text',
            content: (el as any).content || '',
            fontSize: (el as any).fontSize || 16,
            fontWeight: (el as any).fontWeight || '400',
            color: (el as any).color || '#ffffff',
            translatedContent: {},
          });
        }
      });

      return {
        id: screen.id,
        name: screen.name,
        images,
        texts,
      };
    });

    const baseLang = SUPPORTED_LANGUAGES.find((l) => l.code === 'en') || SUPPORTED_LANGUAGES[0];
    const baseLanguageNode: LanguageNode = {
      id: uuidv4(),
      code: baseLang.code,
      name: baseLang.name,
      nativeName: baseLang.nativeName,
      screens,
    };

    return {
      id: uuidv4(),
      name: currentProject.name,
      baseLanguage: 'en',
      languages: [baseLanguageNode],
    };
  },

  initializeLocalizationTree: () => {
    const existing = get().localizationTree;
    if (existing) return existing;
    
    const tree = get().generateLocalizationTreeFromStore();
    set({ localizationTree: tree });
    return tree;
  },

  addLocalizationLanguage: (langCode: string) => {
    const { localizationTree } = get();
    if (!localizationTree) return;

    const existingLang = localizationTree.languages.find((l) => l.code === langCode);
    if (existingLang) return;

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (!langInfo) return;

    const baseLanguage = localizationTree.languages[0];
    const newLanguage: LanguageNode = {
      id: uuidv4(),
      code: langInfo.code,
      name: langInfo.name,
      nativeName: langInfo.nativeName,
      screens: baseLanguage.screens.map((screen) => ({
        id: uuidv4(),
        name: screen.name,
        images: screen.images.map((img) => ({ ...img, id: uuidv4() })),
        texts: screen.texts.map((text) => ({
          ...text,
          id: uuidv4(),
          translatedContent: {},
        })),
      })),
    };

    set({
      localizationTree: {
        ...localizationTree,
        languages: [...localizationTree.languages, newLanguage],
      },
    });
  },

  removeLocalizationLanguage: (langId: string) => {
    const { localizationTree } = get();
    if (!localizationTree) return;
    if (localizationTree.languages.length <= 1) return;

    set({
      localizationTree: {
        ...localizationTree,
        languages: localizationTree.languages.filter((l) => l.id !== langId),
      },
    });
  },

  updateTranslation: (langId: string, screenId: string, textId: string, value: string) => {
    const { localizationTree } = get();
    if (!localizationTree) return;

    set({
      localizationTree: {
        ...localizationTree,
        languages: localizationTree.languages.map((lang) => {
          if (lang.id !== langId) return lang;
          return {
            ...lang,
            screens: lang.screens.map((screen) => {
              if (screen.id !== screenId) return screen;
              return {
                ...screen,
                texts: screen.texts.map((text) => {
                  if (text.id !== textId) return text;
                  return {
                    ...text,
                    translatedContent: {
                      ...text.translatedContent,
                      [lang.code]: value,
                    },
                  };
                }),
              };
            }),
          };
        }),
      },
    });
  },

  resetLocalizationTree: () => {
    set({ localizationTree: null });
  },
  
  createProject: (name, appName, platform) => {
    const project: Project = {
      id: uuidv4(),
      name,
      appName,
      appDescription: '',
      platform,
      screenshots: [],
      colorPalette: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const newProjects = [...get().projects, project];
    saveToStorage(newProjects);
    
    set({
      projects: newProjects,
      currentProject: project,
      currentPlatform: platform,
      currentSizeId: platform === 'ios' ? 'ios-6.7' : 'android-phone',
      currentScreenshot: null,
      selectedElements: [],
      history: [],
      historyIndex: -1,
      view: 'editor',
    });
    
    return project;
  },
  
  setCurrentProject: (project) => {
    set({
      currentProject: project,
      currentScreenshot: project?.screenshots[0] || null,
      currentPlatform: project?.platform || 'ios',
      currentSizeId: project?.platform === 'ios' ? 'ios-6.7' : 'android-phone',
      selectedElements: [],
      history: [],
      historyIndex: -1,
      view: project ? 'editor' : 'dashboard',
    });
  },
  
  updateProject: (project) => {
    const updatedProject = { ...project, updatedAt: new Date() };
    const newProjects = get().projects.map(p => p.id === project.id ? updatedProject : p);
    saveToStorage(newProjects);
    
    set({
      projects: newProjects,
      currentProject: get().currentProject?.id === project.id ? updatedProject : get().currentProject,
    });
  },
  
  deleteProject: (projectId) => {
    const newProjects = get().projects.filter(p => p.id !== projectId);
    saveToStorage(newProjects);
    
    set({
      projects: newProjects,
      currentProject: get().currentProject?.id === projectId ? null : get().currentProject,
      currentScreenshot: get().currentProject?.id === projectId ? null : get().currentScreenshot,
      view: get().currentProject?.id === projectId ? 'dashboard' : get().view,
    });
  },
  
  createScreenshot: () => {
    const { currentProject, updateProject } = get();
    if (!currentProject) throw new Error('No project selected');
    
    const screenshot: Screenshot = {
      id: uuidv4(),
      name: `Screen ${currentProject.screenshots.length + 1}`,
      elements: [],
      background: createDefaultBackground(),
      order: currentProject.screenshots.length,
    };
    
    const updatedProject = {
      ...currentProject,
      screenshots: [...currentProject.screenshots, screenshot],
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    set({ currentScreenshot: screenshot, selectedElements: [] });
    
    return screenshot;
  },
  
  setCurrentScreenshot: (screenshot) => {
    set({ currentScreenshot: screenshot, selectedElements: [] });
  },
  
  updateScreenshot: (screenshot, shouldPushHistory = true) => {
    const { currentProject, updateProject, pushHistory } = get();
    if (!currentProject) return;
    
    if (shouldPushHistory) {
      pushHistory();
    }
    
    const updatedProject = {
      ...currentProject,
      screenshots: currentProject.screenshots.map(s => s.id === screenshot.id ? screenshot : s),
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    set({ currentScreenshot: screenshot });
  },
  
  renameScreenshot: (screenshotId, newName) => {
    const { currentProject, currentScreenshot, updateScreenshot } = get();
    if (!currentProject) return;
    
    const screenshot = currentProject.screenshots.find(s => s.id === screenshotId);
    if (screenshot) {
      updateScreenshot({ ...screenshot, name: newName });
    }
  },
  
  deleteScreenshot: (screenshotId) => {
    const { currentProject, updateProject, currentScreenshot } = get();
    if (!currentProject) return;
    
    const updatedScreenshots = currentProject.screenshots.filter(s => s.id !== screenshotId);
    const updatedProject = {
      ...currentProject,
      screenshots: updatedScreenshots,
      updatedAt: new Date(),
    };
    
    saveToStorage(get().projects.map(p => p.id === currentProject.id ? updatedProject : p));
    set({ projects: get().projects.map(p => p.id === currentProject.id ? updatedProject : p) });
    
    if (currentScreenshot?.id === screenshotId) {
      set({ currentScreenshot: updatedScreenshots[0] || null, selectedElements: [] });
    }
  },
  
  reorderScreenshots: (startIndex, endIndex) => {
    const { currentProject, updateProject } = get();
    if (!currentProject) return;
    
    const screenshots = [...currentProject.screenshots];
    const [removed] = screenshots.splice(startIndex, 1);
    screenshots.splice(endIndex, 0, removed);
    
    const updatedProject = {
      ...currentProject,
      screenshots: screenshots.map((s, i) => ({ ...s, order: i })),
      updatedAt: new Date(),
    };
    
    saveToStorage(get().projects.map(p => p.id === currentProject.id ? updatedProject : p));
    set({ projects: get().projects.map(p => p.id === currentProject.id ? updatedProject : p) });
  },
  
  duplicateScreenshot: (screenshotId) => {
    const { currentProject, updateProject } = get();
    if (!currentProject) return;
    
    const screenshot = currentProject.screenshots.find(s => s.id === screenshotId);
    if (!screenshot) return;
    
    const duplicated: Screenshot = {
      ...screenshot,
      id: uuidv4(),
      name: `${screenshot.name} (copy)`,
      elements: screenshot.elements.map(e => ({ ...e, id: uuidv4() })),
      order: currentProject.screenshots.length,
    };
    
    const updatedProject = {
      ...currentProject,
      screenshots: [...currentProject.screenshots, duplicated],
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    set({ currentScreenshot: duplicated, selectedElements: [] });
  },
  
  addElement: (element) => {
    const { currentScreenshot, updateScreenshot, pushHistory } = get();
    if (!currentScreenshot) return;
    
    pushHistory();
    
    const updatedScreenshot = {
      ...currentScreenshot,
      elements: [...currentScreenshot.elements, element],
    };
    
    updateScreenshot(updatedScreenshot, false);
    set({ selectedElements: [element] });
  },
  
  addElements: (elements) => {
    const { currentScreenshot, updateScreenshot, pushHistory } = get();
    if (!currentScreenshot) return;
    
    pushHistory();
    
    const updatedScreenshot = {
      ...currentScreenshot,
      elements: [...currentScreenshot.elements, ...elements],
    };
    
    updateScreenshot(updatedScreenshot, false);
    set({ selectedElements: elements });
  },
  
  updateElement: (elementId, updates) => {
    const { currentScreenshot, updateScreenshot, selectedElements } = get();
    if (!currentScreenshot) return;
    
    const updatedElements = currentScreenshot.elements.map(e => 
      e.id === elementId ? { ...e, ...updates } as CanvasElement : e
    );
    
    const updatedScreenshot = {
      ...currentScreenshot,
      elements: updatedElements,
    };
    
    updateScreenshot(updatedScreenshot, false);
    
    if (selectedElements.some(e => e.id === elementId)) {
      set({ 
        selectedElements: updatedElements.filter(e => selectedElements.some(sel => sel.id === e.id))
      });
    }
  },
  
  deleteElement: (elementId) => {
    const { currentScreenshot, updateScreenshot, selectedElements, pushHistory } = get();
    if (!currentScreenshot) return;
    
    pushHistory();
    
    const updatedScreenshot = {
      ...currentScreenshot,
      elements: currentScreenshot.elements.filter(e => e.id !== elementId),
    };
    
    updateScreenshot(updatedScreenshot, false);
    set({ selectedElements: selectedElements.filter(e => e.id !== elementId) });
  },
  
  deleteSelectedElements: () => {
    const { currentScreenshot, updateScreenshot, selectedElements, pushHistory } = get();
    if (!currentScreenshot || selectedElements.length === 0) return;
    
    pushHistory();
    
    const idsToDelete = new Set(selectedElements.map(e => e.id));
    const updatedScreenshot = {
      ...currentScreenshot,
      elements: currentScreenshot.elements.filter(e => !idsToDelete.has(e.id)),
    };
    
    updateScreenshot(updatedScreenshot);
    set({ selectedElements: [] });
  },
  
  setSelectedElement: (element) => {
    set({ selectedElements: element ? [element] : [] });
  },
  
  addToSelectedElements: (element) => {
    const { selectedElements } = get();
    if (selectedElements.some(e => e.id === element.id)) {
      set({ selectedElements: selectedElements.filter(e => e.id !== element.id) });
    } else {
      set({ selectedElements: [...selectedElements, element] });
    }
  },
  
  clearSelectedElements: () => {
    set({ selectedElements: [] });
  },
  
  bringForward: (elementId) => {
    const { currentScreenshot, updateScreenshot } = get();
    if (!currentScreenshot) return;
    
    const elements = [...currentScreenshot.elements];
    const index = elements.findIndex(e => e.id === elementId);
    if (index < elements.length - 1) {
      [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
    }
    
    updateScreenshot({ ...currentScreenshot, elements });
  },
  
  sendBackward: (elementId) => {
    const { currentScreenshot, updateScreenshot } = get();
    if (!currentScreenshot) return;
    
    const elements = [...currentScreenshot.elements];
    const index = elements.findIndex(e => e.id === elementId);
    if (index > 0) {
      [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
    }
    
    updateScreenshot({ ...currentScreenshot, elements });
  },
  
  bringToFront: (elementId) => {
    const { currentScreenshot, updateScreenshot } = get();
    if (!currentScreenshot) return;
    
    const elements = [...currentScreenshot.elements];
    const index = elements.findIndex(e => e.id === elementId);
    if (index !== -1 && index < elements.length - 1) {
      const [element] = elements.splice(index, 1);
      elements.push(element);
    }
    
    updateScreenshot({ ...currentScreenshot, elements });
  },
  
  sendToBack: (elementId) => {
    const { currentScreenshot, updateScreenshot } = get();
    if (!currentScreenshot) return;
    
    const elements = [...currentScreenshot.elements];
    const index = elements.findIndex(e => e.id === elementId);
    if (index !== -1 && index > 0) {
      const [element] = elements.splice(index, 1);
      elements.unshift(element);
    }
    
    updateScreenshot({ ...currentScreenshot, elements });
  },
  
  copySelected: () => {
    const { selectedElements } = get();
    if (selectedElements.length === 0) return;
    
    const deepCopy = JSON.parse(JSON.stringify(selectedElements));
    set({ clipboard: deepCopy });
  },
  
  paste: () => {
    const { clipboard, currentScreenshot, addElements } = get();
    if (clipboard.length === 0 || !currentScreenshot) return;
    
    const newElements = clipboard.map(el => ({
      ...JSON.parse(JSON.stringify(el)),
      id: uuidv4(),
      x: (el as any).x + 20,
      y: (el as any).y + 20,
    }));
    
    addElements(newElements);
  },
  
  duplicateSelected: () => {
    const { selectedElements, addElements } = get();
    if (selectedElements.length === 0) return;
    
    const newElements = selectedElements.map(el => ({
      ...JSON.parse(JSON.stringify(el)),
      id: uuidv4(),
      x: (el as any).x + 20,
      y: (el as any).y + 20,
    }));
    
    addElements(newElements);
  },
  
  nudgeSelected: (dx, dy) => {
    const { selectedElements, currentScreenshot, updateScreenshot } = get();
    if (selectedElements.length === 0 || !currentScreenshot) return;
    
    const idsToUpdate = new Set(selectedElements.map(e => e.id));
    const updatedElements = currentScreenshot.elements.map(e => {
      if (idsToUpdate.has(e.id)) {
        return { ...e, x: (e as any).x + dx, y: (e as any).y + dy } as CanvasElement;
      }
      return e;
    });
    
    const updatedScreenshot = { ...currentScreenshot, elements: updatedElements };
    updateScreenshot(updatedScreenshot);
    
    set({
      selectedElements: updatedElements.filter(e => idsToUpdate.has(e.id))
    });
  },
  
  setCurrentPlatform: (platform) => {
    const sizes = platform === 'ios' ? IOS_SIZES : ANDROID_SIZES;
    set({
      currentPlatform: platform,
      currentSizeId: sizes[0].id,
    });
  },
  
  setCurrentSizeId: (sizeId) => {
    set({ currentSizeId: sizeId });
  },
  
  setShowSafeAreas: (show) => {
    set({ showSafeAreas: show });
  },
  
  setShowDeviceFrame: (show) => {
    set({ showDeviceFrame: show });
  },
  
  setShowGrid: (show) => {
    set({ showGrid: show });
  },
  
  setGridSize: (size) => {
    set({ gridSize: size });
  },
  
  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(2, zoom)) });
  },
  
  setView: (view) => {
    set({ view });
  },
  
  setLeftSidebarTab: (tab) => {
    set({ leftSidebarTab: tab as any });
  },
  
  undo: () => {
    const { history, historyIndex, currentScreenshot, currentProject, updateProject } = get();
    if (historyIndex > 0 && currentScreenshot) {
      const previousState = history[historyIndex - 1];
      const screenshot = previousState.find(s => s.id === currentScreenshot.id);
      if (screenshot && currentProject) {
        const updatedProject = {
          ...currentProject,
          screenshots: currentProject.screenshots.map(s => 
            previousState.find((ps: Screenshot) => ps.id === s.id) || s
          ),
        };
        saveToStorage(get().projects.map(p => p.id === currentProject.id ? updatedProject : p));
        set({ 
          historyIndex: historyIndex - 1,
          currentScreenshot: screenshot,
          selectedElements: [],
        });
      }
    }
  },
  
  redo: () => {
    const { history, historyIndex, currentScreenshot, currentProject } = get();
    if (historyIndex < history.length - 1 && currentScreenshot) {
      const nextState = history[historyIndex + 1];
      const screenshot = nextState.find(s => s.id === currentScreenshot.id);
      if (screenshot && currentProject) {
        const updatedProject = {
          ...currentProject,
          screenshots: currentProject.screenshots.map(s => 
            nextState.find((ns: Screenshot) => ns.id === s.id) || s
          ),
        };
        saveToStorage(get().projects.map(p => p.id === currentProject.id ? updatedProject : p));
        set({ 
          historyIndex: historyIndex + 1,
          currentScreenshot: screenshot,
          selectedElements: [],
        });
      }
    }
  },
  
  pushHistory: () => {
    const { currentProject, history, historyIndex } = get();
    if (!currentProject) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...currentProject.screenshots]);
    
    set({
      history: newHistory.slice(-50),
      historyIndex: newHistory.length - 1,
    });
  },
  
  saveProjects: () => {
    saveToStorage(get().projects);
  },
}), {
  name: STORAGE_KEY,
  partialize: (state) => ({ projects: state.projects }),
}));
