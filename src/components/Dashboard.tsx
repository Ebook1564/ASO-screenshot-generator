import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Platform, Project } from '../types';
import { 
  Plus, 
  Smartphone, 
  Trash2, 
  Apple,
  Layers,
  Zap,
  Globe,
  Download,
  Sparkles,
  Pencil,
  Check,
  X,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { projects, createProject, setCurrentProject, deleteProject, updateProject } = useStore();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newPlatform, setNewPlatform] = useState<Platform>('ios');
  
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAppName, setEditAppName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProject && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingProject]);

  const handleCreateProject = () => {
    if (newProjectName && newAppName) {
      createProject(newProjectName, newAppName, newPlatform);
      setShowNewProjectModal(false);
      setNewProjectName('');
      setNewAppName('');
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project.id);
    setEditName(project.name);
    setEditAppName(project.appName);
  };

  const finishEditProject = () => {
    if (editingProject && editName.trim() && editAppName.trim()) {
      const project = projects.find(p => p.id === editingProject);
      if (project) {
        updateProject({ ...project, name: editName.trim(), appName: editAppName.trim() });
      }
    }
    setEditingProject(null);
  };

  const cancelEditProject = () => {
    setEditingProject(null);
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Generate screenshots in seconds' },
    { icon: Sparkles, title: 'AI-Powered', desc: 'Smart text & layout suggestions' },
    { icon: Globe, title: 'Multi-Language', desc: 'Localize for global markets' },
    { icon: Download, title: 'Batch Export', desc: 'Export all sizes at once' },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6edf3]">ScreenShot Studio</h1>
              <p className="text-xs text-[#8b949e]">ASO-Optimized Screenshot Generator</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        {projects.length === 0 && (
          <div className="text-center py-16 mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-[#e6edf3] mb-4">
              Create Stunning App Screenshots
            </h2>
            <p className="text-lg text-[#8b949e] max-w-2xl mx-auto mb-8">
              Design professional screenshots for the App Store and Google Play in minutes. 
              Optimized for conversions, built for speed.
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-8 py-4 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Screenshot Set
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {features.map((feature, i) => (
                <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-[#21262d] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-[#58a6ff]" />
                  </div>
                  <h3 className="text-[#e6edf3] font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-[#8b949e]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#e6edf3]">Your Projects</h2>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-white transition-colors">
                  Recent
                </button>
                <button className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-white transition-colors">
                  All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* New Project Card */}
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="h-64 border-2 border-dashed border-[#30363d] rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#238636] hover:bg-[#238636]/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-[#21262d] group-hover:bg-[#238636]/20 flex items-center justify-center transition-all">
                  <Plus className="w-7 h-7 text-[#8b949e] group-hover:text-[#238636]" />
                </div>
                <span className="text-[#8b949e] group-hover:text-[#238636] font-medium">Create New Project</span>
              </button>

              {/* Project Cards */}
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="h-64 bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden hover:border-[#238636]/50 transition-all cursor-pointer group"
                  onClick={() => editingProject !== project.id && setCurrentProject(project)}
                >
                  {/* Preview Area */}
                  <div className="h-40 bg-[#21262d] flex items-center justify-center relative">
                    <div className="flex items-center gap-2">
                      {project.platform === 'ios' ? (
                        <Apple className="w-8 h-8 text-[#8b949e]" />
                      ) : (
                        <Smartphone className="w-8 h-8 text-[#8b949e]" />
                      )}
                      <span className="text-[#8b949e] font-medium">
                        {project.screenshots.length} screens
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditProject(project);
                        }}
                        className="p-2 bg-[#0d1117]/80 rounded-lg hover:bg-[#238636]/20 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-[#8b949e] hover:text-[#238636]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this project?')) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-2 bg-[#0d1117]/80 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#8b949e] hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {editingProject === project.id ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={inputRef}
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') finishEditProject();
                            if (e.key === 'Escape') cancelEditProject();
                          }}
                          placeholder="Project name"
                          className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] text-sm focus:outline-none focus:border-[#238636]"
                        />
                        <input
                          type="text"
                          value={editAppName}
                          onChange={(e) => setEditAppName(e.target.value)}
                          placeholder="App name"
                          className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] text-sm focus:outline-none focus:border-[#238636]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={finishEditProject}
                            className="flex-1 px-3 py-1.5 bg-[#238636] text-white rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-[#2ea043]"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelEditProject}
                            className="flex-1 px-3 py-1.5 bg-[#21262d] text-[#e6edf3] rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-[#30363d]"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-[#e6edf3] font-semibold truncate">{project.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-[#8b949e]">{project.appName}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            project.platform === 'ios' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {project.platform === 'ios' ? 'iOS' : 'Android'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Preview Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-6">Template Library</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Feature Highlight', 'Problem → Solution', 'Before / After', 'Social Proof', 'Minimal'].map((name, i) => (
              <div key={i} className="aspect-[9/16] bg-[#161b22] rounded-xl border border-[#30363d] flex items-center justify-center cursor-pointer hover:border-[#238636]/50 transition-all group">
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-[#21262d] rounded-lg mx-auto mb-3 group-hover:bg-[#238636]/30 transition-colors" />
                  <span className="text-sm text-[#8b949e] group-hover:text-white transition-colors">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#e6edf3] mb-6">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b949e] mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My App Screenshots"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#238636] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b949e] mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="My Awesome App"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#238636] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b949e] mb-2">
                  Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewPlatform('ios')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                      newPlatform === 'ios'
                        ? 'border-[#238636] bg-[#238636]/10'
                        : 'border-[#30363d] hover:border-[#8b949e]'
                    }`}
                  >
                    <Apple className={`w-6 h-6 ${newPlatform === 'ios' ? 'text-[#238636]' : 'text-[#8b949e]'}`} />
                    <span className={newPlatform === 'ios' ? 'text-[#e6edf3]' : 'text-[#8b949e]'}>iOS</span>
                  </button>
                  <button
                    onClick={() => setNewPlatform('android')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                      newPlatform === 'android'
                        ? 'border-[#238636] bg-[#238636]/10'
                        : 'border-[#30363d] hover:border-[#8b949e]'
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 ${newPlatform === 'android' ? 'text-[#238636]' : 'text-[#8b949e]'}`} />
                    <span className={newPlatform === 'android' ? 'text-[#e6edf3]' : 'text-[#8b949e]'}>Android</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-3 border border-[#30363d] text-[#e6edf3] rounded-xl font-medium hover:bg-[#21262d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName || !newAppName}
                className="flex-1 px-4 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
