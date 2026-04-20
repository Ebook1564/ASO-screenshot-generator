export type DeviceOrientation = 'portrait' | 'landscape-left' | 'landscape-right';

export interface DeviceSafeArea {
  portrait: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  'landscape-left': {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  'landscape-right': {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface PhysicalDimensions {
  width: number;
  height: number;
  depth: number;
  unit: 'mm';
}

export interface NotchDetails {
  type: 'none' | 'dynamic-island' | 'notch' | 'punch-hole' | 'pill';
  width: number;
  height: number;
  position: 'center' | 'left' | 'right';
}

export interface DeviceDatabaseEntry {
  id: string;
  name: string;
  aliases: string[];
  platform: 'ios' | 'android';
  type: 'phone' | 'tablet';
  
  screenResolution: {
    width: number;
    height: number;
  };
  
  aspectRatio: string;
  
  physicalDimensions: PhysicalDimensions;
  
  frame: {
    color: string;
    cornerRadius: number;
    bezelWidth: number;
  };
  
  screen: {
    cornerRadius: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
  
  notch: NotchDetails;
  
  safeArea: DeviceSafeArea;
  
  features: {
    hasHomeIndicator: boolean;
    hasNotch: boolean;
    supportsLandscape: boolean;
    buttonStyle?: 'none' | 'iphone-se' | 'android-nav';
  };
  
  camera3D?: {
    modelPath: string;
    scale: number;
  };
}

export const DEVICE_DATABASE: DeviceDatabaseEntry[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    aliases: ['15 pro max', 'iphone15promax', 'ip15pm', '15pm'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1290, height: 2796 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 76.4, height: 159.9, depth: 8.25, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 50, bezelWidth: 14 },
    screen: { cornerRadius: 46, offsetX: 14, offsetY: 14, width: 402, height: 904 },
    notch: { type: 'dynamic-island', width: 126, height: 37, position: 'center' },
    safeArea: {
      portrait: { top: 59, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 59, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 59 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    aliases: ['15 pro', 'iphone15pro', 'ip15p', '15p', 'iphone 15'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1179, height: 2556 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 70.1, height: 146.6, depth: 8.25, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 47, bezelWidth: 12 },
    screen: { cornerRadius: 43, offsetX: 12, offsetY: 12, width: 369, height: 828 },
    notch: { type: 'dynamic-island', width: 126, height: 37, position: 'center' },
    safeArea: {
      portrait: { top: 59, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 59, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 59 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    aliases: ['iphone15', 'ip15'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1179, height: 2556 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.6, height: 147.6, depth: 7.8, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 47, bezelWidth: 12 },
    screen: { cornerRadius: 43, offsetX: 12, offsetY: 12, width: 369, height: 828 },
    notch: { type: 'dynamic-island', width: 126, height: 37, position: 'center' },
    safeArea: {
      portrait: { top: 59, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 59, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 59 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    aliases: ['14 pro', 'iphone14pro', 'ip14p', '14p'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1179, height: 2556 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.5, height: 147.5, depth: 7.85, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 47, bezelWidth: 12 },
    screen: { cornerRadius: 43, offsetX: 12, offsetY: 12, width: 369, height: 828 },
    notch: { type: 'dynamic-island', width: 126, height: 37, position: 'center' },
    safeArea: {
      portrait: { top: 59, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 59, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 59 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    aliases: ['iphone14', 'ip14'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1170, height: 2532 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.5, height: 146.7, depth: 7.8, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 46, bezelWidth: 12 },
    screen: { cornerRadius: 42, offsetX: 12, offsetY: 12, width: 366, height: 820 },
    notch: { type: 'notch', width: 180, height: 34, position: 'center' },
    safeArea: {
      portrait: { top: 47, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 47, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 47 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-13-pro',
    name: 'iPhone 13 Pro',
    aliases: ['13 pro', 'iphone13pro', 'ip13p', '13p'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1170, height: 2532 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.5, height: 146.7, depth: 7.65, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 46, bezelWidth: 12 },
    screen: { cornerRadius: 42, offsetX: 12, offsetY: 12, width: 366, height: 820 },
    notch: { type: 'notch', width: 180, height: 34, position: 'center' },
    safeArea: {
      portrait: { top: 47, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 47, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 47 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    aliases: ['iphone13', 'ip13'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1170, height: 2532 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.5, height: 146.7, depth: 7.65, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 46, bezelWidth: 12 },
    screen: { cornerRadius: 42, offsetX: 12, offsetY: 12, width: 366, height: 820 },
    notch: { type: 'notch', width: 180, height: 34, position: 'center' },
    safeArea: {
      portrait: { top: 47, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 47, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 47 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-12-pro',
    name: 'iPhone 12 Pro',
    aliases: ['12 pro', 'iphone12pro', 'ip12p', '12p'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1170, height: 2532 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.5, height: 146.7, depth: 7.4, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 46, bezelWidth: 12 },
    screen: { cornerRadius: 42, offsetX: 12, offsetY: 12, width: 366, height: 820 },
    notch: { type: 'notch', width: 180, height: 34, position: 'center' },
    safeArea: {
      portrait: { top: 47, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 47, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 47 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-12',
    name: 'iPhone 12',
    aliases: ['iphone12', 'ip12'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 1170, height: 2532 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 71.5, height: 146.7, depth: 7.4, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 46, bezelWidth: 12 },
    screen: { cornerRadius: 42, offsetX: 12, offsetY: 12, width: 366, height: 820 },
    notch: { type: 'notch', width: 180, height: 34, position: 'center' },
    safeArea: {
      portrait: { top: 47, bottom: 34, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 47, right: 34 },
      'landscape-right': { top: 0, bottom: 0, left: 34, right: 47 },
    },
    features: { hasHomeIndicator: true, hasNotch: true, supportsLandscape: true },
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    aliases: ['iphonese', 'iphone se 3', 'se3'],
    platform: 'ios',
    type: 'phone',
    screenResolution: { width: 750, height: 1334 },
    aspectRatio: '16:9',
    physicalDimensions: { width: 67.3, height: 138.4, depth: 7.3, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 40, bezelWidth: 10 },
    screen: { cornerRadius: 36, offsetX: 10, offsetY: 10, width: 355, height: 647 },
    notch: { type: 'none', width: 0, height: 0, position: 'center' },
    safeArea: {
      portrait: { top: 20, bottom: 20, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 20, right: 20 },
      'landscape-right': { top: 0, bottom: 0, left: 20, right: 20 },
    },
    features: { hasHomeIndicator: true, hasNotch: false, supportsLandscape: true, buttonStyle: 'iphone-se' },
  },
  {
    id: 'pixel-9-pro-xl',
    name: 'Pixel 9 Pro XL',
    aliases: ['pixel9proxl', 'pixel 9 pro xl', 'px9pxl', 'google pixel 9 pro xl'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1344, height: 2992 },
    aspectRatio: '20:9',
    physicalDimensions: { width: 76.5, height: 162.8, depth: 8.5, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 48, bezelWidth: 10 },
    screen: { cornerRadius: 44, offsetX: 10, offsetY: 10, width: 392, height: 895 },
    notch: { type: 'pill', width: 48, height: 14, position: 'center' },
    safeArea: {
      portrait: { top: 48, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 48, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 48 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'pixel-9-pro',
    name: 'Pixel 9 Pro',
    aliases: ['pixel9pro', 'pixel 9 pro', 'px9p', 'google pixel 9 pro'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1280, height: 2856 },
    aspectRatio: '20:9',
    physicalDimensions: { width: 72, height: 152.8, depth: 8.5, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 48, bezelWidth: 10 },
    screen: { cornerRadius: 44, offsetX: 10, offsetY: 10, width: 374, height: 836 },
    notch: { type: 'pill', width: 48, height: 14, position: 'center' },
    safeArea: {
      portrait: { top: 48, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 48, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 48 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'pixel-9',
    name: 'Pixel 9',
    aliases: ['pixel9', 'pixel 9', 'px9', 'google pixel 9'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1080, height: 2424 },
    aspectRatio: '20:9',
    physicalDimensions: { width: 72, height: 152.4, depth: 8.5, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 48, bezelWidth: 10 },
    screen: { cornerRadius: 44, offsetX: 10, offsetY: 10, width: 352, height: 752 },
    notch: { type: 'punch-hole', width: 12, height: 12, position: 'center' },
    safeArea: {
      portrait: { top: 36, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 36, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 36 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    aliases: ['pixel8pro', 'pixel 8 pro', 'px8p', 'google pixel 8 pro'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1344, height: 2992 },
    aspectRatio: '20:9',
    physicalDimensions: { width: 76.5, height: 162.6, depth: 8.2, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 48, bezelWidth: 10 },
    screen: { cornerRadius: 44, offsetX: 10, offsetY: 10, width: 392, height: 895 },
    notch: { type: 'pill', width: 48, height: 14, position: 'center' },
    safeArea: {
      portrait: { top: 48, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 48, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 48 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    aliases: ['pixel8', 'pixel 8', 'px8', 'google pixel 8'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1080, height: 2400 },
    aspectRatio: '20:9',
    physicalDimensions: { width: 70.8, height: 150.5, depth: 8.9, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 48, bezelWidth: 10 },
    screen: { cornerRadius: 44, offsetX: 10, offsetY: 10, width: 352, height: 748 },
    notch: { type: 'punch-hole', width: 12, height: 12, position: 'center' },
    safeArea: {
      portrait: { top: 36, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 36, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 36 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    aliases: ['s24 ultra', 'samsung s24 ultra', 'galaxy s24 ultra', 'sm-s928'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1440, height: 3120 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 79, height: 162.3, depth: 8.6, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 45, bezelWidth: 10 },
    screen: { cornerRadius: 41, offsetX: 10, offsetY: 10, width: 412, height: 892 },
    notch: { type: 'punch-hole', width: 10, height: 10, position: 'center' },
    safeArea: {
      portrait: { top: 40, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 40, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 40 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'samsung-s24-plus',
    name: 'Samsung Galaxy S24+',
    aliases: ['s24+', 'samsung s24+', 'galaxy s24+', 'sm-s726'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1440, height: 3120 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 75.9, height: 158.5, depth: 7.7, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 45, bezelWidth: 10 },
    screen: { cornerRadius: 41, offsetX: 10, offsetY: 10, width: 412, height: 892 },
    notch: { type: 'punch-hole', width: 10, height: 10, position: 'center' },
    safeArea: {
      portrait: { top: 40, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 40, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 40 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'samsung-s24',
    name: 'Samsung Galaxy S24',
    aliases: ['s24', 'samsung s24', 'galaxy s24', 'sm-s721'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1080, height: 2340 },
    aspectRatio: '19.5:9',
    physicalDimensions: { width: 70.6, height: 147, depth: 7.6, unit: 'mm' },
    frame: { color: '#2c2c2e', cornerRadius: 45, bezelWidth: 10 },
    screen: { cornerRadius: 41, offsetX: 10, offsetY: 10, width: 310, height: 668 },
    notch: { type: 'punch-hole', width: 10, height: 10, position: 'center' },
    safeArea: {
      portrait: { top: 30, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 30, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 30 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'samsung-s23-ultra',
    name: 'Samsung Galaxy S23 Ultra',
    aliases: ['s23 ultra', 'samsung s23 ultra', 'galaxy s23 ultra'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1440, height: 3088 },
    aspectRatio: '19.3:9',
    physicalDimensions: { width: 78.1, height: 163.4, depth: 8.9, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 45, bezelWidth: 10 },
    screen: { cornerRadius: 41, offsetX: 10, offsetY: 10, width: 412, height: 884 },
    notch: { type: 'punch-hole', width: 10, height: 10, position: 'center' },
    safeArea: {
      portrait: { top: 40, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 40, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 40 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    aliases: ['oneplus12', 'one plus 12', 'op12'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1440, height: 3168 },
    aspectRatio: '19.8:9',
    physicalDimensions: { width: 75.8, height: 164.3, depth: 9.15, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 45, bezelWidth: 10 },
    screen: { cornerRadius: 41, offsetX: 10, offsetY: 10, width: 412, height: 904 },
    notch: { type: 'punch-hole', width: 10, height: 10, position: 'center' },
    safeArea: {
      portrait: { top: 44, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 44, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 44 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14',
    aliases: ['xiaomi14', 'xiaomi 14', 'mi 14'],
    platform: 'android',
    type: 'phone',
    screenResolution: { width: 1200, height: 2670 },
    aspectRatio: '20:9',
    physicalDimensions: { width: 71.5, height: 152.8, depth: 8.28, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 45, bezelWidth: 10 },
    screen: { cornerRadius: 41, offsetX: 10, offsetY: 10, width: 362, height: 804 },
    notch: { type: 'punch-hole', width: 10, height: 10, position: 'center' },
    safeArea: {
      portrait: { top: 36, bottom: 24, left: 0, right: 0 },
      'landscape-left': { top: 0, bottom: 0, left: 36, right: 24 },
      'landscape-right': { top: 0, bottom: 0, left: 24, right: 36 },
    },
    features: { hasHomeIndicator: false, hasNotch: true, supportsLandscape: true, buttonStyle: 'android-nav' },
  },
  {
    id: 'ipad-pro-13',
    name: 'iPad Pro 13"',
    aliases: ['ipad pro 13', 'ipadpro13', 'ipad pro m4'],
    platform: 'ios',
    type: 'tablet',
    screenResolution: { width: 2048, height: 2732 },
    aspectRatio: '4:3',
    physicalDimensions: { width: 215.5, height: 281.6, depth: 5.1, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 24, bezelWidth: 24 },
    screen: { cornerRadius: 20, offsetX: 24, offsetY: 24, width: 976, height: 1318 },
    notch: { type: 'none', width: 0, height: 0, position: 'center' },
    safeArea: {
      portrait: { top: 24, bottom: 24, left: 24, right: 24 },
      'landscape-left': { top: 24, bottom: 24, left: 24, right: 24 },
      'landscape-right': { top: 24, bottom: 24, left: 24, right: 24 },
    },
    features: { hasHomeIndicator: false, hasNotch: false, supportsLandscape: true },
  },
  {
    id: 'ipad-pro-11-4',
    name: 'iPad Pro 11" (M4)',
    aliases: ['ipad pro 11', 'ipadpro11', 'ipad pro 11 m4'],
    platform: 'ios',
    type: 'tablet',
    screenResolution: { width: 1668, height: 2420 },
    aspectRatio: '3:2',
    physicalDimensions: { width: 177.5, height: 249.7, depth: 5.3, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 20, bezelWidth: 20 },
    screen: { cornerRadius: 16, offsetX: 20, offsetY: 20, width: 794, height: 1154 },
    notch: { type: 'none', width: 0, height: 0, position: 'center' },
    safeArea: {
      portrait: { top: 20, bottom: 20, left: 20, right: 20 },
      'landscape-left': { top: 20, bottom: 20, left: 20, right: 20 },
      'landscape-right': { top: 20, bottom: 20, left: 20, right: 20 },
    },
    features: { hasHomeIndicator: false, hasNotch: false, supportsLandscape: true },
  },
  {
    id: 'ipad-air-13',
    name: 'iPad Air 13"',
    aliases: ['ipad air 13', 'air13', 'ipadair13'],
    platform: 'ios',
    type: 'tablet',
    screenResolution: { width: 1640, height: 2360 },
    aspectRatio: '3:2',
    physicalDimensions: { width: 214.9, height: 280.6, depth: 6.1, unit: 'mm' },
    frame: { color: '#e5e5e5', cornerRadius: 18, bezelWidth: 20 },
    screen: { cornerRadius: 14, offsetX: 20, offsetY: 20, width: 780, height: 1140 },
    notch: { type: 'none', width: 0, height: 0, position: 'center' },
    safeArea: {
      portrait: { top: 20, bottom: 20, left: 20, right: 20 },
      'landscape-left': { top: 20, bottom: 20, left: 20, right: 20 },
      'landscape-right': { top: 20, bottom: 20, left: 20, right: 20 },
    },
    features: { hasHomeIndicator: false, hasNotch: false, supportsLandscape: true },
  },
  {
    id: 'ipad-mini-8',
    name: 'iPad Mini',
    aliases: ['ipadmini', 'ipad mini', 'mini'],
    platform: 'ios',
    type: 'tablet',
    screenResolution: { width: 1488, height: 2266 },
    aspectRatio: '3:2',
    physicalDimensions: { width: 134.8, height: 195.4, depth: 6.3, unit: 'mm' },
    frame: { color: '#1c1c1e', cornerRadius: 16, bezelWidth: 18 },
    screen: { cornerRadius: 12, offsetX: 18, offsetY: 18, width: 708, height: 1097 },
    notch: { type: 'none', width: 0, height: 0, position: 'center' },
    safeArea: {
      portrait: { top: 18, bottom: 18, left: 18, right: 18 },
      'landscape-left': { top: 18, bottom: 18, left: 18, right: 18 },
      'landscape-right': { top: 18, bottom: 18, left: 18, right: 18 },
    },
    features: { hasHomeIndicator: false, hasNotch: false, supportsLandscape: true },
  },
];

export const DEVICE_ALIASES: Record<string, string> = {};
DEVICE_DATABASE.forEach(device => {
  device.aliases.forEach(alias => {
    DEVICE_ALIASES[alias.toLowerCase()] = device.id;
  });
});
