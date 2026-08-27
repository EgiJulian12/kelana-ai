const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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

export interface CreateTripResponse {
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

/**
 * Fetch all trips from the API
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const response = await fetch(`${API_URL}/trips`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
}

/**
 * Fetch a single trip by ID
 */
export async function getTrip(id: string | number): Promise<Trip> {
  try {
    const response = await fetch(`${API_URL}/trips/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Trip not found');
      }
      throw new Error(`Failed to fetch trip: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching trip ${id}:`, error);
    throw error;
  }
}

/**
 * Generate a new trip with AI recommendation
 */
export async function generateTrip(request: CreateTripRequest): Promise<CreateTripResponse> {
  try {
    // Convert destination string to array of destinations for backend
    const destinations = request.destination.split(',').map(d => d.trim()).filter(Boolean);
    
    const payload = {
      destinations,
      days: request.days,
      budget: request.budget,
      month: "January", // Default month, bisa diubah kalau perlu
      travel_style: request.travel_style,
    };
    
    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
