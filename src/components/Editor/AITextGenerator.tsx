import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { TextElement } from '../../types';
import {
  Sparkles,
  X,
  Wand2,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';

interface AITextGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const HEADLINE_TEMPLATES = [
  { category: 'Feature Highlight', prompts: [
    'Discover {feature} in seconds',
    'The easiest way to {action}',
    '{Feature} that just works',
    'Meet your new {tool}',
    'Finally, {solution} made simple',
  ]},
  { category: 'Problem → Solution', prompts: [
    'Stop {problem}. Start {solution}.',
    'No more {pain_point}',
    'Say goodbye to {problem}',
    'From {problem} to {solution}',
    '{Problem}? Not anymore.',
  ]},
  { category: 'Social Proof', prompts: [
    'Loved by {number} users',
    'Join {number}+ happy users',
    'Rated {rating}★ by users',
    '#1 {category} app',
    'Trusted by professionals',
  ]},
  { category: 'Call to Action', prompts: [
    'Start your journey today',
    'Get started in seconds',
    'Try it free',
    'Transform your {workflow}',
    'Take control of your {area}',
  ]},
  { category: 'Productivity', prompts: [
    'Plan your day effortlessly',
    'Never miss a task again',
    'Stay organized, stay ahead',
    'Work smarter, not harder',
    'Everything in one place',
  ]},
  { category: 'Lifestyle', prompts: [
    'Your daily companion',
    'Simplify your life',
    'Make every day count',
    'Live better, stress less',
    'Designed for your lifestyle',
  ]},
];

export const AITextGenerator: React.FC<AITextGeneratorProps> = ({ isOpen, onClose }) => {
  const { addElement, currentProject } = useStore();
  const [appDescription, setAppDescription] = useState(currentProject?.appDescription || '');
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateHeadlines = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with template-based approach
    setTimeout(() => {
      const allPrompts = selectedCategory
        ? HEADLINE_TEMPLATES.find(t => t.category === selectedCategory)?.prompts || []
        : HEADLINE_TEMPLATES.flatMap(t => t.prompts);
      
      // Shuffle and pick random headlines
      const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 8);
      
      // Replace placeholders with generic text
      const processed = selected.map(headline => {
        return headline
          .replace('{feature}', 'smart features')
          .replace('{Feature}', 'Features')
          .replace('{action}', 'get things done')
          .replace('{tool}', 'productivity tool')
          .replace('{solution}', 'organization')
          .replace('{problem}', 'the chaos')
          .replace('{Problem}', 'Chaos')
          .replace('{pain_point}', 'forgotten tasks')
          .replace('{number}', '10,000')
          .replace('{rating}', '4.9')
          .replace('{category}', 'productivity')
          .replace('{workflow}', 'workflow')
          .replace('{area}', 'day');
      });
      
      setGeneratedHeadlines(processed);
      setIsGenerating(false);
    }, 1000);
  };

  const handleUseHeadline = (headline: string) => {
    const element: TextElement = {
      id: uuidv4(),
      type: 'text',
      content: headline,
      x: 100,
      y: 200,
      width: 500,
      height: 120,
      fontSize: 56,
      fontWeight: '700',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: -1,
    };
    
    addElement(element);
    onClose();
  };

  const handleCopy = (headline: string, index: number) => {
    navigator.clipboard.writeText(headline);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#21262d] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#a371f7]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">AI Text Generator</h2>
              <p className="text-sm text-[#8b949e]">Generate high-converting headlines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8b949e]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* App Description Input */}
          <div>
            <label className="block text-sm font-medium text-[#8b949e] mb-2">
              Describe your app (optional)
            </label>
            <textarea
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              placeholder="A task management app that helps users organize their daily activities..."
              className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#238636] resize-none"
              rows={3}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-[#8b949e] mb-3">
              Headline Style
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedCategory === null
                    ? 'bg-[#238636] text-white'
                    : 'bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d]'
                }`}
              >
                All Styles
              </button>
              {HEADLINE_TEMPLATES.map(template => (
                <button
                  key={template.category}
                  onClick={() => setSelectedCategory(template.category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedCategory === template.category
                      ? 'bg-[#238636] text-white'
                      : 'bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d]'
                  }`}
                >
                  {template.category}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateHeadlines}
            disabled={isGenerating}
            className="w-full px-6 py-4 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Headlines
              </>
            )}
          </button>

          {/* Generated Headlines */}
          {generatedHeadlines.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#8b949e]">Generated Headlines</h3>
              <div className="grid gap-2">
                {generatedHeadlines.map((headline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-[#21262d] rounded-xl group hover:bg-[#30363d] transition-colors"
                  >
                    <span className="text-[#e6edf3] font-medium">{headline}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(headline, index)}
                        className="p-2 hover:bg-[#30363d] rounded-lg transition-colors"
                        title="Copy"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#8b949e]" />
                        )}
                      </button>
                      <button
                        onClick={() => handleUseHeadline(headline)}
                        className="px-3 py-1 bg-[#238636] text-white rounded-lg text-sm font-medium hover:bg-[#2ea043] transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
