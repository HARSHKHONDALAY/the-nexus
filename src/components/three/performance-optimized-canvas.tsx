"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';

// Performance monitoring component
const PerformanceMonitorComponent: React.FC<{ onPerformanceChange: (fps: number) => void }> = ({ onPerformanceChange }) => {
  useThree();
  const frameCount = useRef(0);
  const lastTime = useRef<number>(0);
useEffect(() => {
  lastTime.current = performance.now();
}, []);
  
  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime.current;
    
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      onPerformanceChange(fps);
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });
  
  return null;
};

// Device capability detection
const getDeviceCapabilities = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isLowEnd: false,
      supportsWebGL2: true,
      maxTextureSize: 2048,
      pixelRatio: 1,
      memory: 8,
      cores: 4
    };
  }
  
  const canvas = document.createElement('canvas');
  const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  interface NavigatorExtended extends Navigator {
  deviceMemory?: number;
}

const memory = (navigator as NavigatorExtended).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isLowEnd = isMobile || memory < 4 || cores < 4;
  
  return {
    isMobile,
    isLowEnd,
    supportsWebGL2: !!canvas.getContext('webgl2'),
    maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
    pixelRatio: Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2),
    memory,
    cores
  };
};

// Performance-aware scene component
const PerformanceAwareScene: React.FC<{ 
  children: React.ReactNode;
  onPerformanceChange?: (fps: number) => void;
}> = ({ children, onPerformanceChange }) => {
  const capabilities = getDeviceCapabilities();
  const [dpr, setDpr] = useState(capabilities.pixelRatio);
  const [shadows, setShadows] = useState(!capabilities.isLowEnd);
  const [antialias, setAntialias] = useState(!capabilities.isLowEnd);
  
  const handlePerformanceChange = (fps: number) => {
    onPerformanceChange?.(fps);
    
    // Dynamic quality adjustment based on performance
    if (fps < 30) {
      setDpr(1);
      setShadows(false);
      setAntialias(false);
    } else if (fps < 45) {
      setDpr(Math.min(capabilities.pixelRatio, 1.5));
      setShadows(false);
    } else {
      setDpr(capabilities.pixelRatio);
      setShadows(true);
      setAntialias(true);
    }
  };
  
  return (
    <Canvas
      dpr={dpr}
      shadows={shadows}
      gl={{
        powerPreference: capabilities.isLowEnd ? 'low-power' : 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
        antialias: antialias
      }}
      camera={{
        fov: capabilities.isMobile ? 60 : 50,
        near: 0.1,
        far: capabilities.isLowEnd ? 100 : 1000
      }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <PerformanceMonitorComponent onPerformanceChange={handlePerformanceChange} />
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
};

// Mobile fallback component
const MobileFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showFallback, setShowFallback] = useState(false);
  
  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    const timer = setTimeout(() => {
      if (capabilities.isLowEnd) {
        setShowFallback(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showFallback) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white p-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Optimized Experience</h3>
          <p className="text-gray-300 mb-4">
            We&apos;ve detected you&apos;re on a mobile device. For the best experience,
            we&apos;ve optimized the visuals to ensure smooth performance.
          </p>
          <button 
            onClick={() => setShowFallback(false)}
            className="px-6 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Continue with 3D
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Error boundary for Three.js
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Three.js Error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

// Main performance-optimized canvas component
interface PerformanceOptimizedCanvasProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onPerformanceChange?: (fps: number) => void;
  enablePerformanceMonitoring?: boolean;
}

export const PerformanceOptimizedCanvas: React.FC<PerformanceOptimizedCanvasProps> = ({
  children,
  fallback,
  onPerformanceChange,
  enablePerformanceMonitoring = true
}) => {
  const capabilities = getDeviceCapabilities();
  
  // Skip Three.js entirely for very low-end devices
  if (capabilities.isLowEnd && !capabilities.supportsWebGL2) {
    return fallback || (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white p-8">
          <h3 className="text-xl font-semibold mb-2">Experience Unavailable</h3>
          <p className="text-gray-300">
            Your device doesn&apos;t support the enhanced visual experience.
            Please try on a newer device or browser.
          </p>
        </div>
      </div>
    );
  }
  
  const defaultFallback = (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center text-white p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading enhanced experience&hellip;</p>
      </div>
    </div>
  );
  
  return (
    <ThreeErrorBoundary fallback={fallback || defaultFallback}>
      <MobileFallback>
        {enablePerformanceMonitoring ? (
          <PerformanceAwareScene onPerformanceChange={onPerformanceChange}>
            {children}
          </PerformanceAwareScene>
        ) : (
          <Canvas
            dpr={capabilities.pixelRatio}
            shadows={!capabilities.isLowEnd}
            gl={{
              powerPreference: capabilities.isLowEnd ? 'low-power' : 'high-performance',
              alpha: false,
              stencil: false,
              depth: true,
              antialias: !capabilities.isLowEnd
            }}
          >
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </Canvas>
        )}
      </MobileFallback>
    </ThreeErrorBoundary>
  );
};

// Performance hook for components
export const usePerformanceOptimization = () => {
  const [fps, setFps] = useState(60);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (fps >= 50) {
        setQuality('high');
      } else if (fps >= 30) {
        setQuality('medium');
      } else {
        setQuality('low');
      }
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [fps]);
  
  return {
    fps,
    quality,
    capabilities: getDeviceCapabilities(),
    setFps
  };
};

export default PerformanceOptimizedCanvas;
