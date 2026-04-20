import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { DeviceDatabaseEntry, DeviceOrientation } from '../../data/deviceDatabase';
import { deviceEngine } from '../../engine/DeviceOrientationEngine';

interface Device3DRendererProps {
  device: DeviceDatabaseEntry;
  orientation: DeviceOrientation;
  screenshotSrc: string;
  cameraAngle?: 'front' | 'tilt-left' | 'tilt-right' | 'isometric';
}

const getCameraPosition = (angle: string): [number, number, number] => {
  switch (angle) {
    case 'front':
      return [0, 0, 8];
    case 'tilt-left':
      return [-4, 1.5, 6];
    case 'tilt-right':
      return [4, 1.5, 6];
    case 'isometric':
      return [5, 4, 5];
    default:
      return [0, 0, 8];
  }
};

interface DeviceFrame3DProps {
  device: DeviceDatabaseEntry;
  orientation: DeviceOrientation;
}

const DeviceFrame3D: React.FC<DeviceFrame3DProps> = ({ device, orientation }) => {
  const isLandscape = orientation !== 'portrait';
  
  const frameWidth = isLandscape ? device.physicalDimensions.height : device.physicalDimensions.width;
  const frameHeight = isLandscape ? device.physicalDimensions.width : device.physicalDimensions.height;
  const depth = device.physicalDimensions.depth;
  
  const aspectRatio = frameWidth / frameHeight;
  const normalizedWidth = 3;
  const normalizedHeight = normalizedWidth / aspectRatio;
  
  const frameColor = device.frame.color;
  const isTitanium = frameColor === '#1c1c1e';
  
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[normalizedWidth, normalizedHeight, depth / 20]} />
        <meshStandardMaterial 
          color={frameColor} 
          metalness={0.9} 
          roughness={0.15}
        />
      </mesh>
      
      {isTitanium && (
        <mesh position={[0, 0, -depth / 40 - 0.001]}>
          <planeGeometry args={[normalizedWidth * 0.98, normalizedHeight * 0.98]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
        </mesh>
      )}
      
      <mesh position={[0, 0, depth / 40 + 0.001]}>
        <planeGeometry args={[normalizedWidth * 0.92, normalizedHeight * 0.92]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

interface DeviceScreen3DProps {
  device: DeviceDatabaseEntry;
  orientation: DeviceOrientation;
  screenshotSrc: string;
}

const DeviceScreen3D: React.FC<DeviceScreen3DProps> = ({ device, orientation, screenshotSrc }) => {
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const isLandscape = orientation !== 'portrait';
  
  const screenWidth = isLandscape ? device.screen.height : device.screen.width;
  const screenHeight = isLandscape ? device.screen.width : device.screen.height;
  const aspectRatio = screenWidth / screenHeight;
  
  const normalizedWidth = 3;
  const screenPlaneWidth = normalizedWidth * 0.88;
  const screenPlaneHeight = screenPlaneWidth / aspectRatio;
  
  const depth = device.physicalDimensions.depth;
  
  useEffect(() => {
    if (screenshotSrc) {
      const loader = new THREE.TextureLoader();
      loader.load(screenshotSrc, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
      });
    }
    return () => {
      texture?.dispose();
    };
  }, [screenshotSrc]);

  return (
    <group position={[0, 0, depth / 20 + 0.01]}>
      <mesh>
        <planeGeometry args={[screenPlaneWidth, screenPlaneHeight]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#1a1a2e" />
        )}
      </mesh>
    </group>
  );
};

interface Notch3DProps {
  device: DeviceDatabaseEntry;
  orientation: DeviceOrientation;
}

const Notch3D: React.FC<Notch3DProps> = ({ device, orientation }) => {
  const isLandscape = orientation !== 'portrait';
  const notch = device.notch;
  
  if (notch.type === 'none') return null;
  
  const frameWidth = isLandscape ? device.physicalDimensions.height : device.physicalDimensions.width;
  const frameHeight = isLandscape ? device.physicalDimensions.width : device.physicalDimensions.height;
  const deviceAspectRatio = frameWidth / frameHeight;
  
  const normalizedWidth = 3;
  const normalizedHeight = normalizedWidth / deviceAspectRatio;
  
  const notchWidth = (isLandscape ? notch.height : notch.width) / frameWidth * normalizedWidth;
  const notchHeight = (isLandscape ? notch.width : notch.height) / frameHeight * normalizedHeight;
  
  const notchY = (normalizedHeight / 2) - (device.screen.offsetY / frameHeight * normalizedHeight) - notchHeight / 2;
  
  const depth = device.physicalDimensions.depth;
  
  if (notch.type === 'dynamic-island') {
    return (
      <group position={[0, notchY, depth / 20 + 0.015]}>
        <mesh>
          <boxGeometry args={[notchWidth, notchHeight, 0.01]} />
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    );
  }
  
  if (notch.type === 'notch') {
    return (
      <group position={[0, notchY, depth / 20 + 0.015]}>
        <mesh>
          <boxGeometry args={[notchWidth, notchHeight, 0.01]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    );
  }
  
  if (notch.type === 'punch-hole' || notch.type === 'pill') {
    return (
      <group position={[0, notchY, depth / 20 + 0.015]}>
        <mesh>
          <cylinderGeometry args={[notchWidth / 2, notchWidth / 2, 0.02, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    );
  }
  
  return null;
};

interface SideButtons3DProps {
  device: DeviceDatabaseEntry;
}

const SideButtons3D: React.FC<SideButtons3DProps> = ({ device }) => {
  const normalizedWidth = 3;
  const depth = device.physicalDimensions.depth;
  const buttonWidth = 0.03;
  const buttonLength = 0.15;
  
  const isTitanium = device.frame.color === '#1c1c1e';
  
  const powerX = normalizedWidth / 2 + buttonWidth;
  const volumeX = -normalizedWidth / 2 - buttonWidth;
  const buttonColor = isTitanium ? '#3a3a3a' : '#4a4a4a';
  
  return (
    <group>
      <mesh position={[powerX, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[buttonLength, buttonWidth, depth / 25]} />
        <meshStandardMaterial color={buttonColor} metalness={0.8} roughness={0.3} />
      </mesh>
      
      <mesh position={[volumeX, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[buttonLength * 0.8, buttonWidth, depth / 25]} />
        <meshStandardMaterial color={buttonColor} metalness={0.8} roughness={0.3} />
      </mesh>
      
      <mesh position={[volumeX, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[buttonLength * 0.8, buttonWidth, depth / 25]} />
        <meshStandardMaterial color={buttonColor} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

const DeviceModel: React.FC<Device3DRendererProps> = ({ device, orientation, screenshotSrc }) => {
  return (
    <group rotation={[0, 0, 0]}>
      <DeviceFrame3D device={device} orientation={orientation} />
      <DeviceScreen3D device={device} orientation={orientation} screenshotSrc={screenshotSrc} />
      <Notch3D device={device} orientation={orientation} />
      <SideButtons3D device={device} />
    </group>
  );
};

export const Device3DCanvas: React.FC<Device3DRendererProps> = ({ device, orientation, screenshotSrc, cameraAngle = 'front' }) => {
  const cameraPosition = getCameraPosition(cameraAngle);

  return (
    <div className="w-full h-full" style={{ background: 'transparent' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={35} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={4} 
          maxDistance={15}
          enableRotate={cameraAngle !== 'front'}
          autoRotate={false}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 0, 10]} intensity={0.3} />
        
        <Environment preset="studio" />
        
        <DeviceModel device={device} orientation={orientation} screenshotSrc={screenshotSrc} />
      </Canvas>
    </div>
  );
};

interface Device3DPreviewProps {
  deviceId: string;
  orientation: DeviceOrientation;
  screenshotSrc: string;
  width: number;
  height: number;
  cameraAngle?: 'front' | 'tilt-left' | 'tilt-right' | 'isometric';
}

export const Device3DPreview: React.FC<Device3DPreviewProps> = ({
  deviceId,
  orientation,
  screenshotSrc,
  width,
  height,
  cameraAngle = 'front',
}) => {
  const device = useMemo(() => deviceEngine.getDeviceById(deviceId), [deviceId]);

  if (!device) {
    return (
      <div 
        className="flex items-center justify-center" 
        style={{ 
          width, 
          height, 
          backgroundColor: '#1a1a1a',
          borderRadius: 8
        }}
      >
        <span style={{ color: '#666', fontSize: 12 }}>Device not found</span>
      </div>
    );
  }

  return (
    <div style={{ width, height, overflow: 'hidden', borderRadius: 8 }}>
      <Device3DCanvas 
        device={device} 
        orientation={orientation} 
        screenshotSrc={screenshotSrc}
        cameraAngle={cameraAngle}
      />
    </div>
  );
};

export default Device3DCanvas;