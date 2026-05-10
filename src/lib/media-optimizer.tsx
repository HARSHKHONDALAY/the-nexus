"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";

export interface OptimizedMediaProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// CDN base URL for production
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || "";

interface NavigatorConnection {
  effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NavigatorConnection;
  mozConnection?: NavigatorConnection;
  webkitConnection?: NavigatorConnection;
}

// Device detection for responsive loading
const getDeviceCapabilities = () => {
  if (typeof window === "undefined") {
    return { isMobile: false, isSlowConnection: false, supportsWebP: true, supportsAVIF: true };
  }
  
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const isSlowConnection = connection ? (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") : false;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check format support
  const canvas = document.createElement("canvas");
  const supportsWebP = canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  const supportsAVIF = canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
  
  return { isMobile, isSlowConnection, supportsWebP, supportsAVIF };
};

const normalizeSrc = (src: string) => (src.startsWith("/") ? src.slice(1) : src);

const splitAssetPath = (src: string) => {
  const normalizedSrc = normalizeSrc(src);
  const lastDotIndex = normalizedSrc.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return { basePath: normalizedSrc, extension: "" };
  }

  return {
    basePath: normalizedSrc.slice(0, lastDotIndex),
    extension: normalizedSrc.slice(lastDotIndex + 1),
  };
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  src: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
): string => {
  const { width, height, quality = 75, format = "auto" } = options;
  const capabilities = getDeviceCapabilities();
  
  // If CDN is available, construct CDN URL
  if (CDN_BASE_URL && !src.startsWith("http")) {
    const { basePath, extension } = splitAssetPath(src);
    
    // Determine best format
    let imageFormat: "webp" | "avif" | string = extension || "jpg";
    if (format === "auto") {
      if (capabilities.supportsAVIF && !capabilities.isSlowConnection) {
        imageFormat = "avif";
      } else if (capabilities.supportsWebP) {
        imageFormat = "webp";
      }
    } else {
      imageFormat = format;
    }
    
    // For thumbnails
    if (width && width <= 300) {
      return `${CDN_BASE_URL}/${basePath}/thumbnails.jpg`;
    }

    const params = new URLSearchParams();
    if (width) params.set("w", String(width));
    if (height) params.set("h", String(height));
    params.set("q", String(quality));

    const query = params.toString();
    return `${CDN_BASE_URL}/${basePath}/optimized.${imageFormat}${query ? `?${query}` : ""}`;
  }
  
  // Fallback to original or Next.js Image optimization
  return src;
};

// Optimized Image component
export const OptimizedImage: React.FC<OptimizedMediaProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fallbackSrc,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    const optimizedSrc = getOptimizedImageUrl(src, { width, height });
    if (isMounted) {
      requestAnimationFrame(() => setImageSrc(optimizedSrc));
    }
    return () => {
      isMounted = false;
    };
  }, [src, width, height]);
  
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };
  
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    onError?.();
  };
  
  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

// Video optimization utilities
export const getOptimizedVideoUrl = (
  src: string,
  options: {
    quality?: "low" | "medium" | "high";
    format?: "mp4" | "hls";
    mobile?: boolean;
  } = {}
): string => {
  const { quality = "medium", format = "mp4", mobile = false } = options;
  const capabilities = getDeviceCapabilities();
  
  if (CDN_BASE_URL && !src.startsWith("http")) {
    const { basePath } = splitAssetPath(src);
    
    // Use HLS for better streaming on mobile
    if (format === "hls" || (capabilities.isMobile && !mobile)) {
      return `${CDN_BASE_URL}/${basePath}.m3u8`;
    }
    
    // Use optimized MP4
    const qualitySegment = quality === "high" ? "1080p" : quality === "low" ? "480p" : "720p";
    return `${CDN_BASE_URL}/${basePath}/optimized-${qualitySegment}.mp4`;
  }
  
  return src;
};

// Lazy loading video component
export const OptimizedVideo: React.FC<{
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}> = ({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  playsInline = true,
  onLoad,
  onError
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    const optimizedSrc = getOptimizedVideoUrl(src, { mobile: true });
    if (isMounted) {
      requestAnimationFrame(() => setVideoSrc(optimizedSrc));
    }
    return () => {
      isMounted = false;
    };
  }, [src]);
  
  const handleLoadedData = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    console.error("Video failed to load:", src);
    onError?.();
  };
  
  return (
    <video
      src={videoSrc}
      poster={poster ? getOptimizedImageUrl(poster, { width: 300 }) : undefined}
      className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline={playsInline}
      onLoadedData={handleLoadedData}
      onError={handleError}
      preload="metadata"
    />
  );
};

// Progressive image loading for galleries
export const ProgressiveImage: React.FC<{
  src: string;
  tinySrc?: string;
  alt: string;
  className?: string;
}> = ({ src, tinySrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(tinySrc || src);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const img = new window.Image();
      img.src = getOptimizedImageUrl(src);
      img.onload = () => {
        setImgSrc(getOptimizedImageUrl(src));
        setIsLoading(false);
      };
    }
  }, [src]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        unoptimized
        sizes="100vw"
        className={`transition-all duration-500 ${isLoading ? 'scale-110 blur-xl' : 'scale-100 blur-0'}`}
      />
    </div>
  );
};

// Media preloading utilities
export const preloadMedia = (sources: string[], type: "image" | "video" = "image") => {
  if (typeof window === "undefined") return;
  
  sources.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = type === 'image' ? getOptimizedImageUrl(src) : getOptimizedVideoUrl(src);
    link.as = type;
    document.head.appendChild(link);
  });
};

// Critical media preloader for above-the-fold content
export const preloadCriticalMedia = () => {
  const criticalImages = [
    "/images/hero-background.jpg",
    "/images/logo.svg",
    "/images/founder-avatar.jpg"
  ];
  
  const criticalVideos = [
    "/videos/hero-background.mp4"
  ];
  
  preloadMedia(criticalImages, 'image');
  preloadMedia(criticalVideos, 'video');
};
