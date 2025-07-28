import { auth } from "./firebase";

/**
 * Base API URL from environment variables
 * Points to local emulator in development, production URL in production
 */
const API_URL = process.env.production.REACT_APP_API_URL;

/**
 * Helper function to get authentication headers
 * @returns {Object} Headers object with authorization token
 */
const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * API service object containing all API calls
 * Each method handles specific endpoint communication
 */
export const apiService = {
  /**
   * Fetch all traffic data from the API
   * @returns {Promise<Array>} Array of traffic entries
   */
  async getTrafficData() {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/traffic`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      throw error;
    }
  },

  /**
   * Create a new traffic entry
   * @param {Object} data - Traffic entry data { date, visits }
   * @returns {Promise<Object>} Created traffic entry with ID
   */
  async createTrafficEntry(data) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/traffic`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create entry");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating traffic entry:", error);
      throw error;
    }
  },

  /**
   * Update existing traffic entry
   * @param {string} id - Entry ID to update
   * @param {Object} data - Updated traffic data { date, visits }
   * @returns {Promise<Object>} Updated traffic entry
   */
  async updateTrafficEntry(id, data) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/traffic/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update entry");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating traffic entry:", error);
      throw error;
    }
  },

  /**
   * Delete a traffic entry
   * @param {string} id - Entry ID to delete
   * @returns {Promise<void>}
   */
  async deleteTrafficEntry(id) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/traffic/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting traffic entry:", error);
      throw error;
    }
  },

  /**
   * Seed initial data (for development/testing)
   * @returns {Promise<Object>} Seed operation result
   */
  async seedData() {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seedData`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to seed data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error seeding data:", error);
      throw error;
    }
  },
};
