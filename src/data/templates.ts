import { v4 as uuidv4 } from 'uuid';
import { Background, CanvasElement } from '../types';

export interface TemplateConfig {
  id: string;
  name: string;
  category: 'feature' | 'problem-solution' | 'social-proof' | 'creative';
  thumbnail: string;
  background: Background;
  elements: CanvasElement[];
}

export const TEMPLATES: TemplateConfig[] = [
  // FEATURE HIGHLIGHTS
  {
    id: 'feature-1',
    name: 'Modern Gradient',
    category: 'feature',
    thumbnail: '/templates/feature.png',
    background: { type: 'gradient', value: 'linear-gradient(135deg, #1f6feb 0%, #a371f7 100%)', gradientColors: ['#1f6feb', '#a371f7'] },
    elements: [
      { id: uuidv4(), type: 'text', content: 'Capture Your World', x: 50, y: 80, width: 600, height: 120, fontSize: 72, fontWeight: '800', fontFamily: 'Inter', color: '#ffffff', textAlign: 'center', lineHeight: 1.1, letterSpacing: -2 },
      { id: uuidv4(), type: 'device', deviceId: 'iphone-16-pro-natural-titanium', screenshotSrc: '', x: 180, y: 300, width: 350, height: 700, showFrame: true, rotation: 0, orientation: 'portrait', renderMode: 'realistic' },
    ],
  },
  {
    id: 'feature-2',
    name: 'Bold Minimal',
    category: 'feature',
    thumbnail: '/templates/minimal.png',
    background: { type: 'solid', value: '#0d1117' },
    elements: [
      { id: uuidv4(), type: 'text', content: 'Simply Efficient', x: 50, y: 100, width: 600, height: 100, fontSize: 64, fontWeight: '300', fontFamily: 'Inter', color: '#e6edf3', textAlign: 'center', lineHeight: 1.2, letterSpacing: 1 },
      { id: uuidv4(), type: 'device', deviceId: 'iphone-16-pro-black-titanium', screenshotSrc: '', x: 180, y: 350, width: 350, height: 700, showFrame: true, rotation: 0, orientation: 'portrait', renderMode: 'realistic' },
    ],
  },
  
  // COMPARISON / PROBLEM-SOLUTION
  {
    id: 'comparison-1',
    name: 'Split Comparison',
    category: 'problem-solution',
    thumbnail: '/templates/problem-solution.png',
    background: { type: 'solid', value: '#ffffff' },
    elements: [
      { id: uuidv4(), type: 'shape', shapeType: 'rectangle', x: 0, y: 0, width: 350, height: 1200, fill: '#f85149' },
      { id: uuidv4(), type: 'text', content: 'Slow Old Way', x: 50, y: 200, width: 250, height: 60, fontSize: 32, fontWeight: '700', fontFamily: 'Inter', color: '#ffffff', textAlign: 'center' },
      { id: uuidv4(), type: 'text', content: 'Our Fast Way', x: 400, y: 200, width: 250, height: 60, fontSize: 32, fontWeight: '700', fontFamily: 'Inter', color: '#238636', textAlign: 'center' },
      { id: uuidv4(), type: 'device', deviceId: 'iphone-16-pro-white-titanium', screenshotSrc: '', x: 400, y: 400, width: 280, height: 560, showFrame: true, rotation: 0, orientation: 'portrait', renderMode: 'realistic' },
    ],
  },

  // SOCIAL PROOF
  {
    id: 'social-1',
    name: 'User Loved',
    category: 'social-proof',
    thumbnail: '/templates/social-proof.png',
    background: { type: 'gradient', value: 'linear-gradient(135deg, #a371f7 0%, #1f6feb 100%)', gradientColors: ['#a371f7', '#1f6feb'] },
    elements: [
      { id: uuidv4(), type: 'text', content: '★★★★★', x: 50, y: 50, width: 600, height: 60, fontSize: 48, fontWeight: '400', fontFamily: 'Inter', color: '#FFD700', textAlign: 'center' },
      { id: uuidv4(), type: 'text', content: '"A Game Changer!"', x: 50, y: 150, width: 600, height: 100, fontSize: 48, fontWeight: '800', fontFamily: 'Inter', color: '#ffffff', textAlign: 'center' },
      { id: uuidv4(), type: 'device', deviceId: 'iphone-16-pro-natural-titanium', screenshotSrc: '', x: 180, y: 400, width: 340, height: 680, showFrame: true, rotation: 0, orientation: 'portrait', renderMode: 'realistic' },
    ],
  },

  // CREATIVE / ARTISTIC
  {
    id: 'creative-1',
    name: 'Floating Elements',
    category: 'creative',
    thumbnail: '/templates/minimal.png',
    background: { type: 'gradient', value: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)', gradientColors: ['#161b22', '#0d1117'] },
    elements: [
      { id: uuidv4(), type: 'shape', shapeType: 'circle', x: 500, y: 100, width: 200, height: 200, fill: '#1f6feb50' },
      { id: uuidv4(), type: 'shape', shapeType: 'circle', x: -50, y: 700, width: 300, height: 300, fill: '#a371f750' },
      { id: uuidv4(), type: 'device', deviceId: 'iphone-16-pro-natural-titanium', screenshotSrc: '', x: 180, y: 200, width: 350, height: 700, showFrame: true, rotation: 10, orientation: 'portrait', renderMode: 'realistic' },
      { id: uuidv4(), type: 'text', content: 'Modern Elegance', x: 50, y: 950, width: 600, height: 80, fontSize: 48, fontWeight: '700', fontFamily: 'Inter', color: '#ffffff', textAlign: 'center' },
    ],
  },
];
