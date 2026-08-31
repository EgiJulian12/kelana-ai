// Use Next.js API routes as proxy to avoid CORS issues
const API_URL = '/api';

export interface Trip {
  id: number;
  destination: string;
  budget: number;
  days: number;
  travel_style: string;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
  created_at: string;
}

export interface CreateTripRequest {
  destination: string;
  budget: number;
  days: number;
  travel_style: string;
}

export interface CreateTripResponse extends Trip {}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Fetch all trips from the API
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const url = `${API_URL}/trips`;
    console.log('🎫 Fetching trips from:', url);
    console.log('🔑 Auth headers:', getAuthHeaders());
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      cache: 'no-store', // Disable caching for debugging
    });
    
    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      type: response.type
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      let errorText = '';
      try {
        if (contentType?.includes('application/json')) {
          const errorJson = await response.json();
          errorText = JSON.stringify(errorJson);
        } else {
          errorText = await response.text();
        }
      } catch (e) {
        errorText = 'Could not parse error response';
      }
      
      console.error('❌ Failed to fetch trips:', { 
        status: response.status, 
        statusText: response.statusText,
        errorText,
        url: response.url
      });
      
      // Handle 401 specially
      if (response.status === 401) {
        throw new Error('401: Unauthorized - Please login again');
      }
      
      throw new Error(`Failed to fetch trips: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Trips fetched successfully:', Array.isArray(data) ? `${data.length} trips` : data);
    return data;
  } catch (error: any) {
    console.error('💥 Error fetching trips:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Fetch a single trip by ID
 */
export async function getTrip(id: string | number): Promise<Trip> {
  try {
    const url = `${API_URL}/trips/${id}`;
    console.log('🎫 Fetching trip:', url);
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Trip not found');
      }
      if (response.status === 401) {
        throw new Error('401: Unauthorized - Please login again');
      }
      throw new Error(`Failed to fetch trip: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Trip fetched successfully');
    return data;
  } catch (error: any) {
    console.error(`💥 Error fetching trip ${id}:`, error);
    throw error;
  }
}

/**
 * Generate a new trip with AI recommendation
 */
export async function generateTrip(request: CreateTripRequest): Promise<CreateTripResponse> {
  try {
    const payload = {
      destination: request.destination,
      days: request.days,
      budget: request.budget,
      travel_style: request.travel_style,
    };
    
    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle different error formats
      let errorMessage = `Failed to generate trip: ${response.statusText}`;
      
      if (errorData.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // FastAPI validation errors
          errorMessage = errorData.detail.map((err: any) => 
            `${err.loc?.join('.') || 'Error'}: ${err.msg}`
          ).join(', ');
        } else if (typeof errorData.detail === 'object') {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating trip:', error);
    throw error;
  }
}
