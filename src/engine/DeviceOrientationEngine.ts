import { DEVICE_DATABASE, DEVICE_ALIASES, DeviceDatabaseEntry, DeviceOrientation } from '../data/deviceDatabase';

const deviceCache = new Map<string, DeviceDatabaseEntry | null>();

export class DeviceOrientationEngine {
  private static instance: DeviceOrientationEngine;
  private cache: Map<string, DeviceDatabaseEntry | null>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): DeviceOrientationEngine {
    if (!DeviceOrientationEngine.instance) {
      DeviceOrientationEngine.instance = new DeviceOrientationEngine();
    }
    return DeviceOrientationEngine.instance;
  }

  searchDevice(query: string): DeviceDatabaseEntry | null {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (this.cache.has(normalizedQuery)) {
      return this.cache.get(normalizedQuery) ?? null;
    }

    let result: DeviceDatabaseEntry | null = null;

    const aliasMatch = DEVICE_ALIASES[normalizedQuery];
    if (aliasMatch) {
      result = DEVICE_DATABASE.find(d => d.id === aliasMatch) ?? null;
    }

    if (!result) {
      const exactMatch = DEVICE_DATABASE.find(
        d => d.name.toLowerCase() === normalizedQuery
      );
      result = exactMatch ?? null;
    }

    if (!result) {
      const partialMatch = DEVICE_DATABASE.find(
        d => d.name.toLowerCase().includes(normalizedQuery) ||
             d.aliases.some(a => a.includes(normalizedQuery))
      );
      result = partialMatch ?? null;
    }

    if (!result) {
      result = this.findClosestByAspectRatio(normalizedQuery);
    }

    this.cache.set(normalizedQuery, result);
    return result;
  }

  private findClosestByAspectRatio(_query: string): DeviceDatabaseEntry | null {
    return DEVICE_DATABASE[0] ?? null;
  }

  getDeviceById(id: string): DeviceDatabaseEntry | undefined {
    return DEVICE_DATABASE.find(d => d.id === id);
  }

  getAllDevices(): DeviceDatabaseEntry[] {
    return DEVICE_DATABASE;
  }

  getDevicesByPlatform(platform: 'ios' | 'android'): DeviceDatabaseEntry[] {
    return DEVICE_DATABASE.filter(d => d.platform === platform);
  }

  getDevicesByType(type: 'phone' | 'tablet'): DeviceDatabaseEntry[] {
    return DEVICE_DATABASE.filter(d => d.type === type);
  }

  getOrientationProps(
    device: DeviceDatabaseEntry,
    orientation: DeviceOrientation
  ): {
    width: number;
    height: number;
    safeArea: { top: number; bottom: number; left: number; right: number };
    notchPosition: { x: number; y: number };
    isLandscape: boolean;
  } {
    const isLandscape = orientation !== 'portrait';
    const safeArea = device.safeArea[orientation];
    
    let screenWidth = device.screen.width;
    let screenHeight = device.screen.height;
    let notchX = device.screen.width / 2;
    let notchY = device.screen.offsetY + device.notch.height / 2;

    if (isLandscape) {
      screenWidth = device.screen.height;
      screenHeight = device.screen.width;
      
      if (orientation === 'landscape-left') {
        notchX = device.screen.offsetY + device.notch.height / 2;
        notchY = device.screen.width / 2;
      } else {
        notchX = device.screen.height - device.screen.offsetY - device.notch.height / 2;
        notchY = device.screen.width / 2;
      }
    }

    return {
      width: screenWidth,
      height: screenHeight,
      safeArea,
      notchPosition: { x: notchX, y: notchY },
      isLandscape,
    };
  }

  getRotationAngle(orientation: DeviceOrientation): number {
    switch (orientation) {
      case 'portrait':
        return 0;
      case 'landscape-left':
        return -90;
      case 'landscape-right':
        return 90;
      default:
        return 0;
    }
  }

  supportsOrientation(device: DeviceDatabaseEntry, orientation: DeviceOrientation): boolean {
    if (orientation === 'portrait') return true;
    return device.features.supportsLandscape;
  }

  getAvailableOrientations(device: DeviceDatabaseEntry): DeviceOrientation[] {
    const orientations: DeviceOrientation[] = ['portrait'];
    if (device.features.supportsLandscape) {
      orientations.push('landscape-left', 'landscape-right');
    }
    return orientations;
  }

  clearCache(): void {
    this.cache.clear();
    deviceCache.clear();
  }

  preloadDevices(deviceIds: string[]): void {
    deviceIds.forEach(id => {
      const device = this.getDeviceById(id);
      if (device) {
        this.cache.set(id.toLowerCase(), device);
      }
    });
  }
}

export const deviceEngine = DeviceOrientationEngine.getInstance();
