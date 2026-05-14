/**
 * Production-ready API client for The Nexus
 * Handles SSR safety, timeouts, retries, and graceful fallbacks
 */

// API Configuration with proper environment handling
export class ApiConfig {
  private static instance: ApiConfig;
  
  private constructor() {}
  
  static getInstance(): ApiConfig {
    if (!ApiConfig.instance) {
      ApiConfig.instance = new ApiConfig();
    }
    return ApiConfig.instance;
  }
  
  getBaseUrl(): string {
    // Production: must be explicitly configured
    if (process.env.NODE_ENV === "production") {
      const prodUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!prodUrl) {
        throw new Error("API_BASE_URL must be configured in production");
      }
      return prodUrl;
    }
    
    // Development: use configured URL or fallback
    return (
      process.env.DEV_API_BASE_URL ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "getApiBaseUrl()"
    );
  }
  
  getTimeout(): number {
    return parseInt(process.env.API_TIMEOUT || "10000", 10);
  }
  
  getMaxRetries(): number {
    return parseInt(process.env.API_MAX_RETRIES || "2", 10);
  }
  
  isServerSide(): boolean {
    return typeof window === "undefined";
  }
  
  shouldSkipApiCall(): boolean {
    // Skip API calls during build/static generation
    return this.isServerSide() && (
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NODE_ENV === "production" && !process.env.API_BASE_URL
    );
  }
}

// Enhanced error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, originalError?: Error) {
    super(message, undefined, "NETWORK_ERROR", originalError);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string) {
    super(message, undefined, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

// Safe fetch wrapper with timeout and retry logic
async function safeFetch(
  url: string,
  options: RequestInit & { timeout?: number; retries?: number } = {}
): Promise<Response> {
  const config = ApiConfig.getInstance();
  const timeout = options.timeout || config.getTimeout();
  const maxRetries = options.retries || config.getMaxRetries();
  
  let lastError: Error = new Error("Unknown error");
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            `HTTP_${response.status}`
          );
        }
        
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx) or timeout errors
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      if (error instanceof TimeoutError) {
        throw error;
      }
      
      // Log retry attempt
      if (attempt < maxRetries) {
        console.warn(`API request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  // All retries failed
  if (lastError instanceof NetworkError || lastError instanceof TimeoutError) {
    throw lastError;
  }
  
  throw new NetworkError(`API request failed after ${maxRetries + 1} attempts`, lastError);
}

// Main API client class
export class ApiClient {
  private config: ApiConfig;
  
  constructor() {
    this.config = ApiConfig.getInstance();
  }
  
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Skip API calls during build/static generation
    if (this.config.shouldSkipApiCall()) {
      console.log(`⏭️ Skipping API call during build: ${path}`);
      throw new ApiError("API calls disabled during build", undefined, "BUILD_SKIP");
    }
    
    const url = `${this.config.getBaseUrl()}${path}`;
    
    // Default headers
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "The-Nexus-Frontend/1.0",
      ...options.headers,
    };
    
    // Determine caching strategy for SSR
    const cacheOptions = this.getCacheOptions(path, options);
    
    try {
      console.log(`🌐 API request: ${options.method || "GET"} ${url}`);
      
      const response = await safeFetch(url, {
        ...options,
        headers,
        ...cacheOptions,
      } as RequestInit & { timeout?: number; retries?: number });
      
      const data = await response.json();
      
      // Handle different response formats
      if (data && typeof data === "object") {
        // Spring Boot API format: { success: true, data: {...}, message: "..." }
        if ("success" in data && "data" in data) {
          if (data.success) {
            return data.data as T;
          } else {
            throw new ApiError(data.message || "API request failed", undefined, "API_ERROR");
          }
        }
        
        // Direct data format
        return data as T;
      }
      
      return data as T;
    } catch (error) {
      console.error(`❌ API request failed: ${options.method || "GET"} ${url}`, error);
      throw error;
    }
  }
  
  private getCacheOptions(path: string, options: RequestInit): RequestInit {
    // Don't cache mutations
    if (options.method && options.method !== "GET") {
      return { cache: "no-store" as RequestCache };
    }
    
    // SSR caching strategy
    if (this.config.isServerSide()) {
      // Public endpoints: use ISR
      if (path.startsWith("/events/public") || path.startsWith("/public/")) {
        return { next: { revalidate: 60 } };
      }
      
      // Admin endpoints: no caching
      if (path.startsWith("/admin") || path.startsWith("/operations/admin")) {
        return { cache: "no-store" as RequestCache };
      }
      
      // Default: ISR
      return { next: { revalidate: 300 } };
    }
    
    // Client-side: no caching by default
    return { cache: "no-store" as RequestCache };
  }
  
  // HTTP methods
  async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }
  
  async post<T>(path: string, data?: Record<string, unknown>, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async put<T>(path: string, data?: Record<string, unknown>, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async patch<T>(path: string, data?: Record<string, unknown>, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
  
  // FormData support
  async postFormData<T>(path: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        ...options.headers,
        // Don't set Content-Type for FormData (browser sets it with boundary)
      },
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Utility functions for common patterns
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError && error.code === "BUILD_SKIP") {
      console.log(`⏭️ Using fallback for ${context || "API call"} during build`);
      return fallback;
    }
    
    console.error(`❌ API call failed${context ? ` (${context})` : ""}:`, error);
    return fallback;
  }
}

// Type-safe API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: string;
}

export function createApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
}
