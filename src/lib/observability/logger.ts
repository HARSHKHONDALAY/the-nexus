import { randomUUID } from 'crypto';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  performance?: {
    duration?: number;
    memory?: number;
    fps?: number;
  };
  service: string;
  version: string;
  environment: string;
}

// Logger configuration
interface LoggerConfig {
  service: string;
  version: string;
  environment: string;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  minLevel: LogLevel;
}

class Logger {
  private config: LoggerConfig;
  private sessionId: string;
  private requestId?: string;
  private userId?: string;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.sessionId = randomUUID();
  }

  // Set request context for API calls
  setRequestContext(requestId: string, userId?: string) {
    this.requestId = requestId;
    this.userId = userId;
    return this;
  }

  // Clear request context
  clearRequestContext() {
    this.requestId = undefined;
    this.userId = undefined;
  }

  // Create log entry
  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      requestId: this.requestId,
      userId: this.userId,
      sessionId: this.sessionId,
      metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as { code?: string }).code
      } : undefined,
      service: this.config.service,
      version: this.config.version,
      environment: this.config.environment
    };
  }

  // Log methods
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error) {
    const entry = this.createLogEntry(level, message, metadata, error);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Remote logging
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.logToRemote(entry);
    }
  }

  private logToConsole(entry: LogEntry) {
    const logMethod = entry.level === LogLevel.ERROR ? 'error' :
                    entry.level === LogLevel.WARN ? 'warn' :
                    entry.level === LogLevel.INFO ? 'info' : 'debug';

    const logData = {
      ...entry,
      // Pretty print for development
      ...(process.env.NODE_ENV === 'development' && {
        timestamp: new Date(entry.timestamp).toLocaleTimeString(),
        service: `[${entry.service}]`,
        level: entry.level.toUpperCase(),
        requestId: entry.requestId ? `[${entry.requestId}]` : ''
      })
    };

    console[logMethod](JSON.stringify(logData, null, 2));
  }

  private async logToRemote(entry: LogEntry) {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Log-Level': entry.level
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote endpoint:', error);
      console.log('Original log entry:', entry);
    }
  }

  // Public API
  debug(message: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  // Performance logging
  performance(operation: string, duration: number, metadata?: Record<string, unknown>) {
    this.info(`Performance: ${operation}`, {
      ...metadata,
      performance: { duration }
    });
  }

  // API request logging
  apiRequest(method: string, url: string, statusCode: number, duration: number, metadata?: Record<string, unknown>) {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, `API ${method} ${url}`, {
      ...metadata,
      statusCode,
      duration,
      type: 'api_request'
    });
  }

  // Authentication logging
  auth(action: string, success: boolean, userId?: string, metadata?: Record<string, unknown>) {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    this.log(level, `Auth ${action}`, {
      ...metadata,
      userId,
      success,
      type: 'auth'
    });
  }

  // Payment logging
  payment(action: string, success: boolean, userId?: string, amount?: number, metadata?: Record<string, unknown>) {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    this.log(level, `Payment ${action}`, {
      ...metadata,
      userId,
      amount,
      success,
      type: 'payment'
    });
  }

  // Booking logging
  booking(action: string, success: boolean, userId?: string, eventId?: string, metadata?: Record<string, unknown>) {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    this.log(level, `Booking ${action}`, {
      ...metadata,
      userId,
      eventId,
      success,
      type: 'booking'
    });
  }
}

// Default logger instance
export const logger = new Logger({
  service: 'thenexus-frontend',
  version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
});

import { useState } from 'react';
export const useLogger = (service?: string) => {
  return {
    logger: service ? new Logger({
      service,
      version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
      enableConsole: true,
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
      minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
    }) : logger,
    
    setRequestContext: (requestId: string, userId?: string) => {
      logger.setRequestContext(requestId, userId);
    },
    
    clearRequestContext: () => {
      logger.clearRequestContext();
    }
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    renderTime: 0
  });

  const measurePerformance = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    logger.performance(name, duration, {
      memory: (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize,
      fps: metrics.fps
    });
    
    setMetrics((prev) => ({ ...prev, renderTime: duration }));
  };

  const updateFPS = (fps: number) => {
    setMetrics((prev) => ({ ...prev, fps }));
  };

  return {
    metrics,
    measurePerformance,
    updateFPS
  };
};

// Request ID middleware for Next.js
import type { NextApiRequest, NextApiResponse } from "next";

export const requestLogger = (
  req: NextApiRequest & { user?: { id?: string }; requestId?: string; socket?: { remoteAddress?: string } },
  res: NextApiResponse,
  next: () => void
) => {
  const headerValue = req.headers["x-request-id"];
  const requestId = Array.isArray(headerValue) ? headerValue[0] : headerValue || randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  logger.setRequestContext(requestId, req.user?.id);

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const ip = (req as { ip?: string; socket?: { remoteAddress?: string } }).ip || req.socket?.remoteAddress || "unknown";
    const userAgent = Array.isArray(req.headers["user-agent"])
      ? req.headers["user-agent"][0]
      : req.headers["user-agent"] || "unknown";

    logger.apiRequest(req.method || "UNKNOWN", req.url || "UNKNOWN", res.statusCode, duration, {
      userAgent,
      ip,
    });
    logger.clearRequestContext();
  });

  next();
};

export default logger;
