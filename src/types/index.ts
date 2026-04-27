export type Platform = 'ios' | 'android';

export interface ScreenSize {
  id: string;
  name: string;
  width: number;
  height: number;
  platform: Platform;
  safeArea?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface DeviceMockup {
  id: string;
  name: string;
  platform: Platform;
  type: 'phone' | 'tablet';
  width: number;
  height: number;
  frameColor: string;
  cornerRadius: number;
  bezelWidth: number;
  screenOffset: { x: number; y: number; width: number; height: number };
  notch?: {
    type: 'none' | 'dynamic-island' | 'notch' | 'punch-hole' | 'pill';
    width?: number;
    height?: number;
    topOffset?: number;
  };
  hasHomeIndicator: boolean;
  buttonStyle?: 'none' | 'iphone-se' | 'android-nav';
}

export interface TextElement {
  id: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
}

export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  objectFit: 'cover' | 'contain' | 'fill';
}

export type DeviceOrientation = 'portrait' | 'landscape-left' | 'landscape-right';

export type DeviceRenderMode = '2d' | '3d' | 'realistic';

export interface DeviceElement {
  id: string;
  type: 'device';
  deviceId: string;
  screenshotSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  showFrame: boolean;
  rotation: number;
  orientation: DeviceOrientation;
  renderMode: DeviceRenderMode;
  cameraAngle?: 'front' | 'tilt-left' | 'tilt-right' | 'isometric';
  screenshotScale?: number;
  screenshotOffsetX?: number;
  screenshotOffsetY?: number;
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'rounded-rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export type CanvasElement = TextElement | ImageElement | DeviceElement | ShapeElement;

export interface Screenshot {
  id: string;
  name: string;
  elements: CanvasElement[];
  background: Background;
  order: number;
}

export interface GradientColorStop {
  color: string;
  position: number;
}

export interface Background {
  type: 'solid' | 'gradient' | 'image';
  value: string;
  gradientDirection?: string;
  gradientColors?: string[];
  gradientType?: 'linear' | 'radial';
  gradientStops?: GradientColorStop[];
}

export interface Project {
  id: string;
  name: string;
  appName: string;
  appDescription: string;
  appIcon?: string;
  platform: Platform;
  screenshots: Screenshot[];
  colorPalette: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  category: 'feature' | 'problem-solution' | 'before-after' | 'social-proof' | 'minimal';
  thumbnail: string;
  elements: CanvasElement[];
  background: Background;
}

export const IOS_SIZES: ScreenSize[] = [
  { id: 'ios-6.7', name: '6.7" Display', width: 1290, height: 2796, platform: 'ios', safeArea: { top: 132, bottom: 102, left: 0, right: 0 } },
  { id: 'ios-6.5', name: '6.5" Display', width: 1284, height: 2778, platform: 'ios', safeArea: { top: 132, bottom: 102, left: 0, right: 0 } },
  { id: 'ios-5.5', name: '5.5" Display', width: 1242, height: 2208, platform: 'ios', safeArea: { top: 60, bottom: 0, left: 0, right: 0 } },
];

export const ANDROID_SIZES: ScreenSize[] = [
  { id: 'android-phone', name: 'Phone', width: 1080, height: 1920, platform: 'android', safeArea: { top: 72, bottom: 144, left: 0, right: 0 } },
  { id: 'android-phone-long', name: 'Phone (19.5:9)', width: 1080, height: 2340, platform: 'android', safeArea: { top: 72, bottom: 144, left: 0, right: 0 } },
  { id: 'android-tablet-7', name: '7" Tablet', width: 1200, height: 1920, platform: 'android' },
  { id: 'android-tablet-10', name: '10" Tablet', width: 1920, height: 1200, platform: 'android' },
];

export const DEVICE_MOCKUPS: DeviceMockup[] = [
  // iPhone 15 Series (Dynamic Island)
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', platform: 'ios', type: 'phone', width: 430, height: 932, frameColor: '#1c1c1e', cornerRadius: 50, bezelWidth: 14, screenOffset: { x: 14, y: 14, width: 402, height: 904 }, notch: { type: 'dynamic-island', width: 126, height: 37, topOffset: 14 }, hasHomeIndicator: true },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', platform: 'ios', type: 'phone', width: 393, height: 852, frameColor: '#1c1c1e', cornerRadius: 47, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 369, height: 828 }, notch: { type: 'dynamic-island', width: 126, height: 37, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-15', name: 'iPhone 15', platform: 'ios', type: 'phone', width: 393, height: 852, frameColor: '#2c2c2e', cornerRadius: 47, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 369, height: 828 }, notch: { type: 'dynamic-island', width: 126, height: 37, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-15-plus', name: 'iPhone 15 Plus', platform: 'ios', type: 'phone', width: 430, height: 932, frameColor: '#2c2c2e', cornerRadius: 50, bezelWidth: 14, screenOffset: { x: 14, y: 14, width: 402, height: 904 }, notch: { type: 'dynamic-island', width: 126, height: 37, topOffset: 14 }, hasHomeIndicator: true },
  
  // iPhone 14 Series (Dynamic Island)
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', platform: 'ios', type: 'phone', width: 393, height: 852, frameColor: '#1c1c1e', cornerRadius: 47, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 369, height: 828 }, notch: { type: 'dynamic-island', width: 126, height: 37, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-14', name: 'iPhone 14', platform: 'ios', type: 'phone', width: 390, height: 844, frameColor: '#2c2c2e', cornerRadius: 46, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 366, height: 820 }, notch: { type: 'notch', width: 180, height: 34, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', platform: 'ios', type: 'phone', width: 428, height: 926, frameColor: '#2c2c2e', cornerRadius: 50, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 404, height: 902 }, notch: { type: 'notch', width: 180, height: 34, topOffset: 12 }, hasHomeIndicator: true },
  
  // iPhone 13/12 Series (Notch)
  { id: 'iphone-13-pro', name: 'iPhone 13 Pro', platform: 'ios', type: 'phone', width: 390, height: 844, frameColor: '#1c1c1e', cornerRadius: 46, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 366, height: 820 }, notch: { type: 'notch', width: 180, height: 34, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-13', name: 'iPhone 13', platform: 'ios', type: 'phone', width: 390, height: 844, frameColor: '#2c2c2e', cornerRadius: 46, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 366, height: 820 }, notch: { type: 'notch', width: 180, height: 34, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-12-pro', name: 'iPhone 12 Pro', platform: 'ios', type: 'phone', width: 390, height: 844, frameColor: '#1c1c1e', cornerRadius: 46, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 366, height: 820 }, notch: { type: 'notch', width: 180, height: 34, topOffset: 12 }, hasHomeIndicator: true },
  { id: 'iphone-12', name: 'iPhone 12', platform: 'ios', type: 'phone', width: 390, height: 844, frameColor: '#2c2c2e', cornerRadius: 46, bezelWidth: 12, screenOffset: { x: 12, y: 12, width: 366, height: 820 }, notch: { type: 'notch', width: 180, height: 34, topOffset: 12 }, hasHomeIndicator: true },
  
  // iPhone SE (Home button)
  { id: 'iphone-se', name: 'iPhone SE', platform: 'ios', type: 'phone', width: 375, height: 667, frameColor: '#1c1c1e', cornerRadius: 40, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 355, height: 647 }, notch: { type: 'none' }, hasHomeIndicator: true, buttonStyle: 'iphone-se' },
  
  // Pixel Series (Punch-hole camera)
  { id: 'pixel-9-pro-xl', name: 'Pixel 9 Pro XL', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'pill', width: 48, height: 14, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-9-pro', name: 'Pixel 9 Pro', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'pill', width: 48, height: 14, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-9', name: 'Pixel 9', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 12, height: 12, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-8-pro', name: 'Pixel 8 Pro', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'pill', width: 48, height: 14, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-8', name: 'Pixel 8', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 12, height: 12, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-7-pro', name: 'Pixel 7 Pro', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'pill', width: 48, height: 14, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-7', name: 'Pixel 7', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 12, height: 12, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'pixel-6a', name: 'Pixel 6a', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 48, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 12, height: 12, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  
  // Samsung Galaxy S Series (Punch-hole)
  { id: 'samsung-s24-ultra', name: 'Samsung S24 Ultra', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'samsung-s24-plus', name: 'Samsung S24+', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'samsung-s24', name: 'Samsung S24', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'samsung-s23-ultra', name: 'Samsung S23 Ultra', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'samsung-s23-plus', name: 'Samsung S23+', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'samsung-s23', name: 'Samsung S23', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#2c2c2e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  
  // Other Android Phones
  { id: 'oneplus-12', name: 'OnePlus 12', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'xiaomi-14', name: 'Xiaomi 14', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'xiaomi-14-pro', name: 'Xiaomi 14 Pro', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'pill', width: 40, height: 14, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'huawei-p70', name: 'Huawei P70', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'pill', width: 40, height: 14, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'nothing-phone-2a', name: 'Nothing Phone 2a', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#f5f5f5', cornerRadius: 45, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'punch-hole', width: 10, height: 10, topOffset: 10 }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  { id: 'sony-xperia-1-v', name: 'Sony Xperia 1 V', platform: 'android', type: 'phone', width: 412, height: 915, frameColor: '#1c1c1e', cornerRadius: 30, bezelWidth: 10, screenOffset: { x: 10, y: 10, width: 392, height: 895 }, notch: { type: 'none' }, hasHomeIndicator: false, buttonStyle: 'android-nav' },
  
  // iPads (Face ID notch on Pro)
  { id: 'ipad-pro-13', name: 'iPad Pro 13"', platform: 'ios', type: 'tablet', width: 1024, height: 1366, frameColor: '#1c1c1e', cornerRadius: 24, bezelWidth: 24, screenOffset: { x: 24, y: 24, width: 976, height: 1318 }, notch: { type: 'none' }, hasHomeIndicator: false },
  { id: 'ipad-pro-11-4', name: 'iPad Pro 11" (M4)', platform: 'ios', type: 'tablet', width: 834, height: 1194, frameColor: '#1c1c1e', cornerRadius: 20, bezelWidth: 20, screenOffset: { x: 20, y: 20, width: 794, height: 1154 }, notch: { type: 'none' }, hasHomeIndicator: false },
  { id: 'ipad-air-13', name: 'iPad Air 13"', platform: 'ios', type: 'tablet', width: 820, height: 1180, frameColor: '#e5e5e5', cornerRadius: 18, bezelWidth: 20, screenOffset: { x: 20, y: 20, width: 780, height: 1140 }, notch: { type: 'none' }, hasHomeIndicator: false },
  { id: 'ipad-air-11', name: 'iPad Air 11"', platform: 'ios', type: 'tablet', width: 744, height: 1133, frameColor: '#e5e5e5', cornerRadius: 16, bezelWidth: 18, screenOffset: { x: 18, y: 18, width: 708, height: 1097 }, notch: { type: 'none' }, hasHomeIndicator: false },
  { id: 'ipad-mini-8', name: 'iPad Mini', platform: 'ios', type: 'tablet', width: 744, height: 1133, frameColor: '#1c1c1e', cornerRadius: 16, bezelWidth: 18, screenOffset: { x: 18, y: 18, width: 708, height: 1097 }, notch: { type: 'none' }, hasHomeIndicator: false },
  { id: 'ipad-10', name: 'iPad 10', platform: 'ios', type: 'tablet', width: 820, height: 1180, frameColor: '#e5e5e5', cornerRadius: 18, bezelWidth: 20, screenOffset: { x: 20, y: 20, width: 780, height: 1140 }, notch: { type: 'none' }, hasHomeIndicator: false },
  
  // Android Tablets
  { id: 'samsung-tab-s9-ultra', name: 'Samsung Tab S9 Ultra', platform: 'android', type: 'tablet', width: 1024, height: 1366, frameColor: '#1c1c1e', cornerRadius: 20, bezelWidth: 20, screenOffset: { x: 20, y: 20, width: 984, height: 1326 }, notch: { type: 'notch', width: 200, height: 12, topOffset: 20 }, hasHomeIndicator: false },
  { id: 'samsung-tab-s9', name: 'Samsung Tab S9', platform: 'android', type: 'tablet', width: 1024, height: 1366, frameColor: '#1c1c1e', cornerRadius: 20, bezelWidth: 20, screenOffset: { x: 20, y: 20, width: 984, height: 1326 }, notch: { type: 'none' }, hasHomeIndicator: false },
  { id: 'oneplus-pad', name: 'OnePlus Pad', platform: 'android', type: 'tablet', width: 1024, height: 1366, frameColor: '#1c1c1e', cornerRadius: 20, bezelWidth: 20, screenOffset: { x: 20, y: 20, width: 984, height: 1326 }, notch: { type: 'none' }, hasHomeIndicator: false },
];

export const GRADIENT_PRESETS = [
  { name: 'Ocean', colors: ['#667eea', '#764ba2'], direction: '135deg' },
  { name: 'Sunset', colors: ['#f093fb', '#f5576c'], direction: '135deg' },
  { name: 'Forest', colors: ['#11998e', '#38ef7d'], direction: '135deg' },
  { name: 'Fire', colors: ['#f12711', '#f5af19'], direction: '135deg' },
  { name: 'Purple Haze', colors: ['#7028e4', '#e5b2ca'], direction: '135deg' },
  { name: 'Cool Blue', colors: ['#2193b0', '#6dd5ed'], direction: '135deg' },
  { name: 'Dark Night', colors: ['#232526', '#414345'], direction: '135deg' },
  { name: 'Peach', colors: ['#ff9a9e', '#fecfef'], direction: '135deg' },
];

export const SOLID_COLORS = [
  '#000000', '#ffffff', '#1a1a2e', '#16213e', '#0f3460',
  '#e94560', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
  '#ffeaa7', '#dfe6e9', '#6c5ce7', '#a29bfe', '#fd79a8',
];

export interface TextElementNode {
  id: string;
  type: 'text';
  content: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  translatedContent?: Record<string, string>;
}

export interface ImageElementNode {
  id: string;
  type: 'image';
  name: string;
  translatedName?: Record<string, string>;
}

export interface ScreenNode {
  id: string;
  name: string;
  images: ImageElementNode[];
  texts: TextElementNode[];
}

export interface LanguageNode {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  screens: ScreenNode[];
}

export interface LocalizationTree {
  id: string;
  name: string;
  baseLanguage: string;
  languages: LanguageNode[];
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
];
