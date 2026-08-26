const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

export interface TripPayload {
  destination: string;
  days: number;
  budget: number;
  travel_style: string;
}

export interface TripResponse {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation?: string;
  createdAt?: string;
}

export interface RecommendationResponse {
  trip_id: number;
  destination: string;
  recommendation: string;
}

export const getTrips = async (): Promise<TripResponse[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/trips`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trips (Status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTrips = async (payload: TripPayload): Promise<TripResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Gagal menyimpan data liburan (Status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTripById = async (id: string | number): Promise<TripResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/trips/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trip (Status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateTripRecommendation = async (tripId: number): Promise<RecommendationResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/trips/${tripId}/generate`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Gagal memproses rekomendasi AI (Status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};