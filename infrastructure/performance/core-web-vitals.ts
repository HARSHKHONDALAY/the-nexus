// Core Web Vitals optimization utilities
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';
import { useState, useEffect } from 'react';

interface VitalMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

interface PerformanceReport {
  url: string;
  timestamp: number;
  userAgent: string;
  connection: string;
  metrics: VitalMetrics;
  device: {
    isMobile: boolean;
    memory?: number;
    cores?: number;
  };
}

class PerformanceMonitor {
  private metrics: Partial<VitalMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private reportCallback?: (report: PerformanceReport) => void;

  constructor(reportCallback?: (report: PerformanceReport) => void) {
    this.reportCallback = reportCallback;
    this.initializeWebVitals();
    this.observeResourceTiming();
    this.observeLongTasks();
  }

  private initializeWebVitals() {
    // Largest Contentful Paint (LCP)
    onLCP((metric: Metric) => {
      this.metrics.lcp = metric.value;
      this.checkAndReport();
    });

    // Interaction to Next Paint (INP)
    onINP((metric: Metric) => {
      this.metrics.fid = metric.value;
      this.checkAndReport();
    });

    // Cumulative Layout Shift (CLS)
    onCLS((metric: Metric) => {
      this.metrics.cls = metric.value;
      this.checkAndReport();
    });

    // First Contentful Paint (FCP)
    onFCP((metric: Metric) => {
      this.metrics.fcp = metric.value;
      this.checkAndReport();
    });

    // Time to First Byte (TTFB)
    onTTFB((metric: Metric) => {
      this.metrics.ttfb = metric.value;
      this.checkAndReport();
    });
  }

  private observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.analyzeResourceTiming(entry as PerformanceResourceTiming);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private observeLongTasks() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'longtask') {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    this.observers.push(observer);
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming) {
    const duration = entry.responseEnd - entry.requestStart;
    const size = entry.transferSize || 0;

    // Log slow resources
    if (duration > 2000) {
      console.warn('Slow resource:', {
        name: entry.name,
        duration: Math.round(duration),
        size: Math.round(size / 1024) + 'KB'
      });
    }

    // Log large resources
    if (size > 1024 * 1024) { // > 1MB
      console.warn('Large resource:', {
        name: entry.name,
        size: Math.round(size / 1024 / 1024) + 'MB',
        duration: Math.round(duration)
      });
    }
  }

  private checkAndReport() {
    if (this.isComplete() && this.reportCallback) {
      const report = this.createReport();
      this.reportCallback(report);
    }
  }

  private isComplete(): boolean {
    return !!(
      this.metrics.lcp !== undefined &&
      this.metrics.fid !== undefined &&
      this.metrics.cls !== undefined &&
      this.metrics.fcp !== undefined &&
      this.metrics.ttfb !== undefined
    );
  }

  private createReport(): PerformanceReport {
    const connection = this.getConnectionInfo();
    const device = this.getDeviceInfo();

    return {
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection,
      metrics: this.metrics as VitalMetrics,
      device
    };
  }

  private getConnectionInfo(): string {
    interface NavigatorConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

const nav = navigator as Navigator & { connection?: NavigatorConnection; mozConnection?: NavigatorConnection; webkitConnection?: NavigatorConnection };
const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (!connection) return 'unknown';

    return `${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'}Mbps)`;
  }

  private getDeviceInfo() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    return { isMobile, memory, cores };
  }

  // Performance optimization suggestions
  getOptimizations(): string[] {
    const suggestions: string[] = [];
    const metrics = this.metrics;

    if (metrics.lcp && metrics.lcp > 2500) {
      suggestions.push('LCP is slow (>2.5s). Optimize images and reduce server response time.');
    }

    if (metrics.fid && metrics.fid > 100) {
      suggestions.push('FID is high (>100ms). Reduce JavaScript execution time and break up long tasks.');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      suggestions.push('CLS is high (>0.1). Ensure images have dimensions and avoid inserting content above existing content.');
    }

    if (metrics.fcp && metrics.fcp > 1800) {
      suggestions.push('FCP is slow (>1.8s). Optimize server response time and reduce render-blocking resources.');
    }

    if (metrics.ttfb && metrics.ttfb > 800) {
      suggestions.push('TTFB is slow (>800ms). Optimize server response time and use CDN.');
    }

    return suggestions;
  }

  // Cleanup
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Performance scoring
export const calculatePerformanceScore = (metrics: VitalMetrics): number => {
  const weights = {
    lcp: 0.25,
    fid: 0.25,
    cls: 0.25,
    fcp: 0.15,
    ttfb: 0.10
  };

  const scores = {
    lcp: Math.max(0, 100 - (metrics.lcp / 40)), // 4s = 0 points
    fid: Math.max(0, 100 - (metrics.fid / 3)),   // 300ms = 0 points
    cls: Math.max(0, 100 - (metrics.cls * 100)),  // 1.0 = 0 points
    fcp: Math.max(0, 100 - (metrics.fcp / 18)), // 1.8s = 0 points
    ttfb: Math.max(0, 100 - (metrics.ttfb / 8))  // 800ms = 0 points
  };

  return Object.entries(weights).reduce((total, [metric, weight]) => {
    return total + (scores[metric as keyof VitalMetrics] * weight);
  }, 0);
};

// Performance monitoring hook for React
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<Partial<VitalMetrics>>({});
  const [score, setScore] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const monitor = new PerformanceMonitor((report) => {
      setMetrics(report.metrics);
      setScore(calculatePerformanceScore(report.metrics));
      
      const tempMonitor = new PerformanceMonitor();
      setSuggestions(tempMonitor.getOptimizations());
    });

    return () => monitor.destroy();
  }, []);

  const grade = score >= 90 ? 'A' : 
                score >= 80 ? 'B' : 
                score >= 70 ? 'C' : 
                score >= 60 ? 'D' : 'F';

  return {
    metrics,
    score: Math.round(score),
    grade,
    suggestions,
    isGood: score >= 80
  };
};

// Performance budget validation
export const validatePerformanceBudget = (resources: PerformanceResourceTiming[]): boolean => {
  const budget = {
    totalSize: 1024 * 1024 * 2, // 2MB
    scriptSize: 1024 * 500,      // 500KB
    imageSize: 1024 * 1024,      // 1MB
    cssSize: 1024 * 100,         // 100KB
    fontCount: 10,
    requestCount: 50
  };

  const actual = {
    totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
    scriptSize: resources.filter(r => r.name.includes('.js')).reduce((sum, r) => sum + (r.transferSize || 0), 0),
    imageSize: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)).reduce((sum, r) => sum + (r.transferSize || 0), 0),
    cssSize: resources.filter(r => r.name.includes('.css')).reduce((sum, r) => sum + (r.transferSize || 0), 0),
    fontCount: resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)$/i)).length,
    requestCount: resources.length
  };

  const violations: string[] = [];

  if (actual.totalSize > budget.totalSize) {
    violations.push(`Total size ${Math.round(actual.totalSize / 1024)}KB exceeds budget ${Math.round(budget.totalSize / 1024)}KB`);
  }

  if (actual.scriptSize > budget.scriptSize) {
    violations.push(`Script size ${Math.round(actual.scriptSize / 1024)}KB exceeds budget ${Math.round(budget.scriptSize / 1024)}KB`);
  }

  if (actual.imageSize > budget.imageSize) {
    violations.push(`Image size ${Math.round(actual.imageSize / 1024)}KB exceeds budget ${Math.round(budget.imageSize / 1024)}KB`);
  }

  if (actual.cssSize > budget.cssSize) {
    violations.push(`CSS size ${Math.round(actual.cssSize / 1024)}KB exceeds budget ${Math.round(budget.cssSize / 1024)}KB`);
  }

  if (actual.fontCount > budget.fontCount) {
    violations.push(`Font count ${actual.fontCount} exceeds budget ${budget.fontCount}`);
  }

  if (actual.requestCount > budget.requestCount) {
    violations.push(`Request count ${actual.requestCount} exceeds budget ${budget.requestCount}`);
  }

  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
    return false;
  }

  return true;
};

// Automatic performance optimization
export const optimizePageLoad = () => {
  // Preload critical resources
  const criticalResources = [
    '/fonts/inter-var.woff2',
    '/styles/critical.css',
    '/images/hero-background.webp'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = getResourceType(resource);
    document.head.appendChild(link);
  });

  // Prefetch next pages
  const nextPages = ['/events', '/about', '/contact'];
  nextPages.forEach(page => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    document.head.appendChild(link);
  });

  // DNS prefetch for external domains
  const externalDomains = [
    'https://api.stripe.com',
    'https://fonts.googleapis.com',
    'https://cdn.thenexus.com'
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

const getResourceType = (url: string): string => {
  if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
  if (url.match(/\.(css)$/i)) return 'style';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';
  if (url.match(/\.(js)$/i)) return 'script';
  return 'fetch';
};

export default PerformanceMonitor;
