import axios from 'axios';
import type { PostalResponse, GeoLocation } from '../types';

const POSTAL_API_BASE = 'https://api.postalpincode.in';
const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org';

export const getPincodeDetails = async (pincode: string): Promise<PostalResponse> => {
  try {
    const response = await axios.get<PostalResponse[]>(`${POSTAL_API_BASE}/pincode/${pincode}`);
    // The API returns an array with one object for some reason, based on typical Indian API patterns, 
    // or the documentation says "returns the response in JSON format". 
    // Let's assume it returns an array as per common behavior with this specific API.
    // Actually, the example shows a single object. But often these APIs return [ { ... } ].
    // I'll handle both.
    const data = response.data;
    if (Array.isArray(data)) {
        return data[0];
    }
    return data as unknown as PostalResponse;
  } catch (error) {
    console.error("Error fetching pincode details:", error);
    return { Message: "Network Error", Status: "Error", PostOffice: null };
  }
};

export const getPostOfficeDetails = async (name: string): Promise<PostalResponse> => {
    try {
      const response = await axios.get<PostalResponse[]>(`${POSTAL_API_BASE}/postoffice/${name}`);
      const data = response.data;
      if (Array.isArray(data)) {
          return data[0];
      }
      return data as unknown as PostalResponse;
    } catch (error) {
      console.error("Error fetching post office details:", error);
      return { Message: "Network Error", Status: "Error", PostOffice: null };
    }
  };

export const getCoordinates = async (query: string): Promise<GeoLocation | null> => {
  try {
    const response = await axios.get<GeoLocation[]>(`${NOMINATIM_API_BASE}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 1
      }
    });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export const getPincodeFromCoordinates = async (lat: number, lon: number): Promise<string | null> => {
  try {
    // Nominatim Reverse Geocoding
    const response = await axios.get(`${NOMINATIM_API_BASE}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 18, // High precision
        addressdetails: 1
      }
    });

    if (response.data && response.data.address) {
        return response.data.address.postcode || null;
    }
    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
};
