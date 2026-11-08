/**
 * ZenCro Unified API Client Layer
 * Adheres strictly to the API Data Contract & Error Handling Specifications
 * 
 * Supports switchable MOCK MODE / REAL MODE via NEXT_PUBLIC_API_MODE or default.
 * Provides standard error envelopes:
 * - AUTH_REQUIRED
 * - FORBIDDEN
 * - NOT_FOUND
 * - VALIDATION_ERROR
 * - CONFLICT
 * - INTERNAL_ERROR
 */

import { ApiErrorCode, ApiErrorDetail } from '@/types/auth';

export class ZenCroApiError extends Error {
  code: ApiErrorCode;
  field?: string;
  statusCode?: number;

  constructor(detail: ApiErrorDetail, statusCode?: number) {
    super(detail.message);
    this.name = 'ZenCroApiError';
    this.code = detail.code;
    this.field = detail.field;
    this.statusCode = statusCode;
  }
}

export interface ApiClientConfig {
  baseUrl?: string;
  isMockMode?: boolean;
}

export const API_CONFIG: ApiClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  isMockMode: process.env.NEXT_PUBLIC_DATA_MODE !== 'real', // Default to robust contract-compatible mock mode
};

export async function handleApiResponse<T>(promise: Promise<Response>): Promise<T> {
  try {
    const res = await promise;
    const json = await res.json();

    if (!res.ok || json.success === false) {
      const errorData: ApiErrorDetail = json.error || {
        code: res.status === 401 ? 'AUTH_REQUIRED' : res.status === 403 ? 'FORBIDDEN' : res.status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
        message: json.message || 'An unexpected API error occurred.',
      };
      throw new ZenCroApiError(errorData, res.status);
    }

    return (json.data !== undefined ? json.data : json) as T;
  } catch (err) {
    if (err instanceof ZenCroApiError) {
      throw err;
    }
    throw new ZenCroApiError({
      code: 'INTERNAL_ERROR',
      message: (err as Error)?.message || 'Network connectivity error or service unavailable.',
    });
  }
}
