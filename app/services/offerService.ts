// app/services/offerService.ts

import { Offer, ApiError } from '@/app/types/types';

export interface OfferFilters {
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface OffersResponse {
  data: Offer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OfferStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  featured: number;
  categoryDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  recentOffers: Offer[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class OfferService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An error occurred'
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // If the response has a data property, return that, otherwise return the whole response
    // This handles both { data: [...] } and [...] formats
    return data.data || data;
  }

  // GET /api/admin/offers - List with filters
  async getOffers(filters?: OfferFilters): Promise<OffersResponse> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/offers?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await this.handleResponse<any>(response);
    
    // Handle both possible response structures
    if (result.data && result.pagination) {
      // Structure: { data: [...], pagination: {...} }
      return {
        data: result.data,
        pagination: result.pagination
      };
    } else if (Array.isArray(result)) {
      // Structure: [...] (just array)
      return {
        data: result,
        pagination: {
          page: 1,
          limit: result.length,
          total: result.length,
          pages: 1
        }
      };
    } else {
      // Fallback
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 1
        }
      };
    }
  }

  // GET /api/admin/offers/[id] - Get single offer
  async getOfferById(id: string): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result;
  }

  // POST /api/admin/offers - Create new offer
  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(offer),
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result;
  }

  // PATCH /api/admin/offers/[id] - Update offer
  async updateOffer(id: string, offer: Partial<Offer>): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(offer),
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result;
  }

  // DELETE /api/admin/offers/[id] - Delete single offer
  async deleteOffer(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    await this.handleResponse<void>(response);
  }

  // POST /api/admin/offers/bulk-delete - Bulk delete offers
  async bulkDeleteOffers(ids: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids }),
    });

    await this.handleResponse<void>(response);
  }

  // PATCH /api/admin/offers/bulk-status - Bulk update status
  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/bulk-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids, status }),
    });

    await this.handleResponse<void>(response);
  }

  // POST /api/admin/offers/[id]/duplicate - Duplicate offer
  async duplicateOffer(id: string): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/${id}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result;
  }

  // GET /api/admin/offers/stats - Get offer statistics
  async getOfferStats(): Promise<OfferStats> {
    const response = await fetch(`${API_BASE_URL}/api/admin/offers/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result;
  }

  // POST /api/upload - Upload images
  async uploadImages(formData: FormData): Promise<{ urls: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const result = await this.handleResponse<any>(response);
    
    // Handle different response formats
    if (result.urls) return { urls: result.urls };
    if (result.url) return { urls: [result.url] };
    if (result.data?.urls) return { urls: result.data.urls };
    
    return { urls: [] };
  }

  // GET /api/tours - Get tours for dropdown (public endpoint)
  async getToursForDropdown(): Promise<{ id: string; name: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/tours?limit=100&fields=id,name`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result || [];
  }

  // GET /api/destinations - Get destinations for dropdown (public endpoint)
  async getDestinationsForDropdown(): Promise<{ id: string; name: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/destinations?limit=100&fields=id,name`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result || [];
  }
}

export const offerService = new OfferService();