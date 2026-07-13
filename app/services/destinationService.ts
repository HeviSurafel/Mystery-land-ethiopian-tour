// app/services/destinationService.ts

import { Destination, DestinationFilters, DestinationsResponse, ApiError } from '@/app/types/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class DestinationService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An error occurred'
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getDestinations(filters?: DestinationFilters): Promise<DestinationsResponse> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/destinations?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // Get the raw response
    const result = await this.handleResponse<any>(response);
    
    // Transform the API response to match what the component expects
    return {
      destinations: result.data || [],
      totalPages: result.pagination?.pages || 1,
      total: result.pagination?.total || 0,
      page: result.pagination?.page || 1,
      limit: result.pagination?.limit || 12
    };
  }

  async getDestinationById(id: string): Promise<Destination> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await this.handleResponse<any>(response);
    return result.data;
  }

  async createDestination(destination: Partial<Destination>): Promise<Destination> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(destination),
    });

    const result = await this.handleResponse<any>(response);
    return result.data;
  }

  async updateDestination(id: string, destination: Partial<Destination>): Promise<Destination> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(destination),
    });

    const result = await this.handleResponse<any>(response);
    return result.data;
  }

  async deleteDestination(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    await this.handleResponse<void>(response);
  }

  async bulkDeleteDestinations(ids: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids }),
    });

    await this.handleResponse<void>(response);
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations/bulk-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids, status }),
    });

    await this.handleResponse<void>(response);
  }

  async uploadImages(formData: FormData): Promise<{ urls: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    // The upload API might return a different format
    const result = await this.handleResponse<any>(response);
    
    // Handle different possible response formats
    if (result.urls) return { urls: result.urls };
    if (result.url) return { urls: [result.url] };
    if (result.data?.urls) return { urls: result.data.urls };
    
    return { urls: [] };
  }

  async getDestinationStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/destinations/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await this.handleResponse<any>(response);
    return result.data || result;
  }
}

export const destinationService = new DestinationService();